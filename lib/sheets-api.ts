/**
 * Клиент закрытого Google Apps Script API для статического GitHub Pages.
 * Платные материалы не входят в сборку: Apps Script отдаёт их только после
 * проверки короткоживущего подписанного токена и текущего статуса доступа.
 *
 * Аутентификация: Email OTP + WebAuthn Passkey
 */

const APPS_SCRIPT_URL = process.env.NEXT_PUBLIC_APPS_SCRIPT_URL || ""
const SESSION_STORAGE_KEY = "nwo_paid_session"
const FREE_PROGRESS_STORAGE_KEY = "nwo_free_progress"

export interface SheetModule {
  id: string
  name: string
  status: string
}

export interface SheetLesson {
  id: string
  moduleId: string
  title: string
  textContent: string
  videoUrl: string
}

export interface CourseModule {
  id: string
  title: string
  lessons: CourseLesson[]
}

export interface CourseLesson {
  id: string
  moduleId: string
  title: string
  textContent: string
  videoUrl: string
}

export interface CourseData {
  name: string
  modules: CourseModule[]
}

// ── Auth types ──────────────────────────────────────────────────────

export interface UserProfile {
  email: string
  display_name: string
}

export interface AuthSession {
  authenticated: boolean
  user: UserProfile | null
  completedLessons: string[]
}

export interface PaidAuthSession {
  authenticated: boolean
  paidAccess: boolean
  user: UserProfile | null
  completedLessons: string[]
}

export interface ShameTrade {
  id: string
  title: string
  manager: string
  client: string
  dealAmount: string
  date: string
  screenshots: string[]
  textContent: string
}

interface ApiResult {
  valid?: boolean
  error?: string
  message?: string
  session_token?: string
}

// ── Session helpers ─────────────────────────────────────────────────

function getSessionToken(): string {
  if (typeof window === "undefined") return ""
  return sessionStorage.getItem(SESSION_STORAGE_KEY) || ""
}

function saveSessionToken(token: string): void {
  if (typeof window !== "undefined") {
    sessionStorage.setItem(SESSION_STORAGE_KEY, token)
  }
}

function clearSessionToken(): void {
  if (typeof window !== "undefined") {
    sessionStorage.removeItem(SESSION_STORAGE_KEY)
  }
}

// ── Demo data ───────────────────────────────────────────────────────

const DEMO_FREE_COURSE: CourseData = {
  name: "NWO: Бесплатная база продаж",
  modules: [
    {
      id: "module-1",
      title: "Модуль 01 · Фундамент и психология продаж",
      lessons: [
        {
          id: "lesson-1",
          moduleId: "1",
          title: "Урок 1: Архитектура переговоров и мышление",
          textContent: "Вводный урок открытой программы New Way Out. Разбираем фундамент закрытия сделок, позиционирование эксперта и психологию клиента на первом этапе воронки.",
          videoUrl: "",
        },
        {
          id: "lesson-2",
          moduleId: "1",
          title: "Урок 2: Быстрая квалификация и выявление истинных болей",
          textContent: "Как за первые 3 минуты разговора отсечь нецелевых лидов и сфокусироваться на клиентах, готовых платить сразу.",
          videoUrl: "",
        },
      ],
    },
    {
      id: "module-2",
      title: "Модуль 02 · Отработка сомнений и дожим",
      lessons: [
        {
          id: "lesson-3",
          moduleId: "2",
          title: "Урок 3: Логика работы с возражением «Дорого»",
          textContent: "Пошаговая схема деконструкции цены в ценность без скидок и уступок со стороны эксперта.",
          videoUrl: "",
        },
      ],
    },
  ],
}

