"use client"

import { useState, useEffect } from "react"
import { ChevronDown, PlayCircle, CheckCircle2, Lock, X, ShieldAlert } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "motion/react"
import type { Variants } from "motion/react"

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
  isWallOfShameActive?: boolean
  onSelectWallOfShame?: () => void
}

const sidebarVariants: Variants = {
  open: (height = 1000) => ({
    width: 320,
    clipPath: `circle(${height * 2 + 200}px at 40px 40px)`,
    opacity: 1,
    borderRightWidth: "1px",
    pointerEvents: "auto" as const,
    transition: {
      type: "spring",
      stiffness: 80,
      damping: 15,
      restDelta: 2,
      delayChildren: 0.1,
      staggerChildren: 0.05,
    },
  }),
  closed: {
    width: 0,
    clipPath: "circle(0px at 40px 40px)",
    opacity: 0,
    borderRightWidth: "0px",
    pointerEvents: "none" as const,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 40,
      staggerChildren: 0.03,
      staggerDirection: -1,
    },
  },
}

const itemVariants: Variants = {
  open: {
    y: 0,
    opacity: 1,
    transition: {
      y: { stiffness: 1000, velocity: -100 },
    },
  },
  closed: {
    y: 20,
    opacity: 0,
    transition: {
      y: { stiffness: 1000 },
    },
  },
}

const accordionVariants: Variants = {
  expanded: {
    opacity: 1,
    height: "auto",
    transition: {
      height: { duration: 0.25, ease: "easeOut" },
      opacity: { duration: 0.2, delay: 0.05 },
    },
  },
  collapsed: {
    opacity: 0,
    height: 0,
    transition: {
      height: { duration: 0.2, ease: "easeIn" },
      opacity: { duration: 0.15 },
    },
  },
}

export function LessonSidebar({
  modules,
  currentLessonId,
  onSelectLesson,
  isOpen,
  onClose,
  isWallOfShameActive = false,
  onSelectWallOfShame,
}: LessonSidebarProps) {
  const [expandedModules, setExpandedModules] = useState<string[]>([modules[0]?.id || ""])
  const [windowHeight, setWindowHeight] = useState(1000)

  // Track window size for circle clipPath radius fallback
  useEffect(() => {
    setWindowHeight(window.innerHeight)
    const handleResize = () => setWindowHeight(window.innerHeight)
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

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
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/85 backdrop-blur-sm z-40 lg:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={false}
        animate={isOpen ? "open" : "closed"}
        custom={windowHeight}
        variants={sidebarVariants}
        className={cn(
          "bg-sidebar border-sidebar-border h-full shrink-0 flex flex-col overflow-hidden",
          "fixed inset-y-0 left-0 z-50 border-r lg:relative lg:translate-x-0 lg:z-0"
        )}
      >
        <motion.div 
          variants={itemVariants} 
          className="p-4 border-b border-sidebar-border flex items-center justify-between shrink-0"
        >
          <div>
            <h2 className="font-semibold text-sidebar-foreground">Содержание курса</h2>
            <p className="text-sm text-muted-foreground mt-1">
              {modules.reduce((acc, m) => acc + m.lessons.length, 0)} уроков
            </p>
          </div>
          <motion.button
            onClick={onClose}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="lg:hidden p-2 hover:bg-sidebar-accent rounded-xl text-muted-foreground hover:text-sidebar-foreground transition-colors cursor-pointer"
            aria-label="Закрыть меню"
          >
            <X className="w-5 h-5" />
          </motion.button>
        </motion.div>

        <nav className="p-2 flex-1 overflow-y-auto space-y-2">
          {/* Wall of Shame Section */}
          {onSelectWallOfShame && (
            <motion.div variants={itemVariants} className="mb-2">
              <motion.button
                onClick={() => {
                  onSelectWallOfShame()
                  if (window.innerWidth < 1024) {
                    onClose()
                  }
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  "w-full flex items-center justify-between p-3 rounded-lg border transition-all text-left cursor-pointer",
                  isWallOfShameActive
                    ? "bg-red-50/70 border-red-200/60 text-red-600 shadow-sm"
                    : "border-transparent hover:bg-sidebar-accent/50 text-sidebar-foreground"
                )}
              >
                <div className="flex items-center gap-3">
                  <span className={cn(
                    "flex items-center justify-center w-6 h-6 rounded text-xs font-semibold transition-colors",
                    isWallOfShameActive
                      ? "bg-red-200/80 text-red-700"
                      : "bg-red-50 text-red-500"
                  )}>
                    <ShieldAlert className="w-4 h-4" />
                  </span>
                  <span className="font-semibold text-sm">
                    Стена позора
                  </span>
                </div>
              </motion.button>
            </motion.div>
          )}

          {modules.map((module, moduleIndex) => (
            <motion.div key={module.id} variants={itemVariants} className="mb-2">
              <motion.button
                onClick={() => toggleModule(module.id)}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-sidebar-accent transition-colors text-left cursor-pointer"
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
              </motion.button>

              <AnimatePresence initial={false}>
                {expandedModules.includes(module.id) && (
                  <motion.div
                    initial="collapsed"
                    animate="expanded"
                    exit="collapsed"
                    variants={accordionVariants}
                    className="ml-4 mt-1 space-y-1 overflow-hidden"
                  >
                    {module.lessons.map((lesson) => {
                      const isLocked = lesson.locked === true
                      return (
                        <motion.button
                          key={lesson.id}
                          onClick={() => !isLocked && handleLessonClick(module.id, lesson.id)}
                          disabled={isLocked}
                          whileHover={isLocked ? {} : { x: 4 }}
                          transition={{ type: "spring", stiffness: 300, damping: 20 }}
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
                                  ? "text-sidebar-foreground font-medium"
                                  : "text-muted-foreground"
                              )}
                            >
                              {lesson.title}
                            </p>
                          </div>
                        </motion.button>
                      )
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </nav>

        <motion.div 
          variants={itemVariants}
          className="p-3 border-t border-sidebar-border mt-auto shrink-0 flex items-center justify-between text-[11px] text-muted-foreground bg-sidebar-accent/15"
        >
          <span>Закрытый клуб NWO</span>
          <a
            href="https://t.me/c0lddev"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-accent font-semibold transition-colors cursor-pointer"
          >
            <span>Сделано @c0lddev</span>
          </a>
        </motion.div>
      </motion.aside>
    </>
  )
}
