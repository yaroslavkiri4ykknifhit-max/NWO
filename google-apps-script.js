/**
 * Защищённый API Google Apps Script для статического сайта NWO на GitHub Pages.
 *
 * Script Properties:
 *   SPREADSHEET_ID       — ID Google Таблицы
 *   TELEGRAM_BOT_TOKEN   — токен @BotFather
 *   SESSION_SECRET       — отдельная случайная строка длиной 32+ символа
 *
 * В браузере нет секретов. После проверки Telegram и инвайт-кода скрипт выдаёт
 * HMAC-подписанный токен на 2 часа. Каждый запрос материалов повторно проверяет
 * подпись токена, Telegram ID, статус и срок доступа в таблице.
 */

var SESSION_TTL_SECONDS = 2 * 60 * 60;

function jsonResponse(value) {
  return ContentService
    .createTextOutput(JSON.stringify(value))
    .setMimeType(ContentService.MimeType.JSON);
}

function getRequiredProperty(name) {
  var value = PropertiesService.getScriptProperties().getProperty(name);
  if (!value) throw new Error('Missing Script Property: ' + name);
  return value;
}

function getSessionSecret() {
  var secret = getRequiredProperty('SESSION_SECRET');
  if (secret.length < 32) throw new Error('SESSION_SECRET must contain at least 32 characters');
  return secret;
}

function constantTimeEquals(left, right) {
  left = String(left || '');
  right = String(right || '');
  var mismatch = left.length ^ right.length;
  var length = Math.max(left.length, right.length);

  for (var i = 0; i < length; i++) {
    mismatch |= (left.charCodeAt(i) || 0) ^ (right.charCodeAt(i) || 0);
  }
  return mismatch === 0;
}

function doGet() {
  return jsonResponse({ error: 'method_not_allowed' });
}

function doPost(e) {
  try {
    var params = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    var result;

    switch (String(params.action || '')) {
      case 'telegram_login':
        result = handleTelegramLogin(params);
        break;
      case 'telegram_bind':
        result = handleTelegramBind(params);
        break;
      case 'session':
        result = handleSession(params.session_token);
        break;
      case 'paid_session':
        result = handlePaidSession(params.session_token);
        break;
      case 'all':
        result = handleAll(params.session_token);
        break;
      case 'paid_all':
        result = handlePaidAll(params.session_token);
        break;
      case 'save_progress':
        result = handleSaveProgress(params.session_token, params.completed_lessons);
        break;
      case 'save_paid_progress':
        result = handleSavePaidProgress(params.session_token, params.completed_lessons);
        break;
      case 'shame_trades':
        result = handleShameTrades(params.session_token);
        break;
      default:
        result = { valid: false, error: 'unknown_action' };
    }

    return jsonResponse(result);
  } catch (error) {
    console.error(error && error.stack ? error.stack : error);
    return jsonResponse({ valid: false, error: 'server_error', message: 'Сервис временно недоступен' });
  }
}

function getSpreadsheet() {
  return SpreadsheetApp.openById(getRequiredProperty('SPREADSHEET_ID'));
}

function sha256Hex(value) {
  var bytes = Utilities.computeDigest(
    Utilities.DigestAlgorithm.SHA_256,
    String(value),
    Utilities.Charset.UTF_8
  );
  var result = '';

  for (var i = 0; i < bytes.length; i++) {
    var byteValue = bytes[i];
    if (byteValue < 0) byteValue += 256;
    result += ('0' + byteValue.toString(16)).slice(-2);
  }
  return result;
}

function normalizeCode(code) {
  return String(code || '').trim().toUpperCase();
}

function consumeLoginAttempt(rateKey, scope) {
  rateKey = String(rateKey || '').trim().toLowerCase();
  if (!/^[a-f0-9]{64}$/.test(rateKey)) return false;

  var lock = LockService.getScriptLock();
  lock.waitLock(3000);
  try {
    var cache = CacheService.getScriptCache();
    var cacheKey = 'rate:' + scope + ':' + rateKey;
    var count = Number(cache.get(cacheKey) || 0);
    if (count >= 6) return false;
    cache.put(cacheKey, String(count + 1), 15 * 60);
    return true;
  } finally {
    lock.releaseLock();
  }
}

function ensureInviteColumns(sheet) {
  var required = [
    'code_hash',
    'telegram_id',
    'telegram_username',
    'completed_lessons',
    'paid_completed_lessons',
    'access_status',
    'expires_at'
  ];
  var lastColumn = Math.max(1, sheet.getLastColumn());
  var headers = sheet.getRange(1, 1, 1, lastColumn).getValues()[0];

  for (var i = 0; i < required.length; i++) {
    if (headers.indexOf(required[i]) === -1) {
      sheet.getRange(1, sheet.getLastColumn() + 1).setValue(required[i]);
      headers.push(required[i]);
    }
  }
}