const DEMO_PAID_COURSE: CourseData = {
  name: "NWO BLACK: Закрытая база",
  modules: [
    {
      id: "module-101",
      title: "Модуль 01 · Архитектура крупных сделок ($5,000+)",
      lessons: [
        {
          id: "lesson-101",
          moduleId: "101",
          title: "Урок 1: Стратегия закрытия сделок с высоким чеком",
          textContent: "Эксклюзивные материалы NWO BLACK. Полный разбор переговорных конструкций для закрытия контрактов от $5,000.",
          videoUrl: "",
        },
        {
          id: "lesson-102",
          moduleId: "101",
          title: "Урок 2: Боевые скрипты и психотипы ЛПР",
          textContent: "Классификация лиц, принимающих решения, и скрипты адаптации аргументации под каждый психотип.",
          videoUrl: "",
        },
      ],
    },
    {
      id: "module-102",
      title: "Модуль 02 · Системный дожим и закрытие",
      lessons: [
        {
          id: "lesson-103",
          moduleId: "102",
          title: "Урок 3: Протокол финального закрытия сделки",
          textContent: "Пошаговый сценарий вывода клиента на оплату в день звонка без давления и манипуляций.",
          videoUrl: "",
        },
      ],
    },
  ],
}

function isDevMock(): boolean {
  return !APPS_SCRIPT_URL || APPS_SCRIPT_URL.includes("YOUR_SCRIPT_ID") || APPS_SCRIPT_URL.includes("REPLACE_ME")
}

function isLocalhost(): boolean {
  if (typeof window === "undefined") return false
  return window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
}

// ── API fetch ───────────────────────────────────────────────────────

async function apiFetch<T extends ApiResult>(
  action: string,
  payload: Record<string, unknown> = {},
  includeSession = true,
): Promise<T> {
  if (isDevMock()) {
    throw new Error("API курса не настроен")
  }

  const sessionToken = includeSession ? getSessionToken() : ""
  const controller = new AbortController()
  const timeout = window.setTimeout(() => controller.abort(), 30_000)

  try {
    const response = await fetch(APPS_SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({
        action,
        ...payload,
        ...(sessionToken ? { session_token: sessionToken } : {}),
      }),
      cache: "no-store",
      redirect: "follow",
      referrerPolicy: "no-referrer",
      signal: controller.signal,
    })

    if (!response.ok) {
      throw new Error(`Сервис курса вернул HTTP ${response.status}`)
    }

    return (await response.json()) as T
  } catch (error) {
    if ((error as Error).name === "AbortError") {
      throw new Error("Сервис курса не ответил вовремя")
    }
    throw error
  } finally {
    window.clearTimeout(timeout)
  }
}

function parseProgress(value: unknown): string[] {
  return String(value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)
}

function normalizeDashes(value: unknown): string {
  return String(value ?? "").replace(/[—–]/g, "-")
}

function accessError(result: ApiResult): Error {
  if (["session_invalid", "session_expired", "access_inactive"].includes(result.error || "")) {
    clearSessionToken()
  }
  return new Error(result.message || "Доступ истёк или был отозван")
}

// ── Email OTP Auth ──────────────────────────────────────────────────

/**
 * Запросить OTP код на email.
 */
export async function requestEmailOTP(
  email: string,
): Promise<{ sent: boolean; error?: string }> {
  if (isDevMock() || isLocalhost()) {
    // На localhost эмулируем отправку — код всегда 000000
    return { sent: true }
  }

  try {
    const result = await apiFetch<ApiResult & { sent?: boolean }>(
      "email_otp",
      { email: email.trim().toLowerCase() },
      false,
    )
    return { sent: result.sent === true || result.valid === true, error: result.message }
  } catch (err) {
    return { sent: false, error: (err as Error).message || "Не удалось отправить код" }
  }
}

/**
 * Проверить OTP код и войти.
 * Возвращает session_token если email уже привязан к инвайту,
 * или needsCode=true если нужен инвайт-код.
 */
export async function verifyEmailOTP(
  email: string,
  code: string,
): Promise<{ valid: boolean; needsCode?: boolean; error?: string }> {
  if (isDevMock() || isLocalhost()) {
    // На localhost: любой код проходит
    const savedToken = getSessionToken()
    if (savedToken) {
      return { valid: true }
    }
    return { valid: false, needsCode: true }
  }

  try {
    const result = await apiFetch<ApiResult>(
      "email_verify",
      { email: email.trim().toLowerCase(), code: code.trim() },
      false,
    )

    if (result.valid && result.session_token) {
      saveSessionToken(result.session_token)
      return { valid: true }
    }

    if (result.error === "not_bound") {
      return { valid: false, needsCode: true, error: "not_bound" }
    }

    return { valid: false, error: result.message || "Неверный код" }
  } catch (error) {
    console.warn("Email verify error:", error)
    return { valid: false, error: "Ошибка проверки кода" }
  }
}

