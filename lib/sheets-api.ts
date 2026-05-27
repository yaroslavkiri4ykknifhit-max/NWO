/**
 * API-клиент для взаимодействия с Google Apps Script (веб-приложение).
 * Все данные курса загружаются из Google Sheets через этот модуль.
 */

const APPS_SCRIPT_URL = process.env.NEXT_PUBLIC_APPS_SCRIPT_URL || '';

// ── Типы ────────────────────────────────────────────────────────────────

export interface SheetModule {
  id: string;
  name: string;
  status: string;
}

export interface SheetLesson {
  id: string;
  moduleId: string;
  title: string;
  textContent: string;
  videoUrl: string;
}

export interface CourseModule {
  id: string;
  title: string;
  lessons: CourseLesson[];
}

export interface CourseLesson {
  id: string;
  moduleId: string;
  title: string;
  textContent: string;
  videoUrl: string;
}

export interface CourseData {
  name: string;
  modules: CourseModule[];
}

export interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date: number;
  hash: string;
}

// ── Кэш ─────────────────────────────────────────────────────────────────

let cachedCourseData: CourseData | null = null;
let cacheTimestamp = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 минут

function isCacheValid(): boolean {
  return cachedCourseData !== null && Date.now() - cacheTimestamp < CACHE_TTL;
}

export function clearCache(): void {
  cachedCourseData = null;
  cacheTimestamp = 0;
}

// ── API-запросы ─────────────────────────────────────────────────────────

async function apiFetch<T>(action: string, params: Record<string, string> = {}): Promise<T> {
  if (!APPS_SCRIPT_URL || APPS_SCRIPT_URL.includes('YOUR_SCRIPT_ID')) {
    throw new Error('NEXT_PUBLIC_APPS_SCRIPT_URL не настроен. Настройте Google Таблицу по инструкции.');
  }

  const url = new URL(APPS_SCRIPT_URL);
  url.searchParams.set('action', action);
  
  // Добавляем cache-buster параметр с меткой времени, чтобы заставить браузер/webview 
  // всегда запрашивать свежие данные непосредственно из Google Sheets без использования кэша.
  url.searchParams.set('_t', String(Date.now()));

  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(key, value);
  });

  const response = await fetch(url.toString(), {
    method: 'GET',
    redirect: 'follow', // Apps Script делает 302 redirect
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }

  return response.json() as Promise<T>;
}

// ── Демо-данные для локального тестирования ──────────────────────────────

const MOCK_COURSE_DATA: CourseData = {
  name: "Академия NWO (Демо-версия)",
  modules: [
    {
      id: "module-1",
      title: "1. Введение и основы платформы",
      lessons: [
        {
          id: "lesson-1",
          moduleId: "1",
          title: "Добро пожаловать в Академию",
          textContent: "Приветствуем вас на закрытой платформе NWO!\n\nЭто демо-режим, запущенный локально. Наш сайт полностью готов к работе с Google Таблицами.\n\nВ этом уроке мы разберем основные возможности платформы:\n1. Управление контентом из таблицы.\n2. Генерация индивидуальных ключей для студентов.\n3. Быстрое обновление видеоматериалов.\n\nИзучайте материалы и переходите к следующему уроку!",
          videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
        },
        {
          id: "lesson-2",
          moduleId: "1",
          title: "Как устроены Google Таблицы курса",
          textContent: "Ваша таблица состоит из трех вкладок:\n\n1. Modules — определяет порядок и названия учебных модулей.\n2. Lessons — содержит текстовые лекции и встраиваемые ссылки на видеоплееры (YouTube, Vimeo, Rutube).\n3. Invites — список кодов доступа, которые вы выдаете ученикам.\n\nВы можете в любой момент изменить текст или ссылку в таблице, и они обновятся на сайте без перезагрузки кода!",
          videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
        }
      ]
    },
    {
      id: "module-2",
      title: "2. Практические стратегии",
      lessons: [
        {
          id: "lesson-3",
          moduleId: "2",
          title: "Первая сделка и разбор кейсов",
          textContent: "Переходим к практической части.\n\nВ этом уроке подробно описывается первый кейс работы.\nОбязательно посмотрите встроенное видео над этим текстом и выполните домашнее задание.",
          videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
        }
      ]
    }
  ]
};

// ── Публичные функции ───────────────────────────────────────────────────

