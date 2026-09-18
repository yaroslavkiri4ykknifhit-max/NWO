"use client"

import { GothicHandwrittenLoader } from "@/components/gothic-handwritten-loader"

import { useCallback, useEffect, useState } from "react"
import { ArrowLeft, Crown, Loader2, LockKeyhole, LogOut, ChevronRight } from "lucide-react"
import { AccessForm } from "@/components/access-form"
import { CourseHeader } from "@/components/course-header"
import { LessonSidebar } from "@/components/lesson-sidebar"
import { LessonViewer } from "@/components/lesson-viewer"
import { PremiumDashboard } from "@/components/premium-dashboard"
import Link from "next/link"
import {
  CourseData,
  TelegramProfile,
  fetchPaidCourseData,
  getPaidAuthSession,
  logout,
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
    const minDelay = new Promise((resolve) => setTimeout(resolve, 3600))
    const session = await getPaidAuthSession()
    await minDelay
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
      <GothicHandwrittenLoader />
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
      <main className="min-h-screen flex items-center justify-center p-4 sm:p-6 bg-white font-ui text-[#121212]">
        <section className="w-full max-w-lg border-2 border-black p-8 sm:p-12 text-center bg-[#fafaf9] shadow-sm">
          <div className="mb-6">
            <span 
              className="text-3xl sm:text-4xl text-black block tracking-tight select-none"
              style={{ fontFamily: "'UnifrakturMaguntia', serif" }}
            >
              New Way Out
            </span>
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-gray-500 block mt-1">
              Private Members Only
            </span>
          </div>

          <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center border border-black bg-black text-white">
            <LockKeyhole className="w-6 h-6" />
          </div>

          <h1 className="text-3xl sm:text-4xl font-display font-bold text-black mb-4">
            Доступ пока не подключён
          </h1>

          <p className="text-sm text-gray-700 leading-relaxed font-ui mb-8 max-w-md mx-auto">
            Telegram-аккаунт <strong>{displayName}</strong> подтверждён, но членство в закрытом клубе NWO BLACK ещё не активировано. Вы можете продолжать учиться в бесплатной базе или активировать инвайт-код.
          </p>

          <div className="space-y-3 max-w-xs mx-auto">
            <a
              href="https://t.me/c0lddev"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 bg-black text-white py-3.5 px-6 font-bold text-xs uppercase tracking-widest hover:bg-gray-800 transition-colors"
            >
              <span>Получить доступ ($79)</span>
              <ChevronRight className="w-4 h-4" />
            </a>

            <Link
              href="/free"
              className="w-full inline-flex items-center justify-center gap-2 border border-gray-300 bg-white py-3 px-6 font-semibold text-xs text-gray-800 hover:border-black transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Бесплатная база NWO
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              className="w-full py-2 text-xs font-semibold text-gray-500 hover:text-black transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              Войти с другого аккаунта
            </button>
          </div>
        </section>
      </main>
    )
  }

  if (loading) {
    return (
      <GothicHandwrittenLoader />
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-4 text-center bg-white text-black font-ui">
        <div className="w-14 h-14 border border-black bg-[#fafaf9] flex items-center justify-center text-xl">⚠️</div>
        <h2 className="text-2xl font-display font-bold text-black">Не удалось загрузить NWO BLACK</h2>
        <p className="max-w-md text-xs text-gray-600">{error}</p>
        <div className="flex flex-wrap justify-center gap-3 mt-4">
          <button
            onClick={loadCourseData}
            className="border border-black bg-black text-white px-5 py-2.5 text-xs font-bold uppercase tracking-wider hover:bg-gray-800 cursor-pointer"
          >
            Повторить
          </button>
          <Link href="/free" className="border border-gray-300 bg-white px-5 py-2.5 text-xs font-semibold text-gray-800 hover:border-black">
            В бесплатный курс
          </Link>
        </div>
      </div>
    )
  }

  if (!courseData || courseData.modules.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-4 text-center bg-white text-black font-ui">
        <div className="w-16 h-16 border border-black bg-black text-white flex items-center justify-center">
          <Crown className="w-8 h-8" />
        </div>
        <h2 className="text-3xl font-display font-bold text-black">NWO BLACK подключён</h2>
        <p className="max-w-md text-xs text-gray-600">
          Доступ активен. Наполните листы PaidModules и PaidLessons в таблице Google.
        </p>
        <Link href="/" className="mt-2 border border-black bg-black text-white px-6 py-3 text-xs font-bold uppercase tracking-wider hover:bg-gray-800">
          Вернуться на главную
        </Link>
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
    // В платной версии сохранение происходит в Google Таблицу через API
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
    <div className="h-screen flex flex-col overflow-hidden bg-white text-black font-ui">
      <CourseHeader
        courseName={courseData.name}
        telegramUser={telegramUser}
        onToggleSidebar={() => setIsSidebarOpen((open) => !open)}
        isSidebarOpen={isSidebarOpen}
        onLogout={handleLogout}
        variant="premium"
        backHref="/"
        backLabel="На главную"
        onClickLogo={() => {
          setCurrentModuleId("")
          setCurrentLessonId("")
        }}
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
