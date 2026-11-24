/** NWO mentorship checkout. Separate Apps Script project; does not replace the course API.
 * Script Properties are private. Run setupMentorship once, then deploy as web app.
 * Scopes: spreadsheets, send_mail, external_request, script.scriptapp (retry trigger).
 * Receipts are stored in a private spreadsheet before MailApp sends the attachment.
 */
var MENTORSHIP_VERSION = "2026-11-24.1";
var MENTORSHIP_USD = 70;
var MENTORSHIP_FILE_LIMIT = 5 * 1024 * 1024;

function mcProperties() {
  return PropertiesService.getScriptProperties();
}
function mcProperty(key) {
  return mcProperties().getProperty(key) || "";
}
function mcJson(value) {
  return ContentService.createTextOutput(JSON.stringify(value)).setMimeType(
    ContentService.MimeType.JSON,
  );
}
function mcAssert(condition, message) {
  if (!condition) throw new Error(message);
}
function mcHash(value) {
  return Utilities.computeDigest(
    Utilities.DigestAlgorithm.SHA_256,
    String(value),
    Utilities.Charset.UTF_8,
  )
    .map(function (b) {
      return ("0" + ((b + 256) % 256).toString(16)).slice(-2);
    })
    .join("");
}
function mcSign(value) {
  var secret = mcProperty("MENTORSHIP_SECRET");
  mcAssert(
    secret.length >= 32,
    "Оформление пока не настроено. Напиши Ярославу в Telegram.",
  );
  return Utilities.base64EncodeWebSafe(
    Utilities.computeHmacSha256Signature(value, secret),
  ).replace(/=+$/, "");
}
function mcEqual(a, b) {
  a = String(a || "");
  b = String(b || "");
  var diff = a.length ^ b.length;
  for (var i = 0; i < Math.max(a.length, b.length); i++)
    diff |= (a.charCodeAt(i) || 0) ^ (b.charCodeAt(i) || 0);
  return diff === 0;
}
function mcLock(fn) {
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    return fn();
  } finally {
    lock.releaseLock();
  }
}
function mcSheet(name) {
  var book = SpreadsheetApp.openById(mcProperty("MENTORSHIP_SPREADSHEET_ID"));
  var sheet = book.getSheetByName(name);
  mcAssert(sheet, "Оформление пока не настроено.");
  return sheet;
}
function mcRateLimit(scope, key, max, seconds) {
  if (seconds > 21600) {
    var dayKey = "mc_daily_" + scope;
    var day = Utilities.formatDate(new Date(), "Europe/Minsk", "yyyy-MM-dd");
    var saved = JSON.parse(mcProperty(dayKey) || "{}");
    var used = saved.day === day ? Number(saved.used || 0) : 0;
    mcAssert(used < max, "Дневной лимит заявок достигнут. Напиши Ярославу.");
    mcProperties().setProperty(
      dayKey,
      JSON.stringify({ day: day, used: used + 1 }),
    );
    return;
  }
  var cache = CacheService.getScriptCache();
  var id = "mc:" + scope + ":" + mcHash(key);
  var count = Number(cache.get(id) || 0);
  mcAssert(
    count < max,
    "Слишком много запросов. Попробуй позже или напиши Ярославу.",
  );
  cache.put(id, String(count + 1), seconds);
}
function mcDocuments() {
  var name = mcProperty("MENTORSHIP_PROVIDER_NAME");
  var unp = mcProperty("MENTORSHIP_PROVIDER_UNP");
  var contact = mcProperty("MENTORSHIP_CONTACT");
  var email = mcProperty("MENTORSHIP_NOTIFY_EMAIL");
  var intro =
    "Исполнитель: " +
    name +
    ", плательщик НПД, УНП " +
    unp +
    ". Связь, вопросы и возвраты: " +
    contact +
    "; email: " +
    email +
    ".";
  return {
    offer: {
      title: "Условия менторства и возврата",
      version: MENTORSHIP_VERSION,
      sections: [
        {
          title: "1. Исполнитель и услуга",
          paragraphs: [
            intro,
            "Индивидуальное дистанционное менторство NWO по продажам: 30 календарных дней личной работы, созвоны, разбор переговоров и обратная связь в Telegram. До оплаты стороны согласуют задачи, дату начала, график созвонов и объём обратной связи в переписке. Если программа не подходит, не оплачивай заявку.",
          ],
        },
        {
          title: "2. Заявка и согласие",
          paragraphs: [
            "Заказчик сообщает имя, email, Telegram, страну оплаты и выбирает способ оплаты. Поставленная самим заказчиком галочка и отправка заявки фиксируют согласие с этой редакцией условий. Сервер сохраняет дату, номер заявки и текст принятых условий. Неотмеченная галочка не считается согласием. Заказчик подтверждает совершеннолетие; для несовершеннолетнего оформление выполняет законный представитель.",
            "Реквизиты открываются после регистрации заявки. Создание заявки не обязывает переводить деньги. Услуга начинается только после подтверждения фактического поступления оплаты исполнителем и согласования даты начала.",
          ],
        },
        {
          title: "3. Цена и оплата",
          paragraphs: [
            "Стоимость 30 дней менторства — эквивалент 70 долларов США. Для ЕРИП и перевода на карту сумма в BYN рассчитывается по официальному курсу НБРБ на дату заявки, округляется до копеек и фиксируется в заявке на 48 часов. Банковская комиссия, если есть, показывается банком отдельно. После истечения срока нужно оформить новую заявку или согласовать оплату с исполнителем.",
            "Если в заявке выбран USDT, согласованная стоимость составляет 70 USDT. Сеть и адрес показываются отдельно: отправлять нужно только USDT и только в выбранной сети. Комиссия отправляющей платформы оплачивается отдельно, к зачислению — 70 USDT. Допустимость выбранного способа расчёта зависит от применимых к сторонам правил; при сомнениях согласуй доступный способ с исполнителем до перевода. Для карты «Мир» реквизиты и итоговая сумма согласуются в Telegram до оплаты.",
            "Чек или подтверждение транзакции загружается после оплаты. Его получение означает передачу на проверку, а не подтверждение платежа или автоматическое предоставление доступа. Исполнитель сверяет поступление и связывается с заказчиком в течение двух рабочих дней. При отсутствии ответа напиши по контакту из раздела 1.",
          ],
        },
        {
          title: "4. Порядок работы",
          paragraphs: [
            "Стороны используют согласованные каналы связи и график. Перенос созвона согласуется заранее в переписке. Существенные изменения программы, сроков и стоимости требуют согласия обеих сторон. По итогам оплаты исполнитель выдаёт предусмотренный законодательством документ об оплате; загруженный покупателем банковский чек его не заменяет.",
            "Материалы и рекомендации предназначены для личного использования. Не публикуй записи созвонов и материалы другой стороны без её согласия. Доход, трудоустройство, количество сделок и иной коммерческий результат не гарантируются: они зависят в том числе от практики заказчика и внешних обстоятельств.",
          ],
        },
        {
          title: "5. Отказ от услуги и возврат",
          paragraphs: [
            "Заказчик вправе отказаться от дальнейшего оказания услуги. Для возврата напиши исполнителю в Telegram или на email из раздела 1, укажи номер заявки, дату и сумму оплаты и своё требование. Не отправляй CVC/CVV, пароли, коды из SMS или полные данные чужой карты. Если нужно установить плательщика, исполнитель запросит минимальные необходимые сведения.",
            "До начала оказания услуги оплаченная сумма возвращается полностью, если у исполнителя нет фактически понесённых и подлежащих возмещению по закону расходов. После начала возврат рассчитывается с учётом фактически понесённых, документально подтверждённых расходов, связанных с исполнением именно этого договора, в пределах, разрешённых законом. Автоматические штрафы, фиксированный невозвратный процент и удержание всей суммы только за открытие доступа не применяются. Исполнитель направляет расчёт и подтверждение удержаний.",
            "Возврат производится не позднее 14 календарных дней с момента заявления требования, если обязательные нормы не устанавливают более короткий срок. Способ и необходимые реквизиты возврата согласуются с плательщиком с учётом требований банка и закона. Для USDT по согласованию используется исходный актив и проверенная обеими сторонами сеть; условия возврата не отменяют обязательные права потребителя. Если услуга не началась по вине исполнителя, применяется полный возврат; иные требования при недостатках услуги рассматриваются по применимому законодательству.",
          ],
        },
        {
          title: "6. Обращения и права заказчика",
          paragraphs: [
            "Спорные вопросы сначала обсуждаются по контактам исполнителя. Эти условия не ограничивают обязательные права потребителя, право на обращение в уполномоченные органы и суд, а также способы защиты при неоказании или ненадлежащем оказании услуги. Для заявки сохраняется принятая редакция; новые редакции не меняют уже согласованный договор без согласия сторон.",
          ],
        },
      ],
    },
    privacy: {
      title: "Уведомление об обработке данных",
      version: MENTORSHIP_VERSION,
      sections: [
        {
          title: "Кто и зачем обрабатывает данные",
          paragraphs: [
            intro,
            "Имя, email, Telegram, страна оплаты, выбранный способ, сумма, номер заявки, время согласия и версия условий необходимы для оформления и исполнения договора, проверки оплаты, связи и возвратов. Эти сведения не используются для рекламной рассылки без отдельного согласия.",
          ],
        },
        {
          title: "Чек и безопасность",
          paragraphs: [
            "В чеке нужны сумма, дата, получатель и идентификатор операции. До загрузки можно закрыть баланс, посторонние операции и лишние реквизиты, сохранив сведения для проверки. Принимаются JPG, PNG и PDF до 5 МБ. Не загружай паспорт, CVC/CVV, пароли или коды подтверждения.",
            "Заявки и чек сохраняются в закрытой Google Таблице исполнителя; чек и сведения о заявке отправляются на его email. Они не публикуются на сайте и не передаются другим покупателям. Для доступа к своей заявке браузер хранит приватный ключ в sessionStorage до закрытия вкладки; не передавай его другим.",
          ],
        },
        {
          title: "Сервисы, передача и сроки",
          paragraphs: [
            "Техническая обработка выполняется средствами Google Apps Script, Google Sheets и почтовой доставки Google. Серверы поставщика могут находиться за пределами Республики Беларусь, включая США и другие страны, где применимые гарантии защиты могут отличаться. Для связи через Telegram действует также политика Telegram. Сайт не запрашивает платёжный пароль и не списывает деньги.",
            "Заявки без прикреплённого подтверждения оплаты удаляются из рабочей таблицы через 30 дней. Если оплатил, но не успел загрузить чек, сообщи исполнителю в этот срок. Копии служебных писем и документы учёта удаляются исполнителем после окончания применимых сроков хранения. Оплаченные заявки и подтверждения хранятся на период исполнения договора, рассмотрения обращений и обязательных сроков учёта; после их окончания удаляются. Сохранность, выдачу документов и удаление обеспечивает исполнитель. Запрос о доступе, исправлении, прекращении обработки или удалении направляется по контактам выше; обязательное хранение по закону может ограничивать удаление.",
          ],
        },
        {
          title: "Основание обработки",
          paragraphs: [
            "Данные, необходимые для заключения и исполнения договора и выполнения законных обязанностей исполнителя, обрабатываются на соответствующем правовом основании. Галочка ознакомления с этим уведомлением не является согласием на рекламу или отказом от прав субъекта персональных данных.",
          ],
        },
      ],
    },
  };
}
function mcReady() {
  return (
    mcProperty("MENTORSHIP_ENABLED") === "true" &&
    !!mcProperty("MENTORSHIP_SPREADSHEET_ID") &&
    !!mcProperty("MENTORSHIP_NOTIFY_EMAIL") &&
    !!mcProperty("MENTORSHIP_PROVIDER_NAME") &&
    !!mcProperty("MENTORSHIP_PROVIDER_UNP")
  );
}
function mcRate() {
  var today = Utilities.formatDate(new Date(), "Europe/Minsk", "yyyy-MM-dd");
  var cache = CacheService.getScriptCache();
  var cached = cache.get("mc:rate:" + today);
  if (cached) return JSON.parse(cached);
  var response = UrlFetchApp.fetch(
    "https://api.nbrb.by/exrates/rates/USD?parammode=2",
    { muteHttpExceptions: true },
  );
  mcAssert(
    response.getResponseCode() === 200,
    "Не удалось получить курс НБРБ. Попробуй позже.",
  );
  var rate = JSON.parse(response.getContentText());
  mcAssert(
    rate.Cur_Abbreviation === "USD" &&
      Number(rate.Cur_Scale) === 1 &&
      Number(rate.Cur_OfficialRate) > 0 &&
      String(rate.Date).slice(0, 10) === today,
    "Актуальный курс пока недоступен. Попробуй позже.",
  );
  var result = { rate: Number(rate.Cur_OfficialRate), rateDate: today };
  cache.put("mc:rate:" + today, JSON.stringify(result), 3600);
  return result;
}
function mcConfig() {
  var documents = mcDocuments();
  if (!mcReady())
    return {
      valid: true,
      available: false,
      message:
        "Онлайн-оформление готовится. Напиши Ярославу, чтобы согласовать покупку за $70.",
      documents: documents,
    };
  var rate;
  try {
    rate = mcRate();
  } catch (error) {
    return {
      valid: true,
      available: false,
      message:
        "Не удалось получить актуальный курс НБРБ. Попробуй позже или напиши Ярославу.",
      documents: documents,
    };
  }
  var price = {
    usd: MENTORSHIP_USD,
    byn: Math.round(MENTORSHIP_USD * rate.rate * 100) / 100,
    rate: rate.rate,
    rateDate: rate.rateDate,
    expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
  };
  var payload = Utilities.base64EncodeWebSafe(
    JSON.stringify({ price: price, hash: mcHash(JSON.stringify(documents)) }),
    Utilities.Charset.UTF_8,
  ).replace(/=+$/, "");
  return {
    valid: true,
    available: true,
    quote: payload + "." + mcSign(payload),
    price: price,
    documents: documents,
    cryptoEnabled: mcProperty("MENTORSHIP_CRYPTO_ENABLED") === "true",
  };
}
function mcQuote(token) {
  mcAssert(
    typeof token === "string" && token.length < 6000,
    "Обнови страницу, чтобы получить актуальную цену.",
  );
  var parts = token.split(".");
  mcAssert(
    parts.length === 2 && mcEqual(mcSign(parts[0]), parts[1]),
    "Цена не подтверждена. Обнови страницу.",
  );
  var quote = JSON.parse(
    Utilities.newBlob(
      Utilities.base64DecodeWebSafe(parts[0]),
    ).getDataAsString(),
  );
  mcAssert(
    Date.parse(quote.price.expiresAt) > Date.now(),
    "Цена устарела. Обнови страницу перед оформлением.",
  );
  mcAssert(
    quote.price.usd === MENTORSHIP_USD &&
      quote.hash === mcHash(JSON.stringify(mcDocuments())),
    "Условия обновились. Перечитай их и оформи заявку заново.",
  );
  return quote.price;
}
function mcValidateApplication(p) {
  mcAssert(
    p.acceptOffer === true && p.acknowledgePrivacy === true && p.adult === true,
    "Подтверди условия, ознакомление с обработкой данных и совершеннолетие.",
  );
  mcAssert(!p.website, "Не удалось принять заявку.");
  var name = String(p.name || "").trim();
  var email = String(p.email || "")
    .trim()
    .toLowerCase();
  var telegram = String(p.telegram || "").trim();
  mcAssert(
    name.length >= 2 && name.length <= 100 && !/[\r\n\x00-\x1f]/.test(name),
    "Укажи имя: от 2 до 100 символов.",
  );
  mcAssert(
    email.length <= 160 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
    "Проверь email.",
  );
  mcAssert(
    /^@[a-zA-Z0-9_]{5,32}$/.test(telegram),
    "Укажи Telegram в формате @username.",
  );
  mcAssert(
    ["BY", "RU", "OTHER"].indexOf(p.country) !== -1,
    "Выбери страну оплаты.",
  );
  mcAssert(
    ["erip", "card", "usdt", "mir"].indexOf(p.method) !== -1,
    "Выбери способ оплаты.",
  );
  mcAssert(
    p.method !== "erip" || p.country === "BY",
    "ЕРИП доступен для оплаты из Беларуси.",
  );
  mcAssert(
    p.method !== "mir" || p.country === "RU",
    "Для карты «Мир» выбери Россию.",
  );
  if (p.method === "usdt") {
    mcAssert(
      mcProperty("MENTORSHIP_CRYPTO_ENABLED") === "true" && p.country !== "BY",
      "Этот способ сейчас недоступен. Выбери другой или напиши Ярославу.",
    );
    mcAssert(
      ["ton", "trc20", "bep20", "solana", "erc20"].indexOf(p.network) !== -1,
      "Выбери сеть USDT.",
    );
  }
  mcAssert(
    /^[a-f0-9-]{36}$/i.test(String(p.requestId || "")),
    "Обнови страницу и повтори оформление.",
  );
  return { name: name, email: email, telegram: telegram, country: p.country };
}
function mcFind(id) {
  var sheet = mcSheet("Orders");
  var last = sheet.getLastRow();
  if (last < 2) return null;
  var cell = sheet
    .getRange(2, 1, last - 1, 1)
    .createTextFinder(id)
    .matchEntireCell(true)
    .findNext();
  return cell
    ? {
        sheet: sheet,
        row: cell.getRow(),
        order: JSON.parse(sheet.getRange(cell.getRow(), 3).getValue()),
      }
    : null;
}
function mcSave(found) {
  found.sheet.getRange(found.row, 3).setValue(JSON.stringify(found.order));
  SpreadsheetApp.flush();
}
function mcToken(id) {
  return mcSign("order:" + id);
}
function mcAuthorized(p) {
  mcAssert(
    typeof p.id === "string" &&
      /^[a-f0-9-]{36}$/i.test(p.id) &&
      mcEqual(mcToken(p.id), p.token),
    "Нет доступа к заявке. Открой её в исходной вкладке или напиши Ярославу.",
  );
  var found = mcFind(p.id);
  mcAssert(found, "Заявка не найдена. Напиши Ярославу.");
  return found;
}
function mcInstructions(order) {
  if (order.method === "erip")
    return {
      path: [
        "ЕРИП",
        "Банковские и финансовые услуги",
        "Банки НКФО",
        "МТБанк",
        "пополнение карты",
      ],
      account: mcProperty("MENTORSHIP_ERIP_ACCOUNT"),
    };
  if (order.method === "card")
    return {
      card: mcProperty("MENTORSHIP_CARD"),
      holder: mcProperty("MENTORSHIP_CARD_HOLDER"),
      expiry: mcProperty("MENTORSHIP_CARD_EXPIRY"),
    };
  if (order.method === "usdt")
    return {
      network: order.network,
      address: mcProperty("MENTORSHIP_USDT_" + order.network.toUpperCase()),
    };
  return { contact: mcProperty("MENTORSHIP_CONTACT") };
}
function mcPublicOrder(order) {
  return {
    id: order.id,
    token: mcToken(order.id),
    createdAt: order.createdAt,
    expiresAt: order.expiresAt,
    status: order.status,
    price: order.price,
    method: order.method,
    network: order.network,
    instructions: mcInstructions(order),
    documents: order.documents,
  };
}
function mcCreate(p) {
  mcAssert(mcReady(), "Оформление пока недоступно. Напиши Ярославу.");
  var applicant = mcValidateApplication(p);
  return mcLock(function () {
    var sheet = mcSheet("Orders");
    var last = sheet.getLastRow();
    if (last > 1) {
      var prior = sheet
        .getRange(2, 2, last - 1, 1)
        .createTextFinder(p.requestId)
        .matchEntireCell(true)
        .findNext();
      if (prior) {
        var existing = JSON.parse(sheet.getRange(prior.getRow(), 3).getValue());
        mcAssert(
          existing.customer.email === applicant.email,
          "Повтори оформление с новой страницы.",
        );
        return { valid: true, order: mcPublicOrder(existing) };
      }
    }
    var price = mcQuote(p.quote);
    mcRateLimit("orders", applicant.email, 4, 3600);
    mcRateLimit("orders-global", "all", 30, 86400);
    var now = new Date();
    var expiresAt = new Date(now.getTime() + 48 * 3600 * 1000).toISOString();
    var order = {
      id: Utilities.getUuid(),
      requestId: p.requestId,
      customer: applicant,
      method: p.method,
      network: p.method === "usdt" ? p.network : "",
      price: Object.assign({}, price, { expiresAt: expiresAt }),
      createdAt: now.toISOString(),
      expiresAt: expiresAt,
      status: "awaiting_payment",
      documents: mcDocuments(),
      consent: {
        acceptedAt: now.toISOString(),
        offer: true,
        privacyNotice: true,
        adult: true,
        version: MENTORSHIP_VERSION,
      },
      notification: "pending",
      receipt: null,
    };
    var instructions = mcInstructions(order);
    mcAssert(
      (p.method === "erip" && instructions.account) ||
        (p.method === "card" && instructions.card && instructions.holder) ||
        (p.method === "usdt" && instructions.address) ||
        p.method === "mir",
      "Реквизиты пока не настроены. Напиши Ярославу.",
    );
    sheet.appendRow([order.id, p.requestId, JSON.stringify(order)]);
    SpreadsheetApp.flush();
    return { valid: true, order: mcPublicOrder(order) };
  });
}
function mcValidateFile(p) {
  mcAssert(
    typeof p.base64 === "string" &&
      p.base64.length > 0 &&
      p.base64.length <= Math.ceil(MENTORSHIP_FILE_LIMIT / 3) * 4 &&
      /^[A-Za-z0-9+/]+={0,2}$/.test(p.base64),
    "Файл повреждён или больше 5 МБ.",
  );
  mcAssert(
    ["image/jpeg", "image/png", "application/pdf"].indexOf(p.mime) !== -1,
    "Подойдут JPG, PNG или PDF.",
  );
  var bytes = Utilities.base64Decode(p.base64);
  mcAssert(
    bytes.length > 0 && bytes.length <= MENTORSHIP_FILE_LIMIT,
    "Чек должен быть не больше 5 МБ.",
  );
  var first = bytes.slice(0, 8).map(function (b) {
    return (b + 256) % 256;
  });
  var jpeg = first[0] === 255 && first[1] === 216 && first[2] === 255;
  var png = first.join(",") === "137,80,78,71,13,10,26,10";
  var pdf = first.slice(0, 5).join(",") === "37,80,68,70,45";
  mcAssert(
    (p.mime === "image/jpeg" && jpeg) ||
      (p.mime === "image/png" && png) ||
      (p.mime === "application/pdf" && pdf),
    "Содержимое файла не соответствует формату JPG, PNG или PDF.",
  );
  return { hash: mcHash(p.base64), size: bytes.length, mime: p.mime };
}
function mcReceipt(p) {
  var found = mcAuthorized(p);
  var info = mcValidateFile(p);
  mcLock(function () {
    found = mcAuthorized(p);
    var order = found.order;
    if (order.receipt) {
      mcAssert(
        order.receipt.hash === info.hash,
        "Чек уже прикреплён. Для замены напиши Ярославу с номером заявки.",
      );
      return;
    }
    mcAssert(
      Date.parse(order.expiresAt) > Date.now(),
      "Срок заявки истёк. Если уже оплатил, отправь чек Ярославу в Telegram с номером заявки.",
    );
    mcRateLimit("receipts-global", "all", 60, 86400);
    var parts = [];
    var payloadSheet = mcSheet("ReceiptFiles");
    // Remove incomplete chunks left by an interrupted upload before retrying.
    if (payloadSheet.getLastRow() > 1) {
      var orphanIds = payloadSheet
        .getRange(2, 1, payloadSheet.getLastRow() - 1, 1)
        .getValues();
      for (var j = orphanIds.length - 1; j >= 0; j--)
        if (orphanIds[j][0] === order.id) payloadSheet.deleteRow(j + 2);
    }
    for (var i = 0; i < p.base64.length; i += 40000)
      parts.push([order.id, i / 40000, p.base64.slice(i, i + 40000)]);
    payloadSheet
      .getRange(payloadSheet.getLastRow() + 1, 1, parts.length, 3)
      .setValues(parts);
    order.receipt = Object.assign({}, info, {
      receivedAt: new Date().toISOString(),
      notification: "pending",
      parts: parts.length,
    });
    order.status = "receipt_pending";
    mcSave(found);
  });
  mcDeliver(p.id);
  return { valid: true, order: mcPublicOrder(mcAuthorized(p).order) };
}
function mcMailBody(order) {
  return (
    "NWO / Менторство — $70, 30 дней\nЗаявка: " +
    order.id +
    "\nДата: " +
    order.createdAt +
    "\nИмя: " +
    order.customer.name +
    "\nEmail: " +
    order.customer.email +
    "\nTelegram: " +
    order.customer.telegram +
    "\nСтрана: " +
    order.customer.country +
    "\nСпособ: " +
    order.method +
    (order.network ? " / " + order.network : "") +
    "\nСумма: " +
    (order.method === "usdt"
      ? "70 USDT"
      : order.method === "mir"
        ? "$70, расчёт в Telegram"
        : order.price.byn + " BYN") +
    "\nКурс НБРБ: " +
    order.price.rate +
    " от " +
    order.price.rateDate +
    "\nУсловия: " +
    order.consent.version +
    "; согласие: " +
    order.consent.acceptedAt +
    "\n\n" +
    (order.receipt
      ? "Чек во вложении. ПРОВЕРЬ ФАКТИЧЕСКОЕ ЗАЧИСЛЕНИЕ. Загрузка не подтверждает оплату."
      : "Новая заявка. Оплата пока не подтверждена.") +
    "\nВозвраты и связь: " +
    mcProperty("MENTORSHIP_CONTACT")
  );
}
function mcDeliver(id) {
  var task = mcLock(function () {
    var found = mcFind(id);
    if (!found) return null;
    var order = found.order;
    var state = order.receipt ? order.receipt.notification : order.notification;
    if (state !== "pending") return null;
    if (MailApp.getRemainingDailyQuota() < 1) return null;
    if (order.receipt) order.receipt.notification = "sending";
    else order.notification = "sending";
    mcSave(found);
    return order;
  });
  if (!task) return;
  try {
    var attachments = [
      Utilities.newBlob(
        JSON.stringify(task.documents, null, 2),
        "text/plain",
        "NWO-conditions-" + id + ".txt",
      ),
    ];
    if (task.receipt) {
      var fileSheet = mcSheet("ReceiptFiles");
      var rows =
        fileSheet.getLastRow() > 1
          ? fileSheet
              .getRange(2, 1, fileSheet.getLastRow() - 1, 3)
              .getValues()
              .filter(function (r) {
                return r[0] === id;
              })
              .sort(function (a, b) {
                return Number(a[1]) - Number(b[1]);
              })
          : [];
      mcAssert(rows.length === task.receipt.parts, "Incomplete stored receipt");
      var base64 = rows
        .map(function (r) {
          return r[2];
        })
        .join("");
      mcAssert(
        mcHash(base64) === task.receipt.hash,
        "Stored receipt digest mismatch",
      );
      var extension = {
        "image/jpeg": "jpg",
        "image/png": "png",
        "application/pdf": "pdf",
      }[task.receipt.mime];
      attachments.push(
        Utilities.newBlob(
          Utilities.base64Decode(base64),
          task.receipt.mime,
          "NWO-" + id + "." + extension,
        ),
      );
    }
    MailApp.sendEmail({
      to: mcProperty("MENTORSHIP_NOTIFY_EMAIL"),
      subject:
        "NWO: " +
        (task.test ? "[ТЕСТ, НЕ ПОКУПКА] " : "") +
        (task.receipt ? "чек" : "новая заявка") +
        " " +
        id,
      body: mcMailBody(task),
      replyTo: task.customer.email,
      attachments: attachments,
    });
    mcLock(function () {
      var found = mcFind(id);
      if (!found) return;
      if (task.receipt) {
        found.order.receipt.notification = "sent";
        found.order.receipt.sentAt = new Date().toISOString();
        found.order.status = "receipt_received";
      } else found.order.notification = "sent";
      mcSave(found);
    });
  } catch (error) {
    // A send may have succeeded before an interruption: never automatically resend an uncertain message.
    mcLock(function () {
      var found = mcFind(id);
      if (!found) return;
      if (task.receipt) found.order.receipt.notification = "review_required";
      else found.order.notification = "review_required";
      mcSave(found);
    });
    console.error("Mentorship notification requires owner review: " + id);
  }
}
function retryMentorshipNotifications() {
  var sheet = mcSheet("Orders");
  if (sheet.getLastRow() < 2) return;
  var rows = sheet.getRange(2, 3, sheet.getLastRow() - 1, 1).getValues();
  var count = 0;
  rows.forEach(function (r) {
    var order = JSON.parse(r[0]);
    if (
      count < 10 &&
      (order.receipt ? order.receipt.notification : order.notification) ===
        "pending"
    ) {
      mcDeliver(order.id);
      count++;
    }
  });
}
function purgeExpiredMentorshipApplications() {
  mcLock(function () {
    var sheet = mcSheet("Orders");
    if (sheet.getLastRow() < 2) return;
    var rows = sheet.getRange(2, 3, sheet.getLastRow() - 1, 1).getValues();
    for (var i = rows.length - 1; i >= 0; i--) {
      var order = JSON.parse(rows[i][0]);
      if (
        !order.receipt &&
        Date.parse(order.createdAt) < Date.now() - 30 * 86400000
      )
        sheet.deleteRow(i + 2);
    }
  });
}
function doGet() {
  return mcJson({ valid: false, message: "Use POST" });
}
function doPost(e) {
  try {
    var raw = (e && e.postData && e.postData.contents) || "{}";
    mcAssert(raw.length < 7200000, "Запрос слишком большой.");
    var p = JSON.parse(raw);
    var result;
    switch (p.action) {
      case "mentorship_config":
        result = mcConfig();
        break;
      case "mentorship_create_order":
        result = mcCreate(p);
        mcDeliver(result.order.id);
        break;
      case "mentorship_order":
        result = { valid: true, order: mcPublicOrder(mcAuthorized(p).order) };
        break;
      case "mentorship_receipt":
        result = mcReceipt(p);
        break;
      default:
        result = { valid: false, message: "Неизвестное действие." };
    }
    return mcJson(result);
  } catch (error) {
    // Never return stack traces, properties, customer data or receipt payloads.
    return mcJson({
      valid: false,
      message:
        /^(Exception|Service|You do not|Unexpected|Cannot|Invalid|Missing|Incomplete|Stored)/i.test(
          String(error.message || ""),
        )
          ? "Сервис временно недоступен. Повтори запрос или напиши Ярославу."
          : String(error.message || "Сервис временно недоступен.").slice(
              0,
              240,
            ),
    });
  }
}
function setupMentorship() {
  var props = mcProperties();
  if (!props.getProperty("MENTORSHIP_SECRET"))
    props.setProperty(
      "MENTORSHIP_SECRET",
      Utilities.getUuid() + Utilities.getUuid(),
    );
  var spreadsheetId = props.getProperty("MENTORSHIP_SPREADSHEET_ID");
  var book = spreadsheetId
    ? SpreadsheetApp.openById(spreadsheetId)
    : SpreadsheetApp.create("NWO — заявки на менторство");
  if (!spreadsheetId)
    props.setProperty("MENTORSHIP_SPREADSHEET_ID", book.getId());
  if (!book.getSheetByName("Orders")) {
    var first = book.getSheets()[0];
    var orders =
      first.getLastRow() === 0
        ? first.setName("Orders")
        : book.insertSheet("Orders");
    orders.appendRow(["order_id", "request_id", "record_json"]);
  }
  if (!book.getSheetByName("ReceiptFiles"))
    book.insertSheet("ReceiptFiles").appendRow(["order_id", "part", "base64"]);
  var defaults = {
    MENTORSHIP_ENABLED: "false",
    MENTORSHIP_CRYPTO_ENABLED: "false",
  };
  Object.keys(defaults).forEach(function (key) {
    if (!props.getProperty(key)) props.setProperty(key, defaults[key]);
  });
  if (
    !ScriptApp.getProjectTriggers().some(function (trigger) {
      return trigger.getHandlerFunction() === "retryMentorshipNotifications";
    })
  ) {
    ScriptApp.newTrigger("retryMentorshipNotifications")
      .timeBased()
      .everyMinutes(5)
      .create();
  }
  if (
    !ScriptApp.getProjectTriggers().some(function (trigger) {
      return (
        trigger.getHandlerFunction() === "purgeExpiredMentorshipApplications"
      );
    })
  ) {
    ScriptApp.newTrigger("purgeExpiredMentorshipApplications")
      .timeBased()
      .everyDays(1)
      .create();
  }
  console.log(
    "Setup complete. Add private Script Properties and enable checkout. Spreadsheet: " +
      props.getProperty("MENTORSHIP_SPREADSHEET_ID"),
  );
}