function getInviteContext() {
  var sheet = getSpreadsheet().getSheetByName('Invites');
  if (!sheet) throw new Error('Invites sheet is missing');

  ensureInviteColumns(sheet);
  var data = sheet.getDataRange().getValues();
  if (!data.length) throw new Error('Invites sheet is empty');
  var headers = data[0].map(function (header) {
    return String(header || '').trim().toLowerCase();
  });

  return {
    sheet: sheet,
    data: data,
    codeIndex: headers.indexOf('code') === -1 ? 0 : headers.indexOf('code'),
    hashIndex: headers.indexOf('code_hash'),
    telegramIdIndex: headers.indexOf('telegram_id'),
    telegramUsernameIndex: headers.indexOf('telegram_username'),
    progressIndex: headers.indexOf('completed_lessons'),
    paidProgressIndex: headers.indexOf('paid_completed_lessons'),
    statusIndex: headers.indexOf('access_status'),
    expiresIndex: headers.indexOf('expires_at')
  };
}

function accessIdForRow(context, row) {
  var storedHash = String(row[context.hashIndex] || '').trim().toLowerCase();
  if (/^[a-f0-9]{64}$/.test(storedHash)) return storedHash;

  var legacyCode = normalizeCode(row[context.codeIndex]);
  return legacyCode ? sha256Hex(legacyCode) : '';
}

function findInviteByCode(context, code) {
  var cleanCode = normalizeCode(code);
  if (cleanCode.length < 8 || cleanCode.length > 128) return null;
  var expectedHash = sha256Hex(cleanCode);

  for (var i = 1; i < context.data.length; i++) {
    var row = context.data[i];
    var storedHash = String(row[context.hashIndex] || '').trim().toLowerCase();
    var legacyCode = normalizeCode(row[context.codeIndex]);

    if (
      (storedHash && constantTimeEquals(storedHash, expectedHash)) ||
      (!storedHash && legacyCode && constantTimeEquals(legacyCode, cleanCode))
    ) {
      if (!storedHash) {
        context.sheet.getRange(i + 1, context.hashIndex + 1).setValue(expectedHash);
        row[context.hashIndex] = expectedHash;
      }
      return { rowIndex: i, row: row, accessId: expectedHash };
    }
  }
  return null;
}

function findInviteByAccessId(context, accessId) {
  accessId = String(accessId || '').trim().toLowerCase();
  if (!/^[a-f0-9]{64}$/.test(accessId)) return null;

  for (var i = 1; i < context.data.length; i++) {
    var row = context.data[i];
    var rowAccessId = accessIdForRow(context, row);
    if (rowAccessId && constantTimeEquals(rowAccessId, accessId)) {
      return { rowIndex: i, row: row, accessId: rowAccessId };
    }
  }
  return null;
}

function inviteIsActive(context, invite) {
  var status = String(invite.row[context.statusIndex] || '').trim().toLowerCase();
  if (['active', 'paid', 'trial'].indexOf(status) === -1) return false;

  var expiresValue = invite.row[context.expiresIndex];
  if (expiresValue) {
    var expiresAt = expiresValue instanceof Date ? expiresValue : new Date(expiresValue);
    if (isNaN(expiresAt.getTime()) || Date.now() >= expiresAt.getTime()) return false;
  }
  return true;
}

function inviteHasPaidAccess(context, invite) {
  return String(invite.row[context.statusIndex] || '').trim().toLowerCase() === 'paid';
}

function base64UrlEncodeString(value) {
  return Utilities.base64EncodeWebSafe(String(value), Utilities.Charset.UTF_8)
    .replace(/=+$/g, '');
}

function base64UrlDecodeString(value) {
  value = String(value || '');
  while (value.length % 4) value += '=';
  return Utilities.newBlob(Utilities.base64DecodeWebSafe(value)).getDataAsString('UTF-8');
}

function signTokenPart(payloadPart) {
  var signature = Utilities.computeHmacSha256Signature(
    Utilities.newBlob(String(payloadPart), 'text/plain', 'UTF-8').getBytes(),
    Utilities.newBlob(getSessionSecret(), 'text/plain', 'UTF-8').getBytes()
  );
  return Utilities.base64EncodeWebSafe(signature).replace(/=+$/g, '');
}

