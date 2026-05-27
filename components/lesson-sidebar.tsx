"use client"

import { useState } from "react"
import { ChevronDown, PlayCircle, CheckCircle2, Lock, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface Lesson {
  id: string
  title: string
  completed: boolean
  locked?: boolean
}

interface Module {
  id: string
  title: string
  lessons: Lesson[]
}

interface LessonSidebarProps {
  modules: Module[]
  currentLessonId: string
  onSelectLesson: (moduleId: string, lessonId: string) => void
  isOpen: boolean
  onClose: () => void
}

export function LessonSidebar({
  modules,
  currentLessonId,
  onSelectLesson,
  isOpen,
  onClose,
}: LessonSidebarProps) {
  const [expandedModules, setExpandedModules] = useState<string[]>([modules[0]?.id || ""])

  const toggleModule = (moduleId: string) => {
    setExpandedModules((prev) =>
      prev.includes(moduleId)
        ? prev.filter((id) => id !== moduleId)
        : [...prev, moduleId]
    )
  }

  const handleLessonClick = (moduleId: string, lessonId: string) => {
    onSelectLesson(moduleId, lessonId)
    // Auto-close sidebar on mobile
    if (window.innerWidth < 1024) {
      onClose()
    }
  }

  return (
    <>
      {/* Backdrop for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-background/85 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          "bg-sidebar border-sidebar-border h-full shrink-0 transition-all duration-300 ease-in-out flex flex-col",
          "fixed inset-y-0 left-0 z-50 w-80 border-r lg:relative lg:translate-x-0 lg:z-0",
          isOpen ? "translate-x-0 opacity-100" : "-translate-x-full lg:w-0 lg:border-r-0 lg:-translate-x-0 lg:opacity-0"
        )}
      >
        <div className="p-4 border-b border-sidebar-border flex items-center justify-between shrink-0">
          <div>
            <h2 className="font-semibold text-sidebar-foreground">Содержание курса</h2>
            <p className="text-sm text-muted-foreground mt-1">
              {modules.reduce((acc, m) => acc + m.lessons.length, 0)} уроков
            </p>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-2 hover:bg-sidebar-accent rounded-xl text-muted-foreground hover:text-sidebar-foreground transition-colors cursor-pointer"
            aria-label="Закрыть меню"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="p-2 flex-1 overflow-y-auto">
          {modules.map((module, moduleIndex) => (
            <div key={module.id} className="mb-2">
              <button
                onClick={() => toggleModule(module.id)}
                className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-sidebar-accent transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  <span className="flex items-center justify-center w-6 h-6 rounded bg-secondary text-xs font-medium text-secondary-foreground">
                    {moduleIndex + 1}
                  </span>
                  <span className="font-medium text-sidebar-foreground text-sm">
                    {module.title}
                  </span>
                </div>
                <ChevronDown
                  className={cn(
                    "w-4 h-4 text-muted-foreground transition-transform",
                    expandedModules.includes(module.id) && "rotate-180"
                  )}
                />
              </button>

              {expandedModules.includes(module.id) && (
                <div className="ml-4 mt-1 space-y-1">
                  {module.lessons.map((lesson) => {
                    const isLocked = lesson.locked === true;
                    return (
                      <button
                        key={lesson.id}
                        onClick={() => !isLocked && handleLessonClick(module.id, lesson.id)}
                        disabled={isLocked}
                        className={cn(
                          "w-full flex items-center gap-3 p-2.5 rounded-lg text-left transition-colors",
                          currentLessonId === lesson.id
                            ? "bg-sidebar-accent"
                            : "hover:bg-sidebar-accent/50",
                          isLocked && "opacity-50 cursor-not-allowed"
                        )}
                      >
                        {isLocked ? (
                          <Lock className="w-4 h-4 text-muted-foreground shrink-0" />
                        ) : lesson.completed ? (
                          <CheckCircle2 className="w-4 h-4 text-accent shrink-0" />
                        ) : (
                          <PlayCircle
                            className={cn(
                              "w-4 h-4 shrink-0",
                              currentLessonId === lesson.id
                                ? "text-accent"
                                : "text-muted-foreground"
                            )}
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <p
                            className={cn(
                              "text-sm truncate",
                              currentLessonId === lesson.id
                                ? "text-sidebar-foreground"
                                : "text-muted-foreground"
                            )}
                          >
                            {lesson.title}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </nav>
      </aside>
    </>
  )
}
