"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Copy,
  FileUp,
  Loader2,
} from "lucide-react";
import {
  MENTORSHIP_CONTACT_URL,
  MENTORSHIP_PRICE_USD,
  formatBYN,
  mentorshipRequest,
  validateReceipt,
  type MentorshipConfig,
  type MentorshipOrder,
  type PaymentMethod,
} from "@/lib/mentorship";
import { LegalDocumentView } from "./legal-document";

const STORAGE_KEY = "nwo-mentorship-order-v1";
const networkNames: Record<string, string> = {
  ton: "TON",
  trc20: "TRC20 · Tron",
  bep20: "BEP20 · BNB Smart Chain",
  solana: "Solana",
  erc20: "ERC20 · Ethereum",
};
const methods: { value: PaymentMethod; title: string; text: string }[] = [
  { value: "erip", title: "ЕРИП", text: "Беларусь · в BYN" },
  {
    value: "card",
    title: "Перевод на карту",
    text: "В BYN · проверь условия своего банка",
  },
  { value: "usdt", title: "USDT", text: "70 USDT · выбери сеть" },
  {
    value: "mir",
    title: "Карта «Мир»",
    text: "Россия · согласование в Telegram",
  },
];
function ContactLink({
  children = "Написать Ярославу",
}: {
  children?: React.ReactNode;
}) {
  return (
    <a
      className="site-text-link"
      href={MENTORSHIP_CONTACT_URL}
      target="_blank"
      rel="noopener noreferrer"
    >
      {children} ↗
    </a>
  );
}
function dateTime(value: string) {
  return new Intl.DateTimeFormat("ru", {
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Minsk",
  }).format(new Date(value));
}
function saveOrder(order: MentorshipOrder) {
  try {
    sessionStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ id: order.id, token: order.token }),
    );
  } catch {
    /* Checkout works when storage is blocked. */
  }
}
async function toBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).split(",")[1]);
    reader.onerror = () =>
      reject(new Error("Не удалось прочитать файл. Выбери его ещё раз."));
    reader.readAsDataURL(file);
  });
}
export function MentorshipCheckout() {
  const [config, setConfig] = useState<MentorshipConfig | null>(null);
  const [order, setOrder] = useState<MentorshipOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [country, setCountry] = useState("");
  const [method, setMethod] = useState<PaymentMethod>("erip");
  const [network, setNetwork] = useState("ton");
  const [file, setFile] = useState<File | null>(null);
  const [copied, setCopied] = useState("");
  const [expired, setExpired] = useState(false);
  const [legalOpen, setLegalOpen] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const requestId = useRef("");
  const nextHeading = useRef<HTMLHeadingElement>(null);

  async function load() {
    setLoading(true);
    setError("");
    try {
      const data =
        await mentorshipRequest<MentorshipConfig>("mentorship_config");
      setConfig(data);
      let stored: { id?: string; token?: string } = {};
      try {
        stored = JSON.parse(sessionStorage.getItem(STORAGE_KEY) || "{}");
      } catch {
        /* No saved order. */
      }
      if (stored.id && stored.token) {
        try {
          const restored = await mentorshipRequest<{
            valid: true;
            order: MentorshipOrder;
          }>("mentorship_order", stored);
          setOrder(restored.order);
        } catch {
          try {
            sessionStorage.removeItem(STORAGE_KEY);
          } catch {
            /* Optional storage. */
          }
          setError(
            "Не удалось восстановить прошлую заявку. Если уже оплатил, напиши Ярославу перед новой оплатой.",
          );
        }
      }
    } catch (reason) {
      setError(
        reason instanceof Error
          ? reason.message
          : "Не удалось загрузить оформление.",
      );
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    void load();
  }, []);
  useEffect(() => {
    if (!order) return;
    const check = () => setExpired(Date.parse(order.expiresAt) <= Date.now());
    check();
    const timer = setInterval(check, 30_000);
    return () => clearInterval(timer);
  }, [order]);

  useEffect(() => {
    if (!loading) nextHeading.current?.focus();
  }, [order?.id, order?.status, loading]);

  async function submitApplication(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy || !config?.quote) return;
    const data = new FormData(event.currentTarget);
    setBusy(true);
    setError("");
    if (!requestId.current) requestId.current = crypto.randomUUID();
    try {
      const result = await mentorshipRequest<{
        valid: true;
        order: MentorshipOrder;
      }>("mentorship_create_order", {
        name: data.get("name"),
        email: data.get("email"),
        telegram: data.get("telegram"),
        website: data.get("website"),
        country,
        method,
        network,
        quote: config.quote,
        requestId: requestId.current,
        acceptOffer: data.get("offer") === "on",
        acknowledgePrivacy: data.get("privacy") === "on",
        adult: data.get("adult") === "on",
      });
      setOrder(result.order);
      saveOrder(result.order);
      requestAnimationFrame(() => nextHeading.current?.focus());
    } catch (reason) {
      setError(
        reason instanceof Error ? reason.message : "Не удалось создать заявку.",
      );
    } finally {
      setBusy(false);
    }
  }
  async function uploadReceipt(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!file || !order || busy) return;
    const validation = validateReceipt(file);
    if (validation) {
      setError(validation);
      return;
    }
    setBusy(true);
    setError("");
    try {
      const base64 = await toBase64(file);
      const result = await mentorshipRequest<{
        valid: true;
        order: MentorshipOrder;
      }>("mentorship_receipt", {
        id: order.id,
        token: order.token,
        mime: file.type,
        base64,
      });
      setOrder(result.order);
      saveOrder(result.order);
      setFile(null);
      requestAnimationFrame(() => nextHeading.current?.focus());
    } catch (reason) {
      setError(
        reason instanceof Error
          ? reason.message
          : "Не удалось загрузить чек. Повтори отправку того же файла.",
      );
    } finally {
      setBusy(false);
    }
  }
  async function refreshStatus() {
    if (!order || busy) return;
    setBusy(true);
    setError("");
    try {
      const result = await mentorshipRequest<{
        valid: true;
        order: MentorshipOrder;
      }>("mentorship_order", { id: order.id, token: order.token });
      setOrder(result.order);
    } catch (reason) {
      setError(
        reason instanceof Error
          ? reason.message
          : "Не удалось проверить статус.",
      );
    } finally {
      setBusy(false);
    }
  }
  async function copy(value: string, label: string) {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(label);
    } catch {
      setCopied("Не удалось скопировать. Выдели реквизиты вручную.");
    }
  }
  function startAgain() {
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      /* Optional storage. */
    }
    setOrder(null);
    setFile(null);
    setAccepted(false);
    requestId.current = "";
    void load();
  }
  const submittedReceipt = order && order.status !== "awaiting_payment";
  const price = order?.price || config?.price;
  const currentMethod = order?.method || method;
  const amount =
    currentMethod === "usdt"
      ? "70 USDT"
      : currentMethod === "mir"
        ? "$70"
        : price
          ? formatBYN(price.byn)
          : "$70";

  return (
    <section className="site-container checkout-page">
      <Link href="/mentorship/" className="checkout-back">
        <ArrowLeft size={16} /> О менторстве
      </Link>
      <div className="checkout-heading">
        <div>
          <span className="site-eyebrow">Личная работа / 30 дней</span>
          <h1>
            Следующий шаг —<br />
            <em>вместе.</em>
          </h1>
          <p>
            Оформи заявку, получи реквизиты и прикрепи чек. Ярослав проверит
            оплату и согласует с тобой старт.
          </p>
        </div>
        <div className="checkout-price">
          <span>Менторство NWO</span>
          <strong>${MENTORSHIP_PRICE_USD}</strong>
          <span>за все 30 дней</span>
        </div>
      </div>
      <ol className="checkout-steps" aria-label="Этапы покупки">
        {["Заявка и условия", "Оплата", "Чек и проверка"].map((label, i) => {
          const step = submittedReceipt ? 2 : order ? 1 : 0;
          return (
            <li
              key={label}
              aria-current={step === i ? "step" : undefined}
              className={step >= i ? "is-active" : ""}
            >
              <span>{step > i ? <Check size={15} /> : `0${i + 1}`}</span>
              {label}
            </li>
          );
        })}
      </ol>
      <div className="checkout-layout">
        <div className="checkout-content" aria-busy={busy || loading}>
          {loading ? (
            <div className="checkout-notice" role="status">
              <Loader2 className="checkout-spinner" size={22} /> Загружаем
              оформление…
            </div>
          ) : !order ? (
            !config?.available ? (
              <div className="checkout-notice">
                <h2>Давай согласуем старт</h2>
                <p>
                  {error ||
                    config?.message ||
                    "Онлайн-оформление временно недоступно. Напиши Ярославу, чтобы купить менторство за $70."}
                </p>
                <ContactLink />
                <button
                  className="checkout-secondary"
                  onClick={() => void load()}
                >
                  Попробовать снова
                </button>
              </div>
            ) : (
              <form onSubmit={submitApplication} className="checkout-form">
                <h2>Знакомимся</h2>
                <p className="checkout-muted">
                  Контакты нужны для связи по заявке и началу работы.
                </p>
                <div className="checkout-fields">
                  <label>
                    Имя
                    <input
                      name="name"
                      autoComplete="name"
                      required
                      minLength={2}
                      maxLength={100}
                      placeholder="Как к тебе обращаться"
                    />
                  </label>
                  <label>
                    Email
                    <input
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      maxLength={160}
                      placeholder="you@example.com"
                    />
                  </label>
                  <label>
                    Telegram
                    <input
                      name="telegram"
                      autoComplete="off"
                      autoCapitalize="none"
                      spellCheck={false}
                      required
                      pattern="@[a-zA-Z0-9_]{5,32}"
                      title="Telegram в формате @username, от 5 до 32 символов после @"
                      placeholder="@username"
                      maxLength={33}
                    />
                  </label>
                  <label>
                    Страна оплаты
                    <select
                      name="country"
                      value={country}
                      onChange={(e) => {
                        setCountry(e.target.value);
                        setMethod(
                          e.target.value === "BY"
                            ? "erip"
                            : e.target.value === "RU"
                              ? "mir"
                              : config.cryptoEnabled
                                ? "usdt"
                                : "card",
                        );
                      }}
                      required
                    >
                      <option value="" disabled>
                        Выбери страну
                      </option>
                      <option value="BY">Беларусь</option>
                      <option value="RU">Россия</option>
                      <option value="OTHER">Другая страна</option>
                    </select>
                  </label>
                </div>
                <div className="checkout-honeypot" aria-hidden="true">
                  <label>
                    Сайт
                    <input name="website" tabIndex={-1} autoComplete="off" />
                  </label>
                </div>
                <fieldset className="checkout-methods">
                  <legend>Как удобнее оплатить?</legend>
                  {methods
                    .filter(
                      (item) =>
                        (item.value !== "erip" || country === "BY") &&
                        (item.value !== "mir" || country === "RU") &&
                        (item.value !== "usdt" ||
                          (config.cryptoEnabled &&
                            country &&
                            country !== "BY")),
                    )
                    .map((item) => (
                      <label
                        className={method === item.value ? "is-selected" : ""}
                        key={item.value}
                      >
                        <input
                          type="radio"
                          name="method"
                          value={item.value}
                          checked={method === item.value}
                          onChange={() => setMethod(item.value)}
                          required
                        />
                        <span>
                          <strong>{item.title}</strong>
                          <small>{item.text}</small>
                        </span>
                      </label>
                    ))}
                </fieldset>
                {method === "usdt" && (
                  <label className="checkout-network">
                    Сеть USDT
                    <select
                      value={network}
                      onChange={(e) => setNetwork(e.target.value)}
                    >
                      {Object.entries(networkNames).map(([value, label]) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                    </select>
                    <small>
                      Сеть отправления должна совпадать с сетью получателя.
                    </small>
                  </label>
                )}
                <div className="checkout-total">
                  <span>
                    {method === "mir" ? "Стоимость менторства" : "К оплате"}
                  </span>
                  <strong>{amount}</strong>
                </div>
                <p className="checkout-muted">
                  {method === "usdt"
                    ? "Комиссия отправляющей платформы — отдельно. К зачислению: 70 USDT."
                    : method === "mir"
                      ? "Сумму в RUB и реквизиты согласуешь с Ярославом в Telegram после заявки."
                      : price?.rate
                        ? `$70 × ${price.rate} BYN · курс НБРБ от ${price.rateDate}. Сумма фиксируется в заявке на 48 часов.`
                        : "Сумма будет указана в заявке."}
                </p>
                <details
                  className="checkout-terms"
                  open={legalOpen}
                  onToggle={(event) => setLegalOpen(event.currentTarget.open)}
                >
                  <summary>Условия менторства и возврата</summary>
                  {config.documents && (
                    <LegalDocumentView document={config.documents.offer} />
                  )}
                </details>
                <div className="checkout-consents">
                  <label>
                    <input
                      type="checkbox"
                      name="offer"
                      required
                      checked={accepted}
                      onChange={(e) => setAccepted(e.target.checked)}
                    />
                    <span>
                      Принимаю{" "}
                      <Link
                        href="/mentorship/terms/"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        условия менторства
                      </Link>
                      , включая порядок возврата.
                    </span>
                  </label>
                  <label>
                    <input type="checkbox" name="privacy" required />
                    <span>
                      Ознакомился с{" "}
                      <Link
                        href="/mentorship/privacy/"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        уведомлением об обработке данных
                      </Link>
                      .
                    </span>
                  </label>
                  <label>
                    <input type="checkbox" name="adult" required />
                    <span>
                      Мне исполнилось 18 лет либо я оформляю заявку как законный
                      представитель.
                    </span>
                  </label>
                </div>
                {error && (
                  <p className="checkout-error" role="alert">
                    {error}
                  </p>
                )}
                <button
                  type="submit"
                  className="site-button"
                  disabled={busy || !accepted || !country}
                >
                  {busy ? (
                    <>
                      <Loader2 className="checkout-spinner" size={18} /> Создаём
                      заявку…
                    </>
                  ) : (
                    <>
                      Создать заявку и получить реквизиты{" "}
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>
                <p className="checkout-muted">
                  Сначала согласуй с Ярославом задачи, график и объём обратной
                  связи. Деньги с карты здесь не списываются.
                </p>
                <button
                  type="button"
                  className="checkout-secondary"
                  disabled={busy}
                  onClick={() => {
                    setAccepted(false);
                    void load();
                  }}
                >
                  Обновить цену и условия
                </button>
              </form>
            )
          ) : (
            <div className="checkout-payment">
              <span className="site-eyebrow">Заявка зарегистрирована</span>
              <h2 ref={nextHeading} tabIndex={-1}>
                {order.status === "receipt_received"
                  ? "Чек отправлен Ярославу"
                  : order.status === "receipt_pending"
                    ? "Чек сохранён"
                    : "Теперь — оплата"}
              </h2>
              <p className="checkout-order-number">
                Номер заявки <strong>{order.id}</strong>
                <button
                  type="button"
                  onClick={() => void copy(order.id, "Номер заявки скопирован")}
                  aria-label="Скопировать номер заявки"
                >
                  <Copy size={17} />
                </button>
              </p>
              {submittedReceipt ? (
                <div className="checkout-notice checkout-success">
                  <Check size={28} />
                  <p>
                    {order.status === "receipt_received"
                      ? "Чек и заявка переданы на email Ярослава. Он проверит поступление денег и свяжется с тобой в течение двух рабочих дней."
                      : "Чек сохранён в заявке. Отправка уведомления ещё не подтверждена. Не плати повторно: проверь статус позже или напиши Ярославу с номером заявки."}
                  </p>
                  <strong>Оплата ожидает ручной проверки.</strong>
                  <ContactLink />
                  <button
                    className="checkout-secondary"
                    disabled={busy}
                    onClick={() => void refreshStatus()}
                  >
                    {busy ? "Проверяем…" : "Проверить статус"}
                  </button>
                </div>
              ) : (
                <>
                  {expired ? (
                    <div className="checkout-error" role="alert">
                      <p>
                        Срок действия реквизитов и суммы истёк. Не переводи
                        деньги по этой заявке.
                      </p>
                      <p>
                        Если уже оплатил, отправь чек Ярославу с номером заявки.
                      </p>
                      <ContactLink />
                      <button
                        className="checkout-secondary"
                        onClick={startAgain}
                      >
                        Создать новую заявку
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="checkout-total">
                        <span>
                          {order.method === "mir"
                            ? "Стоимость менторства"
                            : "К оплате"}
                        </span>
                        <strong>{amount}</strong>
                      </div>
                      <p className="checkout-muted">
                        Заявка действует до {dateTime(order.expiresAt)} (Минск).
                      </p>
                      <div className="checkout-bank-details">
                        {order.method === "erip" && (
                          <>
                            <h3>Через ЕРИП</h3>
                            <ol className="checkout-erip-path">
                              {order.instructions.path?.map((part) => (
                                <li key={part}>{part}</li>
                              ))}
                            </ol>
                            <span className="checkout-muted">Номер счёта</span>
                            <div className="checkout-copy-value">
                              <strong>{order.instructions.account}</strong>
                              <button
                                onClick={() =>
                                  void copy(
                                    order.instructions.account || "",
                                    "Номер счёта скопирован",
                                  )
                                }
                                aria-label="Скопировать номер счёта"
                              >
                                <Copy size={19} />
                              </button>
                            </div>
                          </>
                        )}
                        {order.method === "card" && (
                          <>
                            <h3>Перевод на карту</h3>
                            <span className="checkout-muted">
                              Номер карты получателя
                            </span>
                            <div className="checkout-copy-value">
                              <strong>{order.instructions.card}</strong>
                              <button
                                onClick={() =>
                                  void copy(
                                    (order.instructions.card || "").replace(
                                      /\s/g,
                                      "",
                                    ),
                                    "Номер карты скопирован",
                                  )
                                }
                                aria-label="Скопировать номер карты"
                              >
                                <Copy size={19} />
                              </button>
                            </div>
                            <p>
                              {order.instructions.holder}
                              <br />
                              Срок действия: {order.instructions.expiry}
                            </p>
                            <p className="checkout-muted">
                              Проверь валюту и комиссию в приложении своего
                              банка до подтверждения перевода.
                            </p>
                          </>
                        )}
                        {order.method === "usdt" && (
                          <>
                            <h3>USDT · {networkNames[order.network || ""]}</h3>
                            <p>
                              Отправляй только USDT в сети{" "}
                              <strong>
                                {networkNames[order.network || ""]}
                              </strong>
                              . К зачислению — 70 USDT, комиссия сети отдельно.
                            </p>
                            <span className="checkout-muted">
                              Адрес получателя
                            </span>
                            <div className="checkout-copy-value checkout-wallet">
                              <strong>{order.instructions.address}</strong>
                              <button
                                onClick={() =>
                                  void copy(
                                    order.instructions.address || "",
                                    "Адрес скопирован",
                                  )
                                }
                                aria-label="Скопировать адрес кошелька"
                              >
                                <Copy size={19} />
                              </button>
                            </div>
                            <p className="checkout-muted">
                              Проверь сеть и весь адрес. При ошибке сети
                              средства могут быть утрачены. Не отправляй TON,
                              TRX, BNB, SOL или ETH вместо USDT.
                            </p>
                          </>
                        )}
                        {order.method === "mir" && (
                          <>
                            <h3>Карта «Мир» из России</h3>
                            <p>
                              Напиши Ярославу, приложи номер заявки и согласуй
                              сумму в RUB и реквизиты перед переводом.
                            </p>
                            <ContactLink>
                              Согласовать оплату в Telegram
                            </ContactLink>
                          </>
                        )}
                      </div>
                      <form
                        className="checkout-upload"
                        onSubmit={uploadReceipt}
                      >
                        <h3>Оплатил? Прикрепи чек</h3>
                        <p className="checkout-muted">
                          JPG, PNG или PDF до 5 МБ. Оставь сумму, дату,
                          получателя и номер операции. Баланс и лишние реквизиты
                          можно скрыть.
                        </p>
                        <label className="checkout-file">
                          <FileUp size={24} />
                          <span>{file ? file.name : "Выбрать чек"}</span>
                          <input
                            type="file"
                            accept="image/jpeg,image/png,application/pdf"
                            required
                            aria-label="Выбрать чек оплаты"
                            disabled={busy}
                            onChange={(event) => {
                              const selected = event.target.files?.[0] || null;
                              setError("");
                              const problem = selected
                                ? validateReceipt(selected)
                                : null;
                              if (problem) {
                                setError(problem);
                                setFile(null);
                                event.target.value = "";
                              } else setFile(selected);
                            }}
                          />
                        </label>
                        <button
                          type="submit"
                          className="site-button"
                          disabled={!file || busy}
                        >
                          {busy ? (
                            <>
                              <Loader2 className="checkout-spinner" size={18} />{" "}
                              Сохраняем и отправляем…
                            </>
                          ) : (
                            <>
                              Отправить чек на проверку <ArrowRight size={18} />
                            </>
                          )}
                        </button>
                        <p className="checkout-muted">
                          Не закрывай вкладку до ответа. При задержке повтори
                          отправку того же файла — он не создаст новую заявку.
                        </p>
                      </form>
                    </>
                  )}
                </>
              )}
              {error && (
                <p className="checkout-error" role="alert">
                  {error}
                </p>
              )}
              <p className="checkout-copy-status" role="status">
                {copied}
              </p>
              <details className="checkout-terms">
                <summary>
                  Принятые условия · {order.documents.offer.version}
                </summary>
                <LegalDocumentView document={order.documents.offer} />
              </details>
            </div>
          )}
        </div>
        <aside className="checkout-summary">
          <span className="site-eyebrow">Что внутри</span>
          <h2>
            30 дней.
            <br />
            Твои задачи.
          </h2>
          <ul>
            <li>Индивидуальные созвоны</li>
            <li>Разбор реальных переговоров</li>
            <li>Обратная связь в Telegram</li>
          </ul>
          <p>
            Задачи, график и объём обратной связи согласуем до оплаты. Доход и
            трудоустройство не гарантируются.
          </p>
          <div>
            <span className="site-eyebrow">Можно передумать</span>
            <p>
              Отказ и возврат — по условиям менторства, с расчётом только
              допустимых законом фактических расходов.
            </p>
          </div>
          <ContactLink />
        </aside>
      </div>
    </section>
  );
}
