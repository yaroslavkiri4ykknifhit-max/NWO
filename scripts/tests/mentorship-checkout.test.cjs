const { test } = require("node:test");
const assert = require("node:assert/strict");
const vm = require("node:vm");
const fs = require("node:fs");
const crypto = require("node:crypto");

function environment() {
  const props = new Map(
    Object.entries({
      MENTORSHIP_SECRET: "a".repeat(64),
      MENTORSHIP_ENABLED: "true",
      MENTORSHIP_CRYPTO_ENABLED: "true",
      MENTORSHIP_SPREADSHEET_ID: "test-private-sheet",
      MENTORSHIP_NOTIFY_EMAIL: "owner@example.com",
      MENTORSHIP_PROVIDER_NAME: "Test provider",
      MENTORSHIP_PROVIDER_UNP: "EE0000000",
      MENTORSHIP_ERIP_ACCOUNT: "123",
      MENTORSHIP_CARD: "test-receiver",
      MENTORSHIP_CARD_HOLDER: "TEST",
      MENTORSHIP_USDT_TON: "test-wallet",
    }),
  );
  const cache = new Map();
  const sent = [];
  let failSend = false;
  let quota = 100;
  class Sheet {
    constructor() {
      this.rows = [["id", "request", "json"]];
    }
    getLastRow() {
      return this.rows.length;
    }
    appendRow(row) {
      this.rows.push(row);
    }
    deleteRow(row) {
      this.rows.splice(row - 1, 1);
    }
    getRange(row, col, count = 1, width = 1) {
      const sheet = this;
      return {
        getValues: () =>
          Array.from({ length: count }, (_, i) =>
            Array.from(
              { length: width },
              (_, j) => sheet.rows[row - 1 + i]?.[col - 1 + j] || "",
            ),
          ),
        getValue: () => sheet.rows[row - 1]?.[col - 1],
        setValue: (v) => {
          sheet.rows[row - 1][col - 1] = v;
        },
        setValues: (values) =>
          values.forEach((v, i) => {
            sheet.rows[row - 1 + i] ||= [];
            v.forEach((cell, j) => {
              sheet.rows[row - 1 + i][col - 1 + j] = cell;
            });
          }),
        createTextFinder: (text) => ({
          matchEntireCell: () => ({
            findNext: () => {
              const index = sheet.rows.findIndex(
                (r, i) =>
                  i >= row - 1 && i < row - 1 + count && r[col - 1] === text,
              );
              return index < 0 ? null : { getRow: () => index + 1 };
            },
          }),
        }),
      };
    }
  }
  const sheets = { Orders: new Sheet(), ReceiptFiles: new Sheet() };
  const context = vm.createContext({
    console,
    Date,
    JSON,
    Object,
    String,
    Number,
    Math,
    Error,
    PropertiesService: {
      getScriptProperties: () => ({
        getProperty: (k) => props.get(k),
        setProperty: (k, v) => props.set(k, v),
      }),
    },
    LockService: { getScriptLock: () => ({ waitLock() {}, releaseLock() {} }) },
    SpreadsheetApp: {
      openById: () => ({ getSheetByName: (n) => sheets[n] }),
      flush() {},
    },
    CacheService: {
      getScriptCache: () => ({
        get: (k) => cache.get(k),
        put: (k, v) => cache.set(k, v),
      }),
    },
    Utilities: {
      getUuid: () => crypto.randomUUID(),
      Charset: { UTF_8: "utf8" },
      DigestAlgorithm: { SHA_256: "sha256" },
      formatDate: () =>
        new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Minsk" }).format(
          new Date(),
        ),
      computeDigest: (_, s) => [
        ...crypto.createHash("sha256").update(s).digest(),
      ],
      computeHmacSha256Signature: (s, k) => [
        ...crypto.createHmac("sha256", k).update(s).digest(),
      ],
      base64EncodeWebSafe: (s) =>
        Buffer.from(typeof s === "string" ? s : s).toString("base64url"),
      base64DecodeWebSafe: (s) => [...Buffer.from(s, "base64url")],
      base64Decode: (s) => [...Buffer.from(s, "base64")],
      newBlob: (b, mime, name) => ({
        getDataAsString: () => Buffer.from(b).toString(),
        bytes: b,
        mime,
        name,
      }),
    },
    MailApp: {
      getRemainingDailyQuota: () => quota,
      sendEmail: (mail) => {
        if (failSend) throw Error("Service down");
        sent.push(mail);
      },
    },
    UrlFetchApp: {
      fetch: () => ({
        getResponseCode: () => 200,
        getContentText: () =>
          JSON.stringify({
            Cur_Abbreviation: "USD",
            Cur_Scale: 1,
            Cur_OfficialRate: 3.1234,
            Date:
              new Intl.DateTimeFormat("en-CA", {
                timeZone: "Europe/Minsk",
              }).format(new Date()) + "T00:00:00",
          }),
      }),
    },
    ContentService: {
      createTextOutput: (s) => ({ setMimeType: () => JSON.parse(s) }),
      MimeType: { JSON: "json" },
    },
  });
  vm.runInContext(
    fs.readFileSync("mentorship-apps-script.js", "utf8"),
    context,
  );
  const config = context.mcConfig();
  const application = {
    requestId: crypto.randomUUID(),
    quote: config.quote,
    name: '=HYPERLINK("bad")',
    email: "buyer@example.com",
    telegram: "@testbuyer",
    country: "BY",
    method: "erip",
    acceptOffer: true,
    acknowledgePrivacy: true,
    adult: true,
  };
  const receipt = Buffer.from(
    "%PDF-1.7\nsoftware test, not a payment",
  ).toString("base64");
  return {
    context,
    props,
    sheets,
    sent,
    config,
    application,
    receipt,
    setFail: (v) => {
      failSend = v;
    },
    setQuota: (v) => {
      quota = v;
    },
  };
}
test("banking details only after saved application; server price ignores submitted amount", () => {
  const e = environment();
  assert.equal(JSON.stringify(e.config).includes("test-receiver"), false);
  const result = e.context.mcCreate({
    ...e.application,
    price: { usd: 1, byn: 1 },
  });
  assert.equal(result.order.price.usd, 70);
  assert.equal(result.order.price.byn, 218.64);
  assert.equal(e.sheets.Orders.rows.length, 2);
  assert.equal(result.order.instructions.account, "123");
  assert.equal(result.order.status, "awaiting_payment");
  assert.equal(e.sheets.Orders.rows[1][2][0], "{"); // Applicant input is inside JSON, never a sheet formula.
});
test("all three acknowledgements are required server-side and forged quotes are rejected", () => {
  const e = environment();
  for (const key of ["acceptOffer", "acknowledgePrivacy", "adult"])
    assert.throws(() => e.context.mcCreate({ ...e.application, [key]: false }));
  assert.throws(() =>
    e.context.mcCreate({
      ...e.application,
      quote: e.config.quote + "tampered",
    }),
  );
  assert.equal(e.sheets.Orders.rows.length, 1);
});
test("request retries create one order; another email cannot reuse request id", () => {
  const e = environment();
  const first = e.context.mcCreate(e.application).order;
  const second = e.context.mcCreate(e.application).order;
  assert.equal(first.id, second.id);
  assert.equal(first.token, second.token);
  assert.equal(e.sheets.Orders.rows.length, 2);
  assert.throws(() =>
    e.context.mcCreate({ ...e.application, email: "different@example.com" }),
  );
});
test("another visitor cannot read or attach receipt; MIME mismatch and oversize are rejected", () => {
  const e = environment();
  const order = e.context.mcCreate(e.application).order;
  assert.throws(() => e.context.mcAuthorized({ id: order.id, token: "wrong" }));
  assert.throws(() =>
    e.context.mcReceipt({
      id: order.id,
      token: "wrong",
      base64: e.receipt,
      mime: "application/pdf",
    }),
  );
  assert.throws(() =>
    e.context.mcValidateFile({ base64: e.receipt, mime: "image/png" }),
  );
  assert.throws(() =>
    e.context.mcValidateFile({
      base64: "a".repeat(7_000_000),
      mime: "application/pdf",
    }),
  );
  assert.equal(e.sheets.ReceiptFiles.rows.length, 1);
});
test("a receipt is saved before email; retries send one attachment and never mark payment paid", () => {
  const e = environment();
  const o = e.context.mcCreate(e.application).order;
  const p = {
    id: o.id,
    token: o.token,
    base64: e.receipt,
    mime: "application/pdf",
  };
  const result = e.context.mcReceipt(p);
  const repeated = e.context.mcReceipt(p);
  assert.equal(result.order.status, "receipt_received");
  assert.equal(repeated.order.status, "receipt_received");
  assert.equal(e.sent.length, 1);
  assert.equal(e.sent[0].to, "owner@example.com");
  assert.equal(e.sent[0].attachments.length, 2);
  assert.equal(e.sheets.ReceiptFiles.rows.length, 2);
  assert.equal(JSON.stringify(result).includes(e.receipt), false);
  assert.equal(JSON.stringify(result).includes("paid"), false);
});
test("failed email retains receipt, reports pending and does not send duplicates on uncertain delivery", () => {
  const e = environment();
  const o = e.context.mcCreate(e.application).order;
  e.setFail(true);
  const p = {
    id: o.id,
    token: o.token,
    base64: e.receipt,
    mime: "application/pdf",
  };
  assert.equal(e.context.mcReceipt(p).order.status, "receipt_pending");
  assert.equal(e.sheets.ReceiptFiles.rows.length, 2);
  e.setFail(false);
  assert.equal(e.context.mcReceipt(p).order.status, "receipt_pending");
  assert.equal(e.sent.length, 0);
});
test("quota exhaustion keeps notification pending and retry trigger delivers saved attachment", () => {
  const e = environment();
  const o = e.context.mcCreate(e.application).order;
  e.setQuota(0);
  assert.equal(
    e.context.mcReceipt({
      id: o.id,
      token: o.token,
      base64: e.receipt,
      mime: "application/pdf",
    }).order.status,
    "receipt_pending",
  );
  e.setQuota(10);
  e.context.retryMentorshipNotifications();
  assert.equal(e.sent.length, 1);
  assert.equal(e.context.mcFind(o.id).order.status, "receipt_received");
});
test("consent snapshot is immutable; updated offer invalidates unused quote", () => {
  const e = environment();
  const o = e.context.mcCreate(e.application).order;
  e.props.set("MENTORSHIP_PROVIDER_NAME", "Changed");
  assert.equal(
    e.context
      .mcFind(o.id)
      .order.documents.offer.sections[0].paragraphs[0].includes(
        "Test provider",
      ),
    true,
  );
  assert.throws(() =>
    e.context.mcCreate({ ...e.application, requestId: crypto.randomUUID() }),
  );
});
test("crypto network and country restrictions cannot be bypassed from client", () => {
  const e = environment();
  assert.throws(() =>
    e.context.mcCreate({ ...e.application, method: "usdt", network: "ton" }),
  );
  assert.throws(() =>
    e.context.mcCreate({
      ...e.application,
      country: "OTHER",
      method: "usdt",
      network: "fake",
    }),
  );
  const o = e.context.mcCreate({
    ...e.application,
    country: "OTHER",
    method: "usdt",
    network: "ton",
  }).order;
  assert.equal(o.instructions.address, "test-wallet");
  assert.equal(o.network, "ton");
});