/** Owner-only editor smoke test. Not routed through the public web API; no contract or money. */
function testMentorshipDelivery() {
  var now = new Date().toISOString();
  var id = Utilities.getUuid();
  var price = {
    usd: 70,
    byn: 0,
    rate: null,
    rateDate: "SOFTWARE TEST",
    expiresAt: new Date(Date.now() + 3600000).toISOString(),
  };
  var docs = mcDocuments();
  var order = {
    id: id,
    requestId: Utilities.getUuid(),
    createdAt: now,
    expiresAt: price.expiresAt,
    customer: {
      name: "ТЕСТ ДОСТАВКИ — НЕ ПОКУПКА",
      email: mcProperty("MENTORSHIP_NOTIFY_EMAIL"),
      telegram: "@nwo_test",
      country: "BY",
    },
    method: "erip",
    network: "",
    price: price,
    documents: docs,
    consent: {
      acceptedAt: "SOFTWARE TEST — no contract accepted",
      version: MENTORSHIP_VERSION,
    },
    status: "awaiting_payment",
    notification: "sent",
    receipt: null,
    test: true,
  };
  mcLock(function () {
    mcSheet("Orders").appendRow([id, order.requestId, JSON.stringify(order)]);
    SpreadsheetApp.flush();
  });
  // Minimal PNG; fixture is explicitly labelled, not a bank receipt.
  var png =
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aW2kAAAAASUVORK5CYII=";
  var result = mcReceipt({
    id: id,
    token: mcToken(id),
    mime: "image/png",
    base64: png,
  });
  console.log(
    "SOFTWARE TEST: " +
      id +
      "; state=" +
      result.order.status +
      "; recipient=" +
      mcProperty("MENTORSHIP_NOTIFY_EMAIL"),
  );
}