/**
 * Проверяет код доступа через лист Invites.
 * Также поддерживает локальный демо-код DEMO1234 для быстрого тестирования.
 */
export async function validateAccessCode(code: string): Promise<boolean> {
  const cleanCode = code.trim().toUpperCase();
  
  // Локальный код для быстрого входа без настроенного Google Sheets
  if (cleanCode === 'DEMO1234') {
    return true;
  }

  try {
    const result = await apiFetch<{ valid: boolean; error?: string }>('validate', { code });
    return result.valid === true;
  } catch (error) {
    console.error('Ошибка проверки кода:', error);
    // Если Google Sheets не настроен, но ввели демо-код
    return false;
  }
}

/**
 * Загружает все модули и уроки, собирает в дерево CourseData.
 * Если Google Таблицы еще не подключены, отдает красивый демо-курс.
 */
export async function fetchCourseData(): Promise<CourseData> {
  if (isCacheValid() && cachedCourseData) {
    return cachedCourseData;
  }

  // Если URL скрипта не настроен — отдаем демо-данные, чтобы сайт работал из коробки
  if (!APPS_SCRIPT_URL || APPS_SCRIPT_URL.includes('YOUR_SCRIPT_ID')) {
    console.log('Используются локальные демо-данные (Google Sheets не настроен)');
    return MOCK_COURSE_DATA;
  }

  try {
    const result = await apiFetch<{
      modules: SheetModule[];
      lessons: SheetLesson[];
      error?: string;
    }>('all');

    if (result.error) {
      throw new Error(result.error);
    }

    const modules: CourseModule[] = (result.modules || []).map((mod) => {
      const moduleLessons = (result.lessons || [])
        .filter((lesson) => String(lesson.moduleId) === String(mod.id))
        .map((lesson) => ({
          id: `lesson-${lesson.id}`,
          moduleId: String(lesson.moduleId),
          title: lesson.title,
          textContent: lesson.textContent,
          videoUrl: lesson.videoUrl,
        }));

      return {
        id: `module-${mod.id}`,
        title: mod.name,
        lessons: moduleLessons,
      };
    });

    const courseData: CourseData = {
      name: 'Академия: Полный курс',
      modules,
    };

    cachedCourseData = courseData;
    cacheTimestamp = Date.now();

    return courseData;
  } catch (error) {
    console.warn('Не удалось загрузить данные из Google Sheets, загружаем демо-данные:', error);
    return MOCK_COURSE_DATA;
  }
}

/**
 * Авторизация через Telegram. Отправляет данные пользователя в Google Apps Script для проверки подписи.
 */
export async function loginWithTelegram(user: TelegramUser): Promise<{ valid: boolean; code?: string; completed_lessons?: string; error?: string }> {
  try {
    const params: Record<string, string> = {};
    Object.entries(user).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params[key] = String(value);
      }
    });

    const result = await apiFetch<{ valid: boolean; code?: string; completed_lessons?: string; error?: string }>('telegram_login', params);
    return result;
  } catch (error: any) {
    console.error('Ошибка входа через Telegram:', error);
    return { valid: false, error: error?.message || 'Не удалось связаться с сервером авторизации' };
  }
}

/**
 * Привязка Telegram к инвайт-коду.
 */
export async function bindTelegramToCode(code: string, user: TelegramUser): Promise<{ valid: boolean; error?: string }> {
  try {
    const params: Record<string, string> = { code };
    Object.entries(user).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params[key] = String(value);
      }
    });

    const result = await apiFetch<{ valid: boolean; error?: string }>('telegram_bind', params);
    return result;
  } catch (error: any) {
    console.error('Ошибка привязки инвайт-кода к Telegram:', error);
    return { valid: false, error: error?.message || 'Не удалось связаться с сервером авторизации' };
  }
}

/**
 * Сохраняет список пройденных уроков в Google Sheets.
 */
export async function saveProgressToGoogleSheets(code: string, completedLessons: string[]): Promise<boolean> {
  try {
    const progressString = completedLessons.join(',');
    const result = await apiFetch<{ valid: boolean; error?: string }>('save_progress', {
      code,
      completed_lessons: progressString
    });
    return result.valid === true;
  } catch (error) {
    console.error('Ошибка сохранения прогресса в Google Sheets:', error);
    return false;
  }
}
