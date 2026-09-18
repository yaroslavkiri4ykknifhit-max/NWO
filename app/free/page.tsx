"use client"

import { GothicHandwrittenLoader } from "@/components/gothic-handwritten-loader"

import { useEffect, useState } from "react"
import { Loader2 } from "lucide-react"
import { CourseHeader } from "@/components/course-header"
import { Dashboard } from "@/components/dashboard"
import { LessonSidebar } from "@/components/lesson-sidebar"
import { LessonViewer } from "@/components/lesson-viewer"
import {
  CourseData,
  fetchPublicCourseData,
  getLocalFreeProgress,
  saveLocalFreeProgress,
} from "@/lib/sheets-api"

export default function FreeCoursePage() {
  const [courseData, setCourseData] = useState<CourseData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentModuleId, setCurrentModuleId] = useState("")
  const [currentLessonId, setCurrentLessonId] = useState("")
  const [completedLessons, setCompletedLessons] = useState<string[]>([])
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  useEffect(() => {
    setCompletedLessons(getLocalFreeProgress())

    const handleResize = () => setIsSidebarOpen(window.innerWidth >= 1024)
    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const loadCourseData = async () => {
    setLoading(true)
    setError(null)
    const minDelay = new Promise((resolve) => setTimeout(resolve, 3600))
    try {
      const [data] = await Promise.all([fetchPublicCourseData(), minDelay])
      setCourseData(data)
      setCurrentModuleId("")
      setCurrentLessonId("")
    } catch (loadError) {
      await minDelay
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Не удалось загрузить бесплатный курс",
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadCourseData()
  }, [])

  if (loading) {
    return (
      <GothicHandwrittenLoader />
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white gap-4 p-4 text-center">
        <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center text-2xl">⚠️</div>
        <h1 className="text-xl font-semibold text-black">Курс временно недоступен</h1>
        <p className="max-w-md text-sm text-muted-foreground">{error}</p>
        <div className="flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={loadCourseData}
            className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground cursor-pointer"
          >
            Повторить
          </button>
          <a href="/" className="rounded-xl bg-secondary px-5 py-2.5 text-sm font-semibold text-secondary-foreground">
            На главную
          </a>
        </div>
      </div>
    )
  }

  if (!courseData || courseData.modules.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white gap-4 p-4 text-center">
        <h1 className="text-2xl font-semibold text-black">Бесплатный курс готов</h1>
        <p className="max-w-md text-sm text-muted-foreground">
          Добавьте активные модули и уроки в листы Modules и Lessons.
        </p>
        <a href="/" className="rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground">
          Вернуться на лендинг
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
      saveLocalFreeProgress(updated)
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
        onToggleSidebar={() => setIsSidebarOpen((open) => !open)}
        isSidebarOpen={isSidebarOpen}
        showUser={false}
        backHref="/"
        backLabel="На лендинг"
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
            premiumHref="/premium/"
          />
        )}
      </div>
    </div>
  )
}
