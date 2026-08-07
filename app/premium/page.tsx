"use client"

import { useCallback, useEffect, useState } from "react"
import { ArrowLeft, Crown, Loader2, LockKeyhole, LogOut } from "lucide-react"
import { AccessForm } from "@/components/access-form"
import { CourseHeader } from "@/components/course-header"
import { Dashboard } from "@/components/dashboard"
import { LessonSidebar } from "@/components/lesson-sidebar"
import { LessonViewer } from "@/components/lesson-viewer"
import {
  CourseData,
  TelegramProfile,
  fetchPaidCourseData,
  getPaidAuthSession,
  logout,
  savePaidProgress,
} from "@/lib/sheets-api"

type PaidAccessState = "checking" | "login" | "unpaid" | "granted"

export default function PremiumPage() {
  const [accessState, setAccessState] = useState<PaidAccessState>("checking")
  const [telegramUser, setTelegramUser] = useState<TelegramProfile | null>(null)
  const [courseData, setCourseData] = useState<CourseData | null>(null)
  const [completedLessons, setCompletedLessons] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentModuleId, setCurrentModuleId] = useState("")
  const [currentLessonId, setCurrentLessonId] = useState("")
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  useEffect(() => {
    const handleResize = () => setIsSidebarOpen(window.innerWidth >= 1024)
    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const refreshAccess = useCallback(async () => {
    setAccessState("checking")
    const session = await getPaidAuthSession()
    setTelegramUser(session.telegramUser)
    setCompletedLessons(session.completedLessons)

    if (!session.authenticated) {
      setAccessState("login")
    } else if (!session.paidAccess) {
      setAccessState("unpaid")
    } else {
      setAccessState("granted")
    }
  }, [])

  useEffect(() => {
    void refreshAccess()
  }, [refreshAccess])

  const loadCourseData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await fetchPaidCourseData()
      setCourseData(result.course)
      setCompletedLessons(result.completedLessons)
      setCurrentModuleId("")
      setCurrentLessonId("")
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Не удалось загрузить платные материалы",
      )
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (accessState === "granted") void loadCourseData()
  }, [accessState, loadCourseData])

  const handleLogout = async () => {
    await logout()
    setTelegramUser(null)
    setCourseData(null)
    setCompletedLessons([])
    setAccessState("login")
  }

  if (accessState === "checking") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-slate-50">
        <Loader2 className="w-10 h-10 text-amber-500 animate-spin" />
        <p className="text-sm text-slate-500">Проверяем платный доступ...</p>
      </div>
    )
  }

  if (accessState === "login") {
    return <AccessForm onAccessGranted={refreshAccess} />
  }

  if (accessState === "unpaid") {
    const displayName = telegramUser?.username
      ? `@${telegramUser.username}`
      : telegramUser?.first_name || "пользователь"

    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-100 via-amber-50/50 to-purple-50 flex items-center justify-center p-4 sm:p-6">
        <section className="w-full max-w-lg rounded-[32px] border border-amber-200/70 bg-white p-8 sm:p-10 text-center shadow-2xl shadow-slate-900/10">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-xl shadow-amber-500/25 rotate-[-3deg]">
            <LockKeyhole className="w-9 h-9" />
          </div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-amber-100 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-amber-800">
            <Crown className="w-4 h-4" />
            Платное обучение
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold font-serif text-slate-900">
            Доступ пока не подключён
          </h1>
          <p className="mt-4 text-slate-600 leading-relaxed">
            Аккаунт {displayName} успешно подтверждён, но для него ещё не активирован платный курс.
            Бесплатное обучение и весь текущий прогресс остаются доступны.
          </p>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <a
              href="/"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 font-semibold text-white transition-colors hover:bg-slate-800"
            >
              <ArrowLeft className="w-4 h-4" />
              Бесплатный курс
            </a>
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 font-semibold text-slate-700 transition-colors hover:bg-slate-50 cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              Другой аккаунт
            </button>
          </div>
          <p className="mt-6 text-xs text-slate-400">
            После подключения оплаты доступ будет включаться автоматически.
          </p>
        </section>
      </main>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-4">
        <Loader2 className="w-10 h-10 text-amber-500 animate-spin" />
        <p className="text-slate-500 text-sm">Загрузка платного курса...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-4 p-4 text-center">
        <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center text-2xl">⚠️</div>
        <h2 className="text-xl font-semibold text-slate-900">Не удалось открыть платный курс</h2>
        <p className="max-w-md text-sm text-slate-500">{error}</p>
        <div className="flex flex-wrap justify-center gap-3">
          <button
            onClick={loadCourseData}
            className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white cursor-pointer"
          >
            Повторить
          </button>
          <a href="/" className="rounded-xl bg-white border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700">
            Вернуться к бесплатному курсу
          </a>
        </div>
      </div>
    )
  }

  if (!courseData || courseData.modules.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-100 to-amber-50 gap-4 p-4 text-center">
        <div className="w-20 h-20 rounded-3xl bg-amber-100 flex items-center justify-center text-amber-600">
          <Crown className="w-9 h-9" />
        </div>
        <h2 className="text-2xl font-bold font-serif text-slate-900">Платный раздел подключён</h2>
        <p className="max-w-md text-slate-500">
          Доступ работает. Добавьте активные модули и уроки в листы PaidModules и PaidLessons.
        </p>
        <a href="/" className="mt-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white">
          Вернуться к бесплатному курсу
        </a>
      </div>
    )
  }

  const modulesWithCompletion = courseData.modules.map((module) => ({
    ...module,
    lessons: module.lessons.map((lesson) => ({
      ...lesson,
      completed: completedLessons.includes(lesson.id),
    })),
  }))

  const currentModule = courseData.modules.find((module) => module.id === currentModuleId)
  const currentLesson = currentModule?.lessons.find((lesson) => lesson.id === currentLessonId)
  const allLessons = courseData.modules.flatMap((module) => module.lessons)
  const currentIndex = allLessons.findIndex((lesson) => lesson.id === currentLessonId)
  const hasNext = currentIndex >= 0 && currentIndex < allLessons.length - 1

  const handleSelectLesson = (moduleId: string, lessonId: string) => {
    setCurrentModuleId(moduleId)
    setCurrentLessonId(lessonId)
  }

  const handleCompleteLesson = () => {
    if (!completedLessons.includes(currentLessonId)) {
      const updated = [...completedLessons, currentLessonId]
      setCompletedLessons(updated)
      savePaidProgress(updated).catch((saveError) =>
        console.error("Не удалось сохранить платный прогресс", saveError),
      )
    }
  }

  const handleNextLesson = () => {
    if (!hasNext) return
    const nextLesson = allLessons[currentIndex + 1]
    const nextModule = courseData.modules.find((module) =>
      module.lessons.some((lesson) => lesson.id === nextLesson.id),
    )
    if (nextModule) handleSelectLesson(nextModule.id, nextLesson.id)
  }

  const handleStartLearning = () => {
    const firstModule = courseData.modules[0]
    const firstLesson = firstModule?.lessons[0]
    if (firstModule && firstLesson) handleSelectLesson(firstModule.id, firstLesson.id)
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <CourseHeader
        courseName={courseData.name}
        onLogout={handleLogout}
        telegramUser={telegramUser}
        onToggleSidebar={() => setIsSidebarOpen((open) => !open)}
        isSidebarOpen={isSidebarOpen}
        onClickLogo={() => {
          setCurrentModuleId("")
          setCurrentLessonId("")
        }}
        backHref="/"
        backLabel="Бесплатный курс"
      />
      <div className="flex flex-1 overflow-hidden relative">
        <LessonSidebar
          modules={modulesWithCompletion}
          currentLessonId={currentLessonId}
          onSelectLesson={handleSelectLesson}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
        {currentLesson && currentModule ? (
          <LessonViewer
            title={currentLesson.title}
            moduleName={currentModule.title}
            textContent={currentLesson.textContent}
            videoUrl={currentLesson.videoUrl}
            onComplete={handleCompleteLesson}
            isCompleted={completedLessons.includes(currentLessonId)}
            onNext={handleNextLesson}
            hasNext={hasNext}
          />
        ) : (
          <Dashboard
            courseName={courseData.name}
            modulesCount={courseData.modules.length}
            lessonsCount={allLessons.length}
            completedCount={completedLessons.length}
            onStartLearning={handleStartLearning}
            telegramUser={telegramUser}
          />
        )}
      </div>
    </div>
  )
}