function issueSessionToken(context, invite, telegramProfile) {
  var telegramId = String(invite.row[context.telegramIdIndex] || '').trim();
  if (!telegramId) throw new Error('Cannot issue a session without Telegram ID');

  var now = Math.floor(Date.now() / 1000);
  var payload = {
    v: 1,
    sub: invite.accessId,
    tg: telegramId,
    fn: String(telegramProfile.first_name || 'Участник').slice(0, 128),
    un: String(telegramProfile.username || '').slice(0, 64),
    iat: now,
    exp: now + SESSION_TTL_SECONDS,
    jti: Utilities.getUuid()
  };
  var payloadPart = base64UrlEncodeString(JSON.stringify(payload));
  return payloadPart + '.' + signTokenPart(payloadPart);
}

function authorizeSession(sessionToken) {
  sessionToken = String(sessionToken || '').trim();
  if (!sessionToken || sessionToken.length > 4096) {
    return { valid: false, error: 'session_invalid', message: 'Требуется повторный вход' };
  }

  var parts = sessionToken.split('.');
  if (parts.length !== 2 || !constantTimeEquals(signTokenPart(parts[0]), parts[1])) {
    return { valid: false, error: 'session_invalid', message: 'Сессия повреждена' };
  }

  var payload;
  try {
    payload = JSON.parse(base64UrlDecodeString(parts[0]));
  } catch (error) {
    return { valid: false, error: 'session_invalid', message: 'Сессия повреждена' };
  }

  var now = Math.floor(Date.now() / 1000);
  if (
    payload.v !== 1 ||
    !/^[a-f0-9]{64}$/.test(String(payload.sub || '')) ||
    !payload.tg ||
    !payload.iat ||
    payload.iat > now + 30
  ) {
    return { valid: false, error: 'session_invalid', message: 'Сессия повреждена' };
  }
  if (!payload.exp || payload.exp <= now) {
    return { valid: false, error: 'session_expired', message: 'Сессия истекла. Войдите снова' };
  }

  var context = getInviteContext();
  var invite = findInviteByAccessId(context, payload.sub);
  if (!invite || !inviteIsActive(context, invite)) {
    return { valid: false, error: 'access_inactive', message: 'Доступ истёк или был отозван' };
  }

  var rowTelegramId = String(invite.row[context.telegramIdIndex] || '').trim();
  if (!constantTimeEquals(rowTelegramId, String(payload.tg))) {
    return { valid: false, error: 'session_invalid', message: 'Требуется повторный вход' };
  }

  return { valid: true, context: context, invite: invite, payload: payload };
}

function getProgress(authorization) {
  return String(
    authorization.invite.row[authorization.context.progressIndex] || ''
  ).trim();
}

function getPaidProgress(authorization) {
  return String(
    authorization.invite.row[authorization.context.paidProgressIndex] || ''
  ).trim();
}

function verifyTelegramHash(params) {
  var hash = String(params.hash || '').toLowerCase();
  if (!/^[a-f0-9]{64}$/.test(hash)) return false;

  var authDate = Number(params.auth_date);
  var now = Math.floor(Date.now() / 1000);
  if (!authDate || authDate > now + 30 || now - authDate > 10 * 60) return false;

  var fields = ['auth_date', 'first_name', 'id', 'last_name', 'photo_url', 'username'];
  var dataCheckList = [];
  for (var i = 0; i < fields.length; i++) {
    var field = fields[i];
    if (params[field] !== undefined && params[field] !== null && params[field] !== '') {
      dataCheckList.push(field + '=' + params[field]);
    }
  }
  dataCheckList.sort();

  var secretKey = Utilities.computeDigest(
    Utilities.DigestAlgorithm.SHA_256,
    getRequiredProperty('TELEGRAM_BOT_TOKEN'),
    Utilities.Charset.UTF_8
  );
  var signature = Utilities.computeHmacSha256Signature(
    Utilities.newBlob(dataCheckList.join('\n')).getBytes(),
    secretKey
  );
  var signatureHex = '';
  for (var j = 0; j < signature.length; j++) {
    var byteValue = signature[j];
    if (byteValue < 0) byteValue += 256;
    signatureHex += ('0' + byteValue.toString(16)).slice(-2);
  }
  return constantTimeEquals(signatureHex, hash);
}

