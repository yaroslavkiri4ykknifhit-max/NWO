"use client"

import { useState, useEffect } from "react"
import { AccessForm } from "@/components/access-form"
import { LessonSidebar } from "@/components/lesson-sidebar"
import { LessonViewer } from "@/components/lesson-viewer"
import { CourseHeader } from "@/components/course-header"
import { Dashboard } from "@/components/dashboard"
import { WallOfShame } from "@/components/wall-of-shame"
import { fetchCourseData, CourseData, clearCache, TelegramUser, saveProgressToGoogleSheets, ShameTrade, fetchShameTrades } from "@/lib/sheets-api"
import { Loader2 } from "lucide-react"

export default function Home() {
  const [hasAccess, setHasAccess] = useState<boolean | null>(null) // null = проверяем при загрузке
  const [courseData, setCourseData] = useState<CourseData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [currentModuleId, setCurrentModuleId] = useState("")
  const [currentLessonId, setCurrentLessonId] = useState("")
  const [completedLessons, setCompletedLessons] = useState<string[]>([])
  const [telegramUser, setTelegramUser] = useState<TelegramUser | null>(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isWallOfShameActive, setIsWallOfShameActive] = useState(false)
  const [shameTrades, setShameTrades] = useState<ShameTrade[]>([])
  const [shameLoading, setShameLoading] = useState(false)

  // Инициализация адаптивного состояния боковой панели (открыта на ПК, закрыта на телефонах)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(true)
      } else {
        setIsSidebarOpen(false)
      }
    }
    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // 1. Проверяем сохраненный код доступа при загрузке страницы
  useEffect(() => {
    const savedCode = localStorage.getItem("nwo_access_code")
    const savedUser = localStorage.getItem("nwo_telegram_user")
    if (savedUser) {
      try {
        setTelegramUser(JSON.parse(savedUser))
      } catch (e) {
        console.error(e)
      }
    }
    if (savedCode) {
      setHasAccess(true)
    } else {
      setHasAccess(false)
    }
  }, [])

  // 2. Если есть доступ, загружаем данные курса и разборов сделок
  useEffect(() => {
    if (hasAccess === true) {
      loadCourseData()
      loadShameTrades()
    }
  }, [hasAccess])

  // 3. Загружаем прогресс уроков
  useEffect(() => {
    const savedProgress = localStorage.getItem("nwo_completed_lessons")
    if (savedProgress) {
      try {
        setCompletedLessons(JSON.parse(savedProgress))
      } catch (e) {
        console.error(e)
      }
    }
  }, [])

  const loadCourseData = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchCourseData()
      setCourseData(data)

      // По умолчанию открываем дашборд (текущий урок пустой)
      setCurrentModuleId("")
      setCurrentLessonId("")
      setIsWallOfShameActive(false)
    } catch (err: any) {
      console.error(err)
      setError(err?.message || "Не удалось загрузить материалы курса. Проверьте правильность ссылки в настройках.")
    } finally {
      setLoading(false)
    }
  }

  const loadShameTrades = async () => {
    setShameLoading(true)
    try {
      const data = await fetchShameTrades()
      setShameTrades(data)
    } catch (err) {
      console.error("Ошибка загрузки разборов сделок:", err)
    } finally {
      setShameLoading(false)
    }
  }

  const handleAccessGranted = () => {
    const savedUser = localStorage.getItem("nwo_telegram_user")
    if (savedUser) {
      try {
        setTelegramUser(JSON.parse(savedUser))
      } catch (e) {
        console.error(e)
      }
    }
    setHasAccess(true)
  }

  const handleLogout = () => {
    localStorage.removeItem("nwo_access_code")
    localStorage.removeItem("nwo_telegram_user")
    clearCache()
    setHasAccess(false)
    setTelegramUser(null)
    setCourseData(null)
  }

  const handleSelectLesson = (moduleId: string, lessonId: string) => {
    setIsWallOfShameActive(false)
    setCurrentModuleId(moduleId)
    setCurrentLessonId(lessonId)
  }

  const handleCompleteLesson = () => {
    if (!completedLessons.includes(currentLessonId)) {
      const updated = [...completedLessons, currentLessonId]
      setCompletedLessons(updated)
      localStorage.setItem("nwo_completed_lessons", JSON.stringify(updated))

      // Синхронизируем прогресс в Google Sheets в фоновом режиме
      const savedCode = localStorage.getItem("nwo_access_code")
      if (savedCode && savedCode !== "DEMO1234") {
        saveProgressToGoogleSheets(savedCode, updated)
      }
    }
  }

  const handleNextLesson = () => {
    if (!courseData) return
    const allLessons = courseData.modules.flatMap((m) =>
      m.lessons.map((l) => ({ moduleId: m.id, lesson: l }))
    )
    const currentIndex = allLessons.findIndex(
      (item) => item.lesson.id === currentLessonId
    )
    if (currentIndex < allLessons.length - 1) {
      const next = allLessons[currentIndex + 1]
      setCurrentModuleId(next.moduleId)
      setCurrentLessonId(next.lesson.id)
    }
  }

  // Состояние проверки авторизации при первом запуске
  if (hasAccess === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-10 h-10 text-accent animate-spin" />
      </div>
    )
  }

  if (!hasAccess) {
    return <AccessForm onAccessGranted={handleAccessGranted} />
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-4">
        <Loader2 className="w-10 h-10 text-accent animate-spin" />
        <p className="text-muted-foreground text-sm">Загрузка материалов курса...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-4 p-4 text-center max-w-md mx-auto">
        <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center text-destructive text-2xl mb-2">
          ⚠️
        </div>
        <h2 className="text-xl font-semibold text-foreground">Ошибка загрузки</h2>
        <p className="text-muted-foreground text-sm">{error}</p>
        <div className="flex gap-3 mt-2">
          <button
            onClick={loadCourseData}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium cursor-pointer"
          >
            Повторить
          </button>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors text-sm font-medium cursor-pointer"
          >
            Выйти
          </button>
        </div>
      </div>
    )
  }

  if (!courseData || courseData.modules.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-4 p-4 text-center max-w-md mx-auto">
        <h2 className="text-xl font-semibold text-foreground">Курс пуст</h2>
        <p className="text-muted-foreground text-sm">В таблице пока нет активных модулей или добавленных уроков.</p>
        <button
          onClick={handleLogout}
          className="mt-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/85 transition-colors text-sm font-medium cursor-pointer"
        >
          Выйти
        </button>
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

  const currentModule = courseData.modules.find((m) => m.id === currentModuleId)
  const currentLesson = currentModule?.lessons.find(
    (l) => l.id === currentLessonId
  )

  const allLessons = courseData.modules.flatMap((m) => m.lessons)
  const currentIndex = allLessons.findIndex((l) => l.id === currentLessonId)
  const hasNext = currentIndex < allLessons.length - 1

  const handleStartLearning = () => {
    if (courseData && courseData.modules.length > 0 && courseData.modules[0].lessons.length > 0) {
      setIsWallOfShameActive(false)
      setCurrentModuleId(courseData.modules[0].id)
      setCurrentLessonId(courseData.modules[0].lessons[0].id)
    }
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <CourseHeader 
        courseName={courseData.name} 
        onLogout={handleLogout} 
        telegramUser={telegramUser} 
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        isSidebarOpen={isSidebarOpen}
        onClickLogo={() => {
          setIsWallOfShameActive(false)
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
          isWallOfShameActive={isWallOfShameActive}
          onSelectWallOfShame={() => {
            setIsWallOfShameActive(true)
            setCurrentModuleId("")
            setCurrentLessonId("")
          }}
        />
        {isWallOfShameActive ? (
          <WallOfShame trades={shameTrades} loading={shameLoading} />
        ) : currentLesson && currentModule ? (
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
