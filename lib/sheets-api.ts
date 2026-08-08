/**
 * Клиент закрытого Google Apps Script API для статического GitHub Pages.
 * Платные материалы не входят в сборку: Apps Script отдаёт их только после
 * проверки короткоживущего подписанного токена и текущего статуса доступа.
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

export interface TelegramProfile {
  id: number
  first_name: string
  last_name?: string
  username?: string
  photo_url?: string
}

export interface TelegramUser extends TelegramProfile {
  auth_date: number
  hash: string
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

export interface AuthSession {
  authenticated: boolean
  telegramUser: TelegramProfile | null
  completedLessons: string[]
}

export interface PaidAuthSession {
  authenticated: boolean
  paidAccess: boolean
  telegramUser: TelegramProfile | null
  completedLessons: string[]
}

interface ApiResult {
  valid?: boolean
  error?: string
  message?: string
  session_token?: string
}

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

async function apiFetch<T extends ApiResult>(
  action: string,
  payload: Record<string, unknown> = {},
  includeSession = true,
): Promise<T> {
  if (!APPS_SCRIPT_URL || APPS_SCRIPT_URL.includes("YOUR_SCRIPT_ID")) {
    throw new Error("API курса не настроен")
  }

  const sessionToken = includeSession ? getSessionToken() : ""
  const controller = new AbortController()
  const timeout = window.setTimeout(() => controller.abort(), 12_000)

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

function accessError(result: ApiResult): Error {
  if (["session_invalid", "session_expired", "access_inactive"].includes(result.error || "")) {
    clearSessionToken()
  }
  return new Error(result.message || "Доступ истёк или был отозван")
}

export async function getAuthSession(): Promise<AuthSession> {
  if (!getSessionToken()) {
    return { authenticated: false, telegramUser: null, completedLessons: [] }
  }

  try {
    const result = await apiFetch<
      ApiResult & {
        completed_lessons?: string
        telegram_user?: TelegramProfile
      }
    >("session")

    if (!result.valid) {
      clearSessionToken()
      return { authenticated: false, telegramUser: null, completedLessons: [] }
    }

    return {
      authenticated: true,
      telegramUser: result.telegram_user || null,
      completedLessons: parseProgress(result.completed_lessons),
    }
  } catch {
    clearSessionToken()
    return { authenticated: false, telegramUser: null, completedLessons: [] }
  }
}

export async function getPaidAuthSession(): Promise<PaidAuthSession> {
  if (!getSessionToken()) {
    return {
      authenticated: false,
      paidAccess: false,
      telegramUser: null,
      completedLessons: [],
    }
  }

  try {
    const result = await apiFetch<
      ApiResult & {
        paid_access?: boolean
        paid_completed_lessons?: string
        telegram_user?: TelegramProfile
      }
    >("paid_session")

    if (!result.valid) {
      clearSessionToken()
      return {
        authenticated: false,
        paidAccess: false,
        telegramUser: null,
        completedLessons: [],
      }
    }

    return {
      authenticated: true,
      paidAccess: result.paid_access === true,
      telegramUser: result.telegram_user || null,
      completedLessons: parseProgress(result.paid_completed_lessons),
    }
  } catch {
    clearSessionToken()
    return {
      authenticated: false,
      paidAccess: false,
      telegramUser: null,
      completedLessons: [],
    }
  }
}

export async function loginWithTelegram(
  user: TelegramUser,
): Promise<{ valid: boolean; needsCode?: boolean; error?: string }> {
  try {
    const result = await apiFetch<ApiResult>("telegram_login", { ...user }, false)

    if (result.valid && result.session_token) {
      saveSessionToken(result.session_token)
      return { valid: true }
    }

    if (result.error === "not_bound") {
      return { valid: false, needsCode: true, error: "not_bound" }
    }

    return { valid: false, error: result.message || "Доступ неактивен" }
  } catch (error) {
    return { valid: false, error: (error as Error).message }
  }
}

export async function bindTelegramToCode(
  code: string,
  user: TelegramUser,
): Promise<{ valid: boolean; error?: string }> {
  try {
    const result = await apiFetch<ApiResult>(
      "telegram_bind",
      { ...user, code },
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
  } catch (error) {
    return { valid: false, error: (error as Error).message }
  }
}

export async function logout(): Promise<void> {
  clearSessionToken()
}

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
    title: module.name,
    lessons: sheetLessons
      .filter((lesson) => String(lesson.moduleId) === String(module.id))
      .map((lesson) => ({
        id: `lesson-${lesson.id}`,
        moduleId: String(lesson.moduleId),
        title: lesson.title,
        textContent: lesson.textContent,
        videoUrl: lesson.videoUrl,
      })),
  }))

  return { name: result.name || "Академия: Полный курс", modules }
}

export async function fetchPublicCourseData(): Promise<CourseData> {
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
    title: module.name,
    lessons: sheetLessons
      .filter((lesson) => String(lesson.moduleId) === String(module.id))
      .map((lesson) => ({
        id: `lesson-${lesson.id}`,
        moduleId: String(lesson.moduleId),
        title: lesson.title,
        textContent: lesson.textContent,
        videoUrl: lesson.videoUrl,
      })),
  }))

  return { name: result.name || "NWO: Бесплатная база продаж", modules }
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
    title: module.name,
    lessons: sheetLessons
      .filter((lesson) => String(lesson.moduleId) === String(module.id))
      .map((lesson) => ({
        id: `lesson-${lesson.id}`,
        moduleId: String(lesson.moduleId),
        title: lesson.title,
        textContent: lesson.textContent,
        videoUrl: lesson.videoUrl,
      })),
  }))

  return {
    course: { name: result.name || "NWO: Платное обучение", modules },
    completedLessons: parseProgress(result.completed_lessons),
  }
}

export async function saveProgress(completedLessons: string[]): Promise<void> {
  const result = await apiFetch<ApiResult>("save_progress", {
    completed_lessons: completedLessons.join(","),
  })
  if (!result.valid) throw accessError(result)
}

export async function savePaidProgress(completedLessons: string[]): Promise<void> {
  const result = await apiFetch<ApiResult>("save_paid_progress", {
    completed_lessons: completedLessons.join(","),
  })
  if (!result.valid) throw accessError(result)
}

export async function fetchShameTrades(): Promise<ShameTrade[]> {
  const result = await apiFetch<
    ApiResult & {
      trades?: Array<Omit<ShameTrade, "screenshots"> & { screenshots: string }>
    }
  >("shame_trades")

  if (!result.valid) throw accessError(result)

  return (result.trades || []).map((trade) => ({
    ...trade,
    id: String(trade.id),
    screenshots: trade.screenshots
      ? String(trade.screenshots)
          .split(",")
          .map((url) => url.trim())
          .filter(Boolean)
      : [],
  }))
}

export async function fetchPublicShameTrades(): Promise<ShameTrade[]> {
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
    screenshots: String(trade.screenshots || "")
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean),
  }))
}