function handleTelegramLogin(params) {
  if (!verifyTelegramHash(params)) {
    return { valid: false, error: 'signature_invalid', message: 'Данные Telegram устарели или повреждены' };
  }

  var telegramId = String(params.id || '').trim();
  var context = getInviteContext();

  for (var i = 1; i < context.data.length; i++) {
    if (String(context.data[i][context.telegramIdIndex] || '').trim() === telegramId) {
      var invite = {
        rowIndex: i,
        row: context.data[i],
        accessId: accessIdForRow(context, context.data[i])
      };
      if (!invite.accessId || !inviteIsActive(context, invite)) {
        return { valid: false, error: 'access_inactive', message: 'Доступ истёк или отозван' };
      }
      return {
        valid: true,
        session_token: issueSessionToken(context, invite, params),
        completed_lessons: String(invite.row[context.progressIndex] || '').trim()
      };
    }
  }

  return { valid: false, error: 'not_bound', message: 'Telegram не привязан к доступу' };
}

function handleTelegramBind(params) {
  if (!verifyTelegramHash(params)) {
    return { valid: false, error: 'signature_invalid', message: 'Данные Telegram устарели или повреждены' };
  }

  var telegramId = String(params.id || '').trim();
  if (!consumeLoginAttempt(sha256Hex('bind:' + telegramId), 'bind')) {
    return { valid: false, error: 'rate_limited', message: 'Слишком много попыток. Попробуйте позже' };
  }

  var lock = LockService.getScriptLock();
  lock.waitLock(5000);
  try {
    var username = String(params.username || '').trim().replace(/^@/, '');
    var context = getInviteContext();

    for (var i = 1; i < context.data.length; i++) {
      if (String(context.data[i][context.telegramIdIndex] || '').trim() === telegramId) {
        return { valid: false, error: 'already_bound_self', message: 'Telegram уже привязан к другому доступу' };
      }
    }

    var invite = findInviteByCode(context, params.code);
    if (!invite || !inviteIsActive(context, invite)) {
      return { valid: false, error: 'invalid_code', message: 'Код недействителен или доступ неактивен' };
    }

    var existingTelegramId = String(invite.row[context.telegramIdIndex] || '').trim();
    if (existingTelegramId && existingTelegramId !== telegramId) {
      return { valid: false, error: 'already_bound_other', message: 'Код уже активирован другим аккаунтом' };
    }

    context.sheet.getRange(invite.rowIndex + 1, context.telegramIdIndex + 1).setValue(telegramId);
    invite.row[context.telegramIdIndex] = telegramId;
    if (username) {
      context.sheet.getRange(invite.rowIndex + 1, context.telegramUsernameIndex + 1).setValue(username);
    }

    return {
      valid: true,
      session_token: issueSessionToken(context, invite, params),
      completed_lessons: String(invite.row[context.progressIndex] || '').trim()
    };
  } finally {
    lock.releaseLock();
  }
}

function handleSession(sessionToken) {
  var authorization = authorizeSession(sessionToken);
  if (!authorization.valid) return authorization;

  return {
    valid: true,
    completed_lessons: getProgress(authorization),
    telegram_user: {
      id: Number(authorization.payload.tg),
      first_name: String(authorization.payload.fn || 'Участник'),
      username: String(authorization.payload.un || '')
    }
  };
}

function handlePaidSession(sessionToken) {
  var authorization = authorizeSession(sessionToken);
  if (!authorization.valid) return authorization;

  return {
    valid: true,
    paid_access: inviteHasPaidAccess(authorization.context, authorization.invite),
    paid_completed_lessons: getPaidProgress(authorization),
    telegram_user: {
      id: Number(authorization.payload.tg),
      first_name: String(authorization.payload.fn || 'Участник'),
      username: String(authorization.payload.un || '')
    }
  };
}

function handleModules() {
  var sheet = getSpreadsheet().getSheetByName('Modules');
  if (!sheet) return { modules: [] };
  var data = sheet.getDataRange().getValues();
  var modules = [];

  for (var i = 1; i < data.length; i++) {
    var status = String(data[i][2] || '').trim().toLowerCase();
    if (data[i][0] && data[i][1] && status === 'active') {
      modules.push({ id: String(data[i][0]), name: String(data[i][1]), status: status });
    }
  }
  return { modules: modules };
}

function handleLessons() {
  var sheet = getSpreadsheet().getSheetByName('Lessons');
  if (!sheet) return { lessons: [] };
  var data = sheet.getDataRange().getValues();
  var lessons = [];

  for (var i = 1; i < data.length; i++) {
    if (data[i][0] && data[i][1] && data[i][2]) {
      lessons.push({
        id: String(data[i][0]),
        moduleId: String(data[i][1]),
        title: String(data[i][2]),
        textContent: String(data[i][3] || ''),
        videoUrl: String(data[i][4] || '')
      });
    }
  }
  return { lessons: lessons };
}