/**
 * Привязать email к инвайт-коду.
 */
export async function bindEmailToCode(
  email: string,
  inviteCode: string,
): Promise<{ valid: boolean; error?: string }> {
  if (isDevMock() || isLocalhost()) {
    saveSessionToken("dev_session_" + Date.now())
    return { valid: true }
  }

  try {
    const result = await apiFetch<ApiResult>(
      "email_bind",
      { email: email.trim().toLowerCase(), code: inviteCode.trim() },
      false,
    )

    if (result.valid && result.session_token) {
      saveSessionToken(result.session_token)
      return { valid: true }
    }

    return {
      valid: false,
      error: result.message || "Код недействителен или уже активирован",
    }
  } catch {
    return { valid: false, error: "Ошибка привязки кода" }
  }
}

// ── Passkey (WebAuthn) ──────────────────────────────────────────────

/** Проверяем доступность Passkey в текущем браузере */
export function isPasskeySupported(): boolean {
  return (
    typeof window !== "undefined" &&
    typeof window.PublicKeyCredential !== "undefined" &&
    typeof window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable === "function"
  )
}

/** Проверяем наличие платформенного аутентификатора (Touch ID / Face ID) */
export async function isPlatformAuthenticatorAvailable(): Promise<boolean> {
  if (!isPasskeySupported()) return false
  try {
    return await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()
  } catch {
    return false
  }
}

function bufferToBase64url(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer)
  let str = ""
  for (let i = 0; i < bytes.length; i++) {
    str += String.fromCharCode(bytes[i])
  }
  return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "")
}

function base64urlToBuffer(base64url: string): ArrayBuffer {
  let str = base64url.replace(/-/g, "+").replace(/_/g, "/")
  while (str.length % 4) str += "="
  const raw = atob(str)
  const bytes = new Uint8Array(raw.length)
  for (let i = 0; i < raw.length; i++) {
    bytes[i] = raw.charCodeAt(i)
  }
  return bytes.buffer
}

interface PasskeyChallengeResponse {
  challenge: string // base64url
  rpId: string
  rpName: string
  credentialIds?: string[] // для login — список зарегистрированных credential IDs
  userId?: string // для register — base64url user id
}

/**
 * Получить challenge от сервера для WebAuthn операции.
 */
async function getPasskeyChallenge(
  purpose: "register" | "login",
  email?: string,
): Promise<PasskeyChallengeResponse> {
  if (isDevMock() || isLocalhost()) {
    // Локальный challenge для тестирования
    const challengeBytes = new Uint8Array(32)
    crypto.getRandomValues(challengeBytes)
    return {
      challenge: bufferToBase64url(challengeBytes.buffer),
      rpId: "localhost",
      rpName: "NWO Academy",
      userId: bufferToBase64url(new TextEncoder().encode(email || "dev@test.local").buffer as ArrayBuffer),
      credentialIds: [],
    }
  }

  const result = await apiFetch<ApiResult & PasskeyChallengeResponse>(
    "passkey_challenge",
    { purpose, ...(email ? { email: email.trim().toLowerCase() } : {}) },
    purpose === "register", // register нуждается в session_token
  )

  if (!result.valid && !result.challenge) {
    throw new Error(result.message || "Не удалось получить challenge")
  }

  return result
}

/**
 * Зарегистрировать passkey для текущего пользователя.
 * Вызывать ПОСЛЕ успешного входа по email.
 */
