/**
 * Google Apps Script — API для закрытой образовательной платформы NWO.
 *
 * ИНСТРУКЦИЯ ПО ДЕПЛОЮ:
 * 1. Откройте вашу Google Таблицу.
 * 2. Меню → Расширения → Apps Script.
 * 3. Удалите всё содержимое файла Code.gs и вставьте этот код.
 * 4. Замените SPREADSHEET_ID на ID вашей таблицы
 *    (из URL: https://docs.google.com/spreadsheets/d/ВАШ_ID/edit).
 * 5. Замените TELEGRAM_BOT_TOKEN на токен вашего бота (полученный у @BotFather).
 * 6. Нажмите «Развернуть» → «Новое развёртывание».
 * 7. Тип: «Веб-приложение».
 * 8. Выполнять как: «Я» (ваш аккаунт).
 * 9. Доступ: «Все» (Anyone) — это важно!
 * 10. Нажмите «Развернуть», авторизуйте доступ и скопируйте URL веб-приложения.
 * 11. Вставьте полученный URL в .env.local вашего проекта.
 */

// ← Замените на ID вашей таблицы
const SPREADSHEET_ID = '1NjvedtkMeDnrEYUQKrejQCLUXN8FDDydhUk8tr4U4zY';

// ← Замените на токен вашего Telegram-бота
const TELEGRAM_BOT_TOKEN = 'YOUR_TELEGRAM_BOT_TOKEN';

function doGet(e) {
  const action = (e && e.parameter && e.parameter.action) || '';
  let result;

  try {
    switch (action) {
      case 'validate':
        result = handleValidate(e.parameter.code || '');
        break;
      case 'modules':
        result = handleModules();
        break;
      case 'lessons':
        result = handleLessons();
        break;
      case 'all':
        result = handleAll();
        break;
      case 'telegram_login':
        result = handleTelegramLogin(e.parameter);
        break;
      case 'telegram_bind':
        result = handleTelegramBind(e.parameter);
        break;
      default:
        result = { error: 'Unknown action. Use: validate, modules, lessons, all, telegram_login, telegram_bind' };
    }
  } catch (err) {
    result = { error: err.message };
  }

  return ContentService
    .createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Проверяет подпись данных от Telegram Login Widget.
 */
function verifyTelegramHash(params) {
  const hash = params.hash;
  if (!hash) return false;
  
  if (!TELEGRAM_BOT_TOKEN || TELEGRAM_BOT_TOKEN === 'YOUR_TELEGRAM_BOT_TOKEN') {
    throw new Error('TELEGRAM_BOT_TOKEN не настроен в Google Apps Script!');
  }

  // Все параметры авторизации от Telegram
  const tgFields = ['auth_date', 'first_name', 'id', 'last_name', 'photo_url', 'username'];
  const dataCheckList = [];

  for (let i = 0; i < tgFields.length; i++) {
    const field = tgFields[i];
    if (params[field] !== undefined && params[field] !== null && params[field] !== '') {
      dataCheckList.push(field + '=' + params[field]);
    }
  }

  dataCheckList.sort();
  const dataCheckString = dataCheckList.join('\n');

  // Вычисляем SHA-256 от токена бота для использования в качестве ключа
  const secretKey = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, TELEGRAM_BOT_TOKEN);
  
  // Вычисляем HMAC-SHA-256 подпись
  const signatureBytes = Utilities.computeHmacSha256Signature(dataCheckString, secretKey);

  // Конвертируем байты подписи в Hex-строку
  let signatureHex = '';
  for (let i = 0; i < signatureBytes.length; i++) {
    let byteVal = signatureBytes[i];
    if (byteVal < 0) byteVal += 256;
    let byteString = byteVal.toString(16);
    if (byteString.length === 1) byteString = '0' + byteString;
    signatureHex += byteString;
  }

  return signatureHex === hash.toLowerCase();
}

/**
 * Автоматически добавляет колонки для Telegram в лист Invites, если их нет.
 */
function ensureTelegramColumns(sheet) {
  const range = sheet.getRange(1, 1, 1, sheet.getLastColumn());
  const headers = range.getValues()[0];
  
  let hasTgId = headers.indexOf('telegram_id') !== -1;
  let hasTgUser = headers.indexOf('telegram_username') !== -1;
  
  if (!hasTgId) {
    sheet.getRange(1, sheet.getLastColumn() + 1).setValue('telegram_id');
  }
  
  // Обновляем заголовки, чтобы учесть добавленный telegram_id перед поиском telegram_username
  const updatedHeaders = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  hasTgUser = updatedHeaders.indexOf('telegram_username') !== -1;

  if (!hasTgUser) {
    sheet.getRange(1, sheet.getLastColumn() + 1).setValue('telegram_username');
  }
}

/**
 * Обработка авторизации через Telegram.
 * Проверяет подпись и ищет привязанный код.
 */
