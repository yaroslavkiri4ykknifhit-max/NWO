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

function normalizeDashes(value: unknown): string {
  return String(value ?? "").replace(/[—–]/g, "-")
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

  if (isDevMock()) {
    const saved = typeof window !== "undefined"
      ? JSON.parse(sessionStorage.getItem("nwo_dev_paid_progress") || "[]")
      : []
    return {
      authenticated: true,
      paidAccess: true,
      telegramUser: {
        id: 777000,
        first_name: "Ярослав",
        username: "c0lddev",
      },
      completedLessons: Array.isArray(saved) ? saved : [],
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
  if (isDevMock()) {
    saveSessionToken("dev_session_" + Date.now())
    return { valid: true }
  }

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
  if (isDevMock()) {
    saveSessionToken("dev_session_" + Date.now())
    return { valid: true }
  }

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
  if (isDevMock()) {
    const saved = typeof window !== "undefined"
      ? JSON.parse(sessionStorage.getItem("nwo_dev_paid_progress") || "[]")
      : []
    return {
      course: DEMO_PAID_COURSE,
      completedLessons: Array.isArray(saved) ? saved : [],
    }
  }

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
    course: { name: normalizeDashes(result.name || "NWO: Платное обучение"), modules },
    completedLessons: parseProgress(result.completed_lessons),
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