export async function registerPasskey(email: string, displayName: string): Promise<boolean> {
  try {
    const challengeData = await getPasskeyChallenge("register", email)

    const credential = (await navigator.credentials.create({
      publicKey: {
        challenge: base64urlToBuffer(challengeData.challenge),
        rp: {
          name: challengeData.rpName,
          id: challengeData.rpId,
        },
        user: {
          id: base64urlToBuffer(challengeData.userId || bufferToBase64url(new TextEncoder().encode(email).buffer as ArrayBuffer)),
          name: email,
          displayName: displayName || email,
        },
        pubKeyCredParams: [
          { alg: -7, type: "public-key" },   // ES256
          { alg: -257, type: "public-key" },  // RS256
        ],
        authenticatorSelection: {
          authenticatorAttachment: "platform",
          userVerification: "preferred",
          residentKey: "preferred",
          requireResidentKey: false,
        },
        timeout: 60000,
        attestation: "none",
      },
    })) as PublicKeyCredential | null

    if (!credential) return false

    const response = credential.response as AuthenticatorAttestationResponse

    if (isDevMock() || isLocalhost()) {
      // На localhost сохраняем credential ID в sessionStorage для демо
      const credId = bufferToBase64url(credential.rawId)
      sessionStorage.setItem("nwo_dev_passkey_cred", credId)
      return true
    }

    const result = await apiFetch<ApiResult>(
      "passkey_register",
      {
        credential_id: bufferToBase64url(credential.rawId),
        client_data_json: bufferToBase64url(response.clientDataJSON),
        attestation_object: bufferToBase64url(response.attestationObject),
        challenge: challengeData.challenge,
      },
      true,
    )

    return result.valid === true
  } catch (err) {
    console.warn("Passkey registration failed:", err)
    return false
  }
}

/**
 * Войти через passkey (без email, без пароля).
 */
export async function loginWithPasskey(): Promise<{
  valid: boolean
  error?: string
}> {
  try {
    if (isDevMock() || isLocalhost()) {
      // На localhost: эмулируем passkey login
      const credId = sessionStorage.getItem("nwo_dev_passkey_cred")
      if (!credId) {
        return { valid: false, error: "no_passkey" }
      }

      // Показываем нативный WebAuthn prompt даже на localhost
      try {
        const challengeBytes = new Uint8Array(32)
        crypto.getRandomValues(challengeBytes)

        await navigator.credentials.get({
          publicKey: {
            challenge: challengeBytes,
            rpId: "localhost",
            userVerification: "preferred",
            timeout: 60000,
          },
        })
      } catch {
        // Если WebAuthn отменён — всё равно пускаем на localhost
      }

      saveSessionToken("dev_session_" + Date.now())
      return { valid: true }
    }

    const challengeData = await getPasskeyChallenge("login")

    const allowCredentials: PublicKeyCredentialDescriptor[] = (challengeData.credentialIds || []).map(
      (id) => ({
        type: "public-key" as const,
        id: base64urlToBuffer(id),
      }),
    )

    const assertion = (await navigator.credentials.get({
      publicKey: {
        challenge: base64urlToBuffer(challengeData.challenge),
        rpId: challengeData.rpId,
        ...(allowCredentials.length > 0 ? { allowCredentials } : {}),
        userVerification: "preferred",
        timeout: 60000,
      },
    })) as PublicKeyCredential | null

    if (!assertion) {
      return { valid: false, error: "Вход отменён" }
    }

    const response = assertion.response as AuthenticatorAssertionResponse

    const result = await apiFetch<ApiResult>(
      "passkey_login",
      {
        credential_id: bufferToBase64url(assertion.rawId),
        client_data_json: bufferToBase64url(response.clientDataJSON),
        authenticator_data: bufferToBase64url(response.authenticatorData),
        signature: bufferToBase64url(response.signature),
        challenge: challengeData.challenge,
      },
      false,
    )

    if (result.valid && result.session_token) {
      saveSessionToken(result.session_token)
      return { valid: true }
    }

    return { valid: false, error: result.message || "Ошибка входа" }
  } catch (err) {
    console.warn("Passkey login failed:", err)
    if ((err as Error).name === "NotAllowedError") {
      return { valid: false, error: "Вход отменён" }
    }
    return { valid: false, error: "Passkey не найден на этом устройстве" }
  }
}

// ── Session ─────────────────────────────────────────────────────────

export async function getAuthSession(): Promise<AuthSession> {
  if (!getSessionToken()) {
    return { authenticated: false, user: null, completedLessons: [] }
  }

  try {
    const result = await apiFetch<
      ApiResult & {
        completed_lessons?: string
        user?: UserProfile
      }
    >("session")

    if (!result.valid) {
      clearSessionToken()
      return { authenticated: false, user: null, completedLessons: [] }
    }

    return {
      authenticated: true,
      user: result.user || null,
      completedLessons: parseProgress(result.completed_lessons),
    }
  } catch {
    clearSessionToken()
    return { authenticated: false, user: null, completedLessons: [] }
  }
}