function handleTelegramLogin(params) {
  if (!verifyTelegramHash(params)) {
    return { valid: false, error: 'signature_invalid', message: 'Неверная подпись данных Telegram' };
  }

  const tgId = String(params.id).trim();
  const username = String(params.username || '').trim();

  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName('Invites');

  if (!sheet) {
    return { valid: false, error: 'sheet_missing', message: 'Лист Invites не найден' };
  }

  ensureTelegramColumns(sheet);

  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const codeColIndex = 0;
  const tgIdColIndex = headers.indexOf('telegram_id');
  const tgUserColIndex = headers.indexOf('telegram_username');

  // Ищем пользователя по telegram_id
  for (let i = 1; i < data.length; i++) {
    const sheetTgId = String(data[i][tgIdColIndex] || '').trim();
    if (sheetTgId === tgId) {
      return { valid: true, code: String(data[i][codeColIndex]).trim() };
    }
  }

  // Если ID не найден, проверяем, вписал ли администратор юзернейм заранее
  if (username && tgUserColIndex !== -1) {
    for (let i = 1; i < data.length; i++) {
      const sheetTgUser = String(data[i][tgUserColIndex] || '').trim().replace('@', '');
      const cleanUsername = username.replace('@', '');
      
      if (sheetTgUser.toUpperCase() === cleanUsername.toUpperCase()) {
        const sheetTgId = String(data[i][tgIdColIndex] || '').trim();
        if (!sheetTgId) {
          // Автоматически привязываем ID к этому коду
          sheet.getRange(i + 1, tgIdColIndex + 1).setValue(tgId);
          return { valid: true, code: String(data[i][codeColIndex]).trim(), message: 'Автопривязка по имени пользователя' };
        }
      }
    }
  }

  return { valid: false, error: 'not_bound', message: 'Telegram аккаунт не привязан к коду' };
}

/**
 * Привязывает Telegram-аккаунт к инвайт-коду.
 */
function handleTelegramBind(params) {
  if (!verifyTelegramHash(params)) {
    return { valid: false, error: 'signature_invalid', message: 'Неверная подпись данных Telegram' };
  }

  const code = String(params.code || '').trim().toUpperCase();
  const tgId = String(params.id).trim();
  const username = String(params.username || '').trim();

  if (!code || code.length < 8) {
    return { valid: false, error: 'code_too_short', message: 'Код доступа должен быть не менее 8 символов' };
  }

  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName('Invites');

  if (!sheet) {
    return { valid: false, error: 'sheet_missing', message: 'Лист Invites не найден' };
  }

  ensureTelegramColumns(sheet);

  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const codeColIndex = 0;
  const tgIdColIndex = headers.indexOf('telegram_id');
  const tgUserColIndex = headers.indexOf('telegram_username');

  // Убеждаемся, что этот Telegram ID еще не привязан к другому коду
  for (let i = 1; i < data.length; i++) {
    const sheetTgId = String(data[i][tgIdColIndex] || '').trim();
    if (sheetTgId === tgId) {
      return { 
        valid: false, 
        error: 'already_bound_self', 
        message: 'Ваш Telegram уже привязан к коду: ' + data[i][codeColIndex] 
      };
    }
  }

  // Ищем введенный инвайт-код
  let codeRowIndex = -1;
  for (let i = 1; i < data.length; i++) {
    const sheetCode = String(data[i][codeColIndex]).trim().toUpperCase();
    if (sheetCode === code) {
      codeRowIndex = i;
      break;
    }
  }

  if (codeRowIndex === -1) {
    return { valid: false, error: 'invalid_code', message: 'Введенный инвайт-код не найден' };
  }

  // Проверяем, не занят ли код другим пользователем
  const existingTgId = String(data[codeRowIndex][tgIdColIndex] || '').trim();
  if (existingTgId) {
    if (existingTgId === tgId) {
      return { valid: true, message: 'Уже привязано' };
    }
    return { 
      valid: false, 
      error: 'already_bound_other', 
      message: 'Этот код уже активирован другим Telegram-аккаунтом!' 
    };
  }

  // Выполняем привязку
  sheet.getRange(codeRowIndex + 1, tgIdColIndex + 1).setValue(tgId);
  if (tgUserColIndex !== -1 && username) {
    sheet.getRange(codeRowIndex + 1, tgUserColIndex + 1).setValue(username);
  }

  return { valid: true };
}

/**
 * Проверяет обычный код доступа в листе "Invites".
 */
function handleValidate(code) {
  if (!code || code.length < 8) {
    return { valid: false, error: 'Код должен содержать минимум 8 символов' };
  }

  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName('Invites');

  if (!sheet) {
    return { valid: false, error: 'Лист Invites не найден' };
  }

  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    const sheetCode = String(data[i][0]).trim();
    if (sheetCode.toUpperCase() === code.toUpperCase()) {
      return { valid: true };
    }
  }

  return { valid: false };
}

/**
 * Возвращает все активные модули из листа "Modules".
 */
function handleModules() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName('Modules');

  if (!sheet) {
    return { error: 'Лист Modules не найден', modules: [] };
  }

  const data = sheet.getDataRange().getValues();
  const modules = [];

  for (let i = 1; i < data.length; i++) {
    const id = data[i][0];
    const name = data[i][1];
    const status = String(data[i][2]).trim().toLowerCase();

    if (id && name && status === 'active') {
      modules.push({
        id: String(id),
        name: String(name),
        status: status,
      });
    }
  }

  return { modules: modules };
}

/**
 * Возвращает все уроки из листа "Lessons".
 */
function handleLessons() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName('Lessons');

  if (!sheet) {
    return { error: 'Лист Lessons не найден', lessons: [] };
  }

  const data = sheet.getDataRange().getValues();
  const lessons = [];

  for (let i = 1; i < data.length; i++) {
    const id = data[i][0];
    const moduleId = data[i][1];
    const title = data[i][2];
    const textContent = data[i][3];
    const videoUrl = data[i][4];

    if (id && moduleId && title) {
      lessons.push({
        id: String(id),
        moduleId: String(moduleId),
        title: String(title),
        textContent: String(textContent || ''),
        videoUrl: String(videoUrl || ''),
      });
    }
  }

  return { lessons: lessons };
}

/**
 * Возвращает модули и уроки одним запросом (для оптимизации).
 */
function handleAll() {
  const modulesResult = handleModules();
  const lessonsResult = handleLessons();

  return {
    modules: modulesResult.modules || [],
    lessons: lessonsResult.lessons || [],
  };
}
