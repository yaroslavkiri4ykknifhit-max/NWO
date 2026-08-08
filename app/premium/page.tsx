"use client"

import { useCallback, useEffect, useState } from "react"
import { ArrowLeft, Crown, Loader2, LockKeyhole, LogOut } from "lucide-react"
import { AccessForm } from "@/components/access-form"
import { CourseHeader } from "@/components/course-header"
import { LessonSidebar } from "@/components/lesson-sidebar"
import { LessonViewer } from "@/components/lesson-viewer"
import { PremiumDashboard } from "@/components/premium-dashboard"
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
      <div className="premium-surface min-h-screen flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 text-[#b8ff3d] animate-spin" />
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-white/40">Проверяем NWO BLACK...</p>
      </div>
    )
  }

  if (accessState === "login") {
    return <AccessForm onAccessGranted={refreshAccess} variant="premium" />
  }

  if (accessState === "unpaid") {
    const displayName = telegramUser?.username
      ? `@${telegramUser.username}`
      : telegramUser?.first_name || "пользователь"

    return (
      <main className="premium-surface premium-paywall min-h-screen flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
        <div className="premium-grid absolute inset-0 opacity-40" />
        <section className="premium-paywall-card relative z-10 w-full max-w-lg rounded-[32px] border p-8 sm:p-10 text-center shadow-2xl">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-[#b8ff3d] text-black shadow-[0_0_45px_rgba(184,255,61,0.24)] rotate-[-3deg]">
            <LockKeyhole className="w-9 h-9" />
          </div>
          <div className="premium-kicker mb-5 inline-flex">
            <Crown className="w-4 h-4" />
            NWO BLACK · LOCKED
          </div>
          <h1 className="premium-display text-4xl sm:text-5xl font-black uppercase tracking-[-0.055em] leading-[0.92] text-white">
            Доступ пока не подключён
          </h1>
          <p className="mt-5 text-white/50 leading-relaxed">
            Аккаунт {displayName} успешно подтверждён, но для него ещё не активирован платный курс.
            Бесплатное обучение и весь текущий прогресс остаются доступны.
          </p>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <a
              href="/"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#b8ff3d] px-5 py-3 font-bold text-black transition-all hover:bg-[#c8ff67]"
            >
              <ArrowLeft className="w-4 h-4" />
              Бесплатный курс
            </a>
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-3 font-semibold text-white/60 transition-colors hover:bg-white/10 hover:text-white cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              Другой аккаунт
            </button>
          </div>
          <p className="mt-6 text-xs text-white/25">
            После подключения оплаты доступ будет включаться автоматически.
          </p>
        </section>
      </main>
    )
  }

  if (loading) {
    return (
      <div className="premium-surface min-h-screen flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 text-[#b8ff3d] animate-spin" />
        <p className="text-white/40 text-sm font-semibold uppercase tracking-[0.16em]">Загрузка NWO BLACK...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="premium-surface min-h-screen flex flex-col items-center justify-center gap-4 p-4 text-center">
        <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-2xl">⚠️</div>
        <h2 className="premium-display text-2xl font-black uppercase text-white">Не удалось открыть NWO BLACK</h2>
        <p className="max-w-md text-sm text-white/45">{error}</p>
        <div className="flex flex-wrap justify-center gap-3">
          <button
            onClick={loadCourseData}
            className="rounded-xl bg-[#b8ff3d] px-5 py-2.5 text-sm font-bold text-black cursor-pointer"
          >
            Повторить
          </button>
          <a href="/" className="rounded-xl bg-white/5 border border-white/10 px-5 py-2.5 text-sm font-semibold text-white/60">
            Вернуться к бесплатному курсу
          </a>
        </div>
      </div>
    )
  }

  if (!courseData || courseData.modules.length === 0) {
    return (
      <div className="premium-surface min-h-screen flex flex-col items-center justify-center gap-4 p-4 text-center">
        <div className="w-20 h-20 rounded-3xl bg-[#b8ff3d]/10 border border-[#b8ff3d]/20 flex items-center justify-center text-[#b8ff3d]">
          <Crown className="w-9 h-9" />
        </div>
        <h2 className="premium-display text-3xl font-black uppercase text-white">NWO BLACK подключён</h2>
        <p className="max-w-md text-white/45">
          Доступ работает. Добавьте активные модули и уроки в листы PaidModules и PaidLessons.
        </p>
        <a href="/" className="mt-2 rounded-xl bg-[#b8ff3d] px-5 py-3 text-sm font-bold text-black">
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
    <div className="premium-surface h-screen flex flex-col overflow-hidden">
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
        variant="premium"
      />
      <div className="flex flex-1 overflow-hidden relative">
        <LessonSidebar
          modules={modulesWithCompletion}
          currentLessonId={currentLessonId}
          onSelectLesson={handleSelectLesson}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          variant="premium"
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
            variant="premium"
          />
        ) : (
          <PremiumDashboard
            courseName={courseData.name}
            modules={courseData.modules}
            completedLessons={completedLessons}
            onStartLearning={handleStartLearning}
            telegramUser={telegramUser}
          />
        )}
      </div>
    </div>
  )
}