export async function getPaidAuthSession(): Promise<PaidAuthSession> {
  if (!getSessionToken()) {
    return {
      authenticated: false,
      paidAccess: false,
      user: null,
      completedLessons: [],
    }
  }

  if (isDevMock() || isLocalhost()) {
    const saved = typeof window !== "undefined"
      ? JSON.parse(sessionStorage.getItem("nwo_dev_paid_progress") || "[]")
      : []
    return {
      authenticated: true,
      paidAccess: true,
      user: {
        email: "dev@test.local",
        display_name: "Ярослав",
      },
      completedLessons: Array.isArray(saved) ? saved : [],
    }
  }

  try {
    const result = await apiFetch<
      ApiResult & {
        paid_access?: boolean
        paid_completed_lessons?: string
        user?: UserProfile
      }
    >("paid_session")

    if (!result.valid) {
      clearSessionToken()
      return {
        authenticated: false,
        paidAccess: false,
        user: null,
        completedLessons: [],
      }
    }

    return {
      authenticated: true,
      paidAccess: result.paid_access === true,
      user: result.user || null,
      completedLessons: parseProgress(result.paid_completed_lessons),
    }
  } catch {
    clearSessionToken()
    return {
      authenticated: false,
      paidAccess: false,
      user: null,
      completedLessons: [],
    }
  }
}

// ── Logout ──────────────────────────────────────────────────────────

export async function logout(): Promise<void> {
  clearSessionToken()
}

// ── Course data ─────────────────────────────────────────────────────

export async function fetchCourseData(): Promise<CourseData> {
  const result = await apiFetch<
    ApiResult & {
      name?: string
      modules?: SheetModule[]
      lessons?: SheetLesson[]
    }
  >("all")

  if (!result.valid) throw accessError(result)

  const sheetModules = result.modules || []
  const sheetLessons = result.lessons || []
  const modules: CourseModule[] = sheetModules.map((module) => ({
    id: `module-${module.id}`,
    title: normalizeDashes(module.name),
    lessons: sheetLessons
      .filter((lesson) => String(lesson.moduleId) === String(module.id))
      .map((lesson) => ({
        id: `lesson-${lesson.id}`,
        moduleId: String(lesson.moduleId),
        title: normalizeDashes(lesson.title),
        textContent: normalizeDashes(lesson.textContent),
        videoUrl: lesson.videoUrl,
      })),
  }))

  return { name: normalizeDashes(result.name || "Академия: Полный курс"), modules }
}

export async function fetchPublicCourseData(): Promise<CourseData> {
  if (isDevMock()) {
    return DEMO_FREE_COURSE
  }

  const result = await apiFetch<
    ApiResult & {
      name?: string
      modules?: SheetModule[]
      lessons?: SheetLesson[]
    }
  >("public_all", {}, false)

  if (!result.valid) {
    throw new Error(result.message || "Не удалось загрузить бесплатный курс")
  }

  const sheetModules = result.modules || []
  const sheetLessons = result.lessons || []
  const modules: CourseModule[] = sheetModules.map((module) => ({
    id: `module-${module.id}`,
    title: normalizeDashes(module.name),
    lessons: sheetLessons
      .filter((lesson) => String(lesson.moduleId) === String(module.id))
      .map((lesson) => ({
        id: `lesson-${lesson.id}`,
        moduleId: String(lesson.moduleId),
        title: normalizeDashes(lesson.title),
        textContent: normalizeDashes(lesson.textContent),
        videoUrl: lesson.videoUrl,
      })),
  }))

  return { name: normalizeDashes(result.name || "NWO: Бесплатная база продаж"), modules }
}

export function getLocalFreeProgress(): string[] {
  if (typeof window === "undefined") return []
  try {
    const saved = JSON.parse(localStorage.getItem(FREE_PROGRESS_STORAGE_KEY) || "[]")
    if (!Array.isArray(saved)) return []
    return saved
      .map((item) => String(item))
      .filter((item) => /^lesson-[A-Za-z0-9_-]{1,80}$/.test(item))
      .slice(0, 500)
  } catch {
    return []
  }
}

export function saveLocalFreeProgress(completedLessons: string[]): void {
  if (typeof window === "undefined") return
  const safeItems = completedLessons
    .filter((item) => /^lesson-[A-Za-z0-9_-]{1,80}$/.test(item))
    .slice(0, 500)
  localStorage.setItem(FREE_PROGRESS_STORAGE_KEY, JSON.stringify(safeItems))
}

