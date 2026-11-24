// Public web-app endpoint, never a secret. Receiving details stay in Script Properties.
export const MENTORSHIP_API_URL =
  "https://script.google.com/macros/s/AKfycbyuPj4kshzjS5L8SnmcZxSYdzrlZHoWyRtHk0Z9ZilFfGq2zKgq1T3y5CHjYd8FjqhwAQ/exec";
export const MENTORSHIP_CONTACT_URL = "https://t.me/yaroslavkirichyk";
export const MENTORSHIP_PRICE_USD = 70;
export const MENTORSHIP_DAYS = 30;
export const MENTORSHIP_MAX_RECEIPT_BYTES = 5 * 1024 * 1024;

export type PaymentMethod = "erip" | "card" | "usdt" | "mir";
export type LegalDocument = {
  title: string;
  version: string;
  sections: { title: string; paragraphs: string[] }[];
};
export type MentorshipConfig = {
  valid: true;
  available: boolean;
  message?: string;
  cryptoEnabled?: boolean;
  quote?: string;
  price?: {
    usd: number;
    byn: number;
    rate: number | null;
    rateDate: string;
    expiresAt: string;
  };
  documents?: { offer: LegalDocument; privacy: LegalDocument };
};
export type MentorshipOrder = {
  id: string;
  token: string;
  createdAt: string;
  expiresAt: string;
  status: "awaiting_payment" | "receipt_pending" | "receipt_received";
  price: NonNullable<MentorshipConfig["price"]>;
  method: PaymentMethod;
  network?: string;
  instructions: {
    path?: string[];
    account?: string;
    card?: string;
    holder?: string;
    expiry?: string;
    address?: string;
    network?: string;
    contact?: string;
  };
  documents: NonNullable<MentorshipConfig["documents"]>;
};

export function formatBYN(value: number) {
  return new Intl.NumberFormat("ru-BY", {
    style: "currency",
    currency: "BYN",
    currencyDisplay: "code",
    minimumFractionDigits: 2,
  }).format(value);
}

export function validateReceipt(
  file: Pick<File, "size" | "type">,
): string | null {
  if (!file.size) return "Этот файл пустой. Выбери чек ещё раз.";
  if (file.size > MENTORSHIP_MAX_RECEIPT_BYTES)
    return "Чек должен быть не больше 5 МБ.";
  if (!["image/jpeg", "image/png", "application/pdf"].includes(file.type)) {
    return "Подойдут JPG, PNG или PDF. Для HEIC сохрани фото как JPG.";
  }
  return null;
}

export async function mentorshipRequest<T>(
  action: string,
  payload: Record<string, unknown> = {},
): Promise<T> {
  const endpoint =
    process.env.NEXT_PUBLIC_MENTORSHIP_API_URL || MENTORSHIP_API_URL;
  if (!endpoint || /YOUR_SCRIPT_ID|REPLACE_ME/.test(endpoint)) {
    throw new Error(
      "Оформление временно недоступно. Напиши Ярославу — он поможет с покупкой.",
    );
  }
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 60_000);
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ action, ...payload }),
      redirect: "follow",
      cache: "no-store",
      referrerPolicy: "no-referrer",
      signal: controller.signal,
    });
    if (!response.ok)
      throw new Error("Сервис не ответил. Попробуй ещё раз через минуту.");
    const result = await response.json();
    if (!result.valid) {
      throw new Error(
        result.message || "Не удалось выполнить запрос. Попробуй ещё раз.",
      );
    }
    return result as T;
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error(
        "Ответ задерживается. Повтори запрос — заявка не продублируется.",
      );
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}