function handlePaidModules() {
  var sheet = getSpreadsheet().getSheetByName('PaidModules');
  if (!sheet) return { modules: [] };
  var data = sheet.getDataRange().getValues();
  var modules = [];

  for (var i = 1; i < data.length; i++) {
    var status = String(data[i][2] || '').trim().toLowerCase();
    if (data[i][0] && data[i][1] && status === 'active') {
      modules.push({ id: String(data[i][0]), name: String(data[i][1]), status: status });
    }
  }
  return { modules: modules };
}

function handlePaidLessons() {
  var sheet = getSpreadsheet().getSheetByName('PaidLessons');
  if (!sheet) return { lessons: [] };
  var data = sheet.getDataRange().getValues();
  var lessons = [];

  for (var i = 1; i < data.length; i++) {
    if (data[i][0] && data[i][1] && data[i][2]) {
      lessons.push({
        id: String(data[i][0]),
        moduleId: String(data[i][1]),
        title: String(data[i][2]),
        textContent: String(data[i][3] || ''),
        videoUrl: String(data[i][4] || '')
      });
    }
  }
  return { lessons: lessons };
}

function handleAll(sessionToken) {
  var authorization = authorizeSession(sessionToken);
  if (!authorization.valid) return authorization;
  return {
    valid: true,
    name: 'Академия: Полный курс',
    modules: handleModules().modules,
    lessons: handleLessons().lessons
  };
}

function handlePaidAll(sessionToken) {
  var authorization = authorizeSession(sessionToken);
  if (!authorization.valid) return authorization;
  if (!inviteHasPaidAccess(authorization.context, authorization.invite)) {
    return {
      valid: false,
      error: 'paid_access_required',
      message: 'Платный доступ для этого аккаунта не подключён'
    };
  }

  return {
    valid: true,
    name: 'NWO: Платное обучение',
    modules: handlePaidModules().modules,
    lessons: handlePaidLessons().lessons,
    completed_lessons: getPaidProgress(authorization)
  };
}

function handleSaveProgress(sessionToken, completedLessons) {
  var authorization = authorizeSession(sessionToken);
  if (!authorization.valid) return authorization;

  var progress = String(completedLessons || '').trim();
  var items = progress ? progress.split(',') : [];
  if (items.length > 500) return { valid: false, error: 'invalid_progress' };
  for (var i = 0; i < items.length; i++) {
    if (!/^lesson-[A-Za-z0-9_-]{1,80}$/.test(items[i])) {
      return { valid: false, error: 'invalid_progress' };
    }
  }

  authorization.context.sheet
    .getRange(authorization.invite.rowIndex + 1, authorization.context.progressIndex + 1)
    .setValue(progress);
  return { valid: true };
}

function handleSavePaidProgress(sessionToken, completedLessons) {
  var authorization = authorizeSession(sessionToken);
  if (!authorization.valid) return authorization;
  if (!inviteHasPaidAccess(authorization.context, authorization.invite)) {
    return { valid: false, error: 'paid_access_required', message: 'Платный доступ не подключён' };
  }

  var progress = String(completedLessons || '').trim();
  var items = progress ? progress.split(',') : [];
  if (items.length > 500) return { valid: false, error: 'invalid_progress' };
  for (var i = 0; i < items.length; i++) {
    if (!/^lesson-[A-Za-z0-9_-]{1,80}$/.test(items[i])) {
      return { valid: false, error: 'invalid_progress' };
    }
  }

  authorization.context.sheet
    .getRange(authorization.invite.rowIndex + 1, authorization.context.paidProgressIndex + 1)
    .setValue(progress);
  return { valid: true };
}

function handleShameTrades(sessionToken) {
  var authorization = authorizeSession(sessionToken);
  if (!authorization.valid) return authorization;
  var sheet = getSpreadsheet().getSheetByName('ShameTrades');
  if (!sheet) return { valid: true, trades: [] };
  var data = sheet.getDataRange().getValues();
  var trades = [];

  for (var i = 1; i < data.length; i++) {
    var status = String(data[i][8] || 'active').trim().toLowerCase();
    if (data[i][0] && data[i][1] && status === 'active') {
      trades.push({
        id: String(data[i][0]),
        title: String(data[i][1]),
        manager: String(data[i][2] || ''),
        client: String(data[i][3] || ''),
        dealAmount: String(data[i][4] || ''),
        date: String(data[i][5] || ''),
        screenshots: String(data[i][6] || ''),
        textContent: String(data[i][7] || '')
      });
    }
  }
  return { valid: true, trades: trades };
}

/** Запустите вручную и замените пример, чтобы получить SHA-256 инвайт-кода. */
function logInviteCodeHash() {
  var exampleCode = 'REPLACE_WITH_REAL_RANDOM_CODE';
  console.log(sha256Hex(normalizeCode(exampleCode)));
}