export async function fetchPaidCourseData(): Promise<{
  course: CourseData
  completedLessons: string[]
}> {
  if (isDevMock() || isLocalhost()) {
    const saved = typeof window !== "undefined"
      ? JSON.parse(sessionStorage.getItem("nwo_dev_paid_progress") || "[]")
      : []
    return {
      course: DEMO_PAID_COURSE,
      completedLessons: Array.isArray(saved) ? saved : [],
    }
  }

  try {
    const result = await apiFetch<
      ApiResult & {
        name?: string
        modules?: SheetModule[]
        lessons?: SheetLesson[]
        completed_lessons?: string
      }
    >("paid_all")

    if (!result.valid) throw accessError(result)

    const sheetModules = result.modules || []
    const sheetLessons = result.lessons || []
    const modules: CourseModule[] = sheetModules.map((module) => ({
      id: `module-${module.id}`,
      title: normalizeDashes(module.name),
      lessons: sheetLessons
        .filter((lesson) => String(lesson.moduleId) === String(module.id))
        .map((lesson) => ({
          id: `lesson-${lesson.id}`,
          moduleId: String(lesson.moduleId),
          title: normalizeDashes(lesson.title),
          textContent: normalizeDashes(lesson.textContent),
          videoUrl: lesson.videoUrl,
        })),
    }))

    return {
      course: { name: normalizeDashes(result.name || "NWO BLACK: Закрытая база"), modules },
      completedLessons: parseProgress(result.completed_lessons),
    }
  } catch (err) {
    console.warn("Falling back to demo paid course:", err)
    return {
      course: DEMO_PAID_COURSE,
      completedLessons: [],
    }
  }
}

export async function saveProgress(completedLessons: string[]): Promise<void> {
  if (isDevMock()) return
  const result = await apiFetch<ApiResult>("save_progress", {
    completed_lessons: completedLessons.join(","),
  })
  if (!result.valid) throw accessError(result)
}

export async function savePaidProgress(completedLessons: string[]): Promise<void> {
  if (isDevMock()) {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("nwo_dev_paid_progress", JSON.stringify(completedLessons))
    }
    return
  }
  const result = await apiFetch<ApiResult>("save_paid_progress", {
    completed_lessons: completedLessons.join(","),
  })
  if (!result.valid) throw accessError(result)
}

// ── Shame trades ────────────────────────────────────────────────────

export async function fetchShameTrades(): Promise<ShameTrade[]> {
  if (isDevMock()) return []

  const result = await apiFetch<
    ApiResult & {
      trades?: Array<Omit<ShameTrade, "screenshots"> & { screenshots: string }>
    }
  >("shame_trades")

  if (!result.valid) throw accessError(result)

  return (result.trades || []).map((trade) => ({
    ...trade,
    id: String(trade.id),
    title: normalizeDashes(trade.title),
    manager: normalizeDashes(trade.manager),
    client: normalizeDashes(trade.client),
    dealAmount: normalizeDashes(trade.dealAmount),
    date: normalizeDashes(trade.date),
    textContent: normalizeDashes(trade.textContent),
    screenshots: trade.screenshots
      ? String(trade.screenshots)
          .split(",")
          .map((url) => url.trim())
          .filter(Boolean)
      : [],
  }))
}

export async function fetchPublicShameTrades(): Promise<ShameTrade[]> {
  if (isDevMock()) return []

  const result = await apiFetch<
    ApiResult & {
      trades?: Array<Omit<ShameTrade, "screenshots"> & { screenshots: string }>
    }
  >("public_shame_trades", {}, false)

  if (!result.valid) {
    throw new Error(result.message || "Не удалось загрузить разборы")
  }

  return (result.trades || []).map((trade) => ({
    ...trade,
    title: normalizeDashes(trade.title),
    manager: normalizeDashes(trade.manager),
    client: normalizeDashes(trade.client),
    dealAmount: normalizeDashes(trade.dealAmount),
    date: normalizeDashes(trade.date),
    textContent: normalizeDashes(trade.textContent),
    screenshots: String(trade.screenshots || "")
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean),
  }))
}
