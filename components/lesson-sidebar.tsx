"use client"

import { useState, useEffect } from "react"
import { ChevronDown, PlayCircle, CheckCircle2, Lock } from "lucide-react"
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
  variant?: "default" | "premium"
}

const sidebarVariants: Variants = {
  open: (height = 1000) => ({
    width: 320,
    clipPath: `circle(${height * 2 + 200}px at 30px -32px)`,
    opacity: 1,
    borderRightWidth: "1px",
    pointerEvents: "auto" as const,
    transition: {
      type: "spring",
      stiffness: 20,
      restDelta: 2,
      delayChildren: 0.2,
      staggerChildren: 0.07,
    },
  }),
  closed: {
    width: 0,
    clipPath: "circle(0px at 30px -32px)",
    opacity: 0,
    borderRightWidth: "0px",
    pointerEvents: "none" as const,
    transition: {
      delay: 0.2,
      type: "spring",
      stiffness: 400,
      damping: 40,
      staggerChildren: 0.05,
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
    y: 50,
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
  variant = "default",
}: LessonSidebarProps) {
  const isPremium = variant === "premium"
  const [expandedModules, setExpandedModules] = useState<string[]>([modules[0]?.id || ""])
  const [windowHeight, setWindowHeight] = useState(1000)

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
    if (window.innerWidth < 1024) {
      onClose()
    }
  }

  const totalLessons = modules.reduce((acc, m) => acc + m.lessons.length, 0)

  return (
    <>
      {/* Backdrop for mobile */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-x-0 top-16 bottom-0 bg-black/40 backdrop-blur-xs z-40 lg:hidden"
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
          "bg-white border-gray-300 shrink-0 flex flex-col overflow-hidden font-ui",
          "fixed top-16 bottom-0 left-0 z-50 border-r lg:relative lg:top-0 lg:h-full lg:z-0"
        )}
      >
        <motion.div 
          variants={itemVariants} 
          className="p-4 border-b border-gray-200 bg-[#fafaf9] flex items-center justify-between shrink-0"
        >
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 block mb-1">
              Оглавление
            </span>
            <h2 className="font-display text-base font-bold text-black">
              {isPremium ? "Программа NWO BLACK" : "Материалы курса"}
            </h2>
          </div>
          <span className="text-xs font-semibold text-gray-500 border border-gray-200 px-2 py-0.5 bg-white">
            {totalLessons} ур.
          </span>
        </motion.div>

        <nav className="p-3 flex-1 overflow-y-auto space-y-2">
          {modules.map((module, moduleIndex) => (
            <motion.div 
              key={module.id} 
              variants={itemVariants} 
              className="border border-gray-200 bg-white"
            >
              <button
                onClick={() => toggleModule(module.id)}
                className="w-full flex items-center justify-between p-3 text-left cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <span className="flex items-center justify-center w-5 h-5 bg-black text-white text-[10px] font-bold">
                    {moduleIndex + 1}
                  </span>
                  <span className="font-display font-bold text-sm text-black line-clamp-1">
                    {module.title}
                  </span>
                </div>
                <ChevronDown
                  className={cn(
                    "w-4 h-4 text-gray-500 transition-transform shrink-0 ml-2",
                    expandedModules.includes(module.id) && "rotate-180"
                  )}
                />
              </button>

              <AnimatePresence initial={false}>
                {expandedModules.includes(module.id) && (
                  <motion.div
                    initial="collapsed"
                    animate="expanded"
                    exit="collapsed"
                    variants={accordionVariants}
                    className="border-t border-gray-100 bg-[#fafaf9] divide-y divide-gray-100 overflow-hidden"
                  >
                    {module.lessons.map((lesson) => {
                      const isLocked = lesson.locked === true
                      const isSelected = currentLessonId === lesson.id

                      return (
                        <motion.button
                          key={lesson.id}
                          onClick={() => !isLocked && handleLessonClick(module.id, lesson.id)}
                          disabled={isLocked}
                          whileHover={isLocked ? {} : { x: 2 }}
                          transition={{ type: "spring", stiffness: 400, damping: 25 }}
                          className={cn(
                            "w-full flex items-center gap-2.5 px-3 py-2.5 text-left text-xs transition-colors cursor-pointer",
                            isSelected
                              ? "bg-black text-white font-medium"
                              : "text-gray-700 hover:bg-gray-100/80 hover:text-black",
                            isLocked && "opacity-45 cursor-not-allowed"
                          )}
                        >
                          {isLocked ? (
                            <Lock className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                          ) : lesson.completed ? (
                            <CheckCircle2 className={cn("w-3.5 h-3.5 shrink-0", isSelected ? "text-white" : "text-black")} />
                          ) : (
                            <PlayCircle
                              className={cn(
                                "w-3.5 h-3.5 shrink-0",
                                isSelected ? "text-white" : "text-gray-400"
                              )}
                            />
                          )}
                          <span className="truncate flex-1">
                            {lesson.title}
                          </span>
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
          className="p-3 border-t border-gray-300 mt-auto shrink-0 flex items-center justify-between text-[10px] uppercase font-bold tracking-wider text-gray-500 bg-[#fafaf9]"
        >
          <span>{isPremium ? "NWO BLACK" : "NWO FREE"}</span>
          <a
            href="https://t.me/c0lddev"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-black transition-colors"
          >
            Поддержка: @c0lddev
          </a>
        </motion.div>
      </motion.aside>
    </>
  )
}
