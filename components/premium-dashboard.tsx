"use client"

import {
  BadgeCheck,
  CheckCircle2,
  Crown,
  Flame,
  Layers3,
  Play,
  ShieldCheck,
  Trophy,
} from "lucide-react"
import { CourseModule, UserProfile } from "@/lib/sheets-api"

interface PremiumDashboardProps {
  courseName: string
  modules: CourseModule[]
  completedLessons: string[]
  onStartLearning: () => void
  user?: UserProfile | null
}

export function PremiumDashboard({
  courseName,
  modules,
  completedLessons,
  onStartLearning,
  user,
}: PremiumDashboardProps) {
  const lessonsCount = modules.reduce((total, module) => total + module.lessons.length, 0)
  const progressPercent = lessonsCount
    ? Math.min(100, Math.round((completedLessons.length / lessonsCount) * 100))
    : 0
  const displayName = user?.display_name || user?.email || "Студент"

  return (
    <main className="flex-1 overflow-y-auto bg-white font-ui text-[#121212]">
      <div className="mx-auto w-full max-w-7xl px-5 py-8 sm:px-8 sm:py-12 lg:px-12">
        
        {/* Header Section */}
        <section className="grid items-start gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:gap-14 border-b border-gray-300 pb-16">
          <div>
            <div className="mb-6 flex items-center gap-2 border border-black bg-black px-3 py-1 text-[10px] font-bold uppercase tracking-[0.25em] text-white w-fit">
              <Crown className="h-3 w-3" />
              NWO BLACK · ЗАКРЫТЫЙ КЛУБ
            </div>
            
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-gray-500">
              Личный кабинет участника: {displayName}
            </p>

            <h1 className="mb-6 text-5xl sm:text-7xl font-display font-bold text-black tracking-tight leading-[1.05]">
              Мастерство сложных продаж
            </h1>

            <p className="mb-8 max-w-xl text-lg sm:text-xl leading-relaxed text-gray-700 font-display">
              Ты внутри закрытой экосистемы NWO BLACK. Здесь нет абстрактной теории — только инструменты боевых продаж, психологические скрипты для высоких чеков и алгоритмы дожима сделок.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={onStartLearning}
                className="inline-flex items-center gap-3 bg-black hover:bg-gray-800 text-white px-8 py-4 font-bold uppercase tracking-widest text-xs transition-colors cursor-pointer"
              >
                <Play className="h-3.5 w-3.5 fill-current" />
                <span>Продолжить обучение</span>
              </button>
              
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-500 border border-gray-200 px-4 py-3.5 bg-[#fafaf9]">
                <ShieldCheck className="h-4 w-4 text-black" />
                <span>Лицензия активна</span>
              </div>
            </div>

            <div className="mt-12 grid grid-cols-3 gap-4 border-t border-gray-200 pt-8 max-w-md">
              <div>
                <p className="text-4xl font-display font-bold text-black">{modules.length}</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mt-1">Модулей</p>
              </div>
              <div>
                <p className="text-4xl font-display font-bold text-black">{lessonsCount}</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mt-1">Уроков</p>
              </div>
              <div>
                <p className="text-4xl font-display font-bold text-black">{completedLessons.length}</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mt-1">Завершено</p>
              </div>
            </div>
          </div>

          {/* Membership Editorial Certificate */}
          <div className="border-2 border-black p-6 sm:p-8 bg-[#fafaf9] shadow-sm">
            <div className="border-b border-gray-300 pb-6 mb-6 flex items-start justify-between">
              <div>
                <span 
                  className="text-2xl text-black block tracking-tight select-none"
                  style={{ fontFamily: "'UnifrakturMaguntia', serif" }}
                >
                  New Way Out
                </span>
                <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-gray-500 block">
                  Black Membership Card
                </span>
              </div>
              <div className="w-10 h-10 border border-black bg-black text-white flex items-center justify-center">
                <Crown className="w-5 h-5" />
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-xs font-bold uppercase tracking-widest mb-2">
                  <span className="text-gray-500">Общий прогресс</span>
                  <span className="text-black">{progressPercent}%</span>
                </div>
                <div className="h-2 w-full bg-gray-200 overflow-hidden">
                  <div
                    className="h-full bg-black transition-all duration-700 ease-out"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              <div className="border border-gray-200 bg-white p-4 space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-500 uppercase font-semibold">Владелец:</span>
                  <span className="font-bold text-black">{displayName}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-500 uppercase font-semibold">Статус:</span>
                  <span className="inline-flex items-center gap-1 font-bold text-black">
                    <BadgeCheck className="w-3.5 h-3.5" /> Подтвержден
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-500 uppercase font-semibold">Доступ:</span>
                  <span className="font-bold text-black">Полный (без ограничений)</span>
                </div>
              </div>

              <div className="text-[11px] text-gray-500 leading-relaxed italic border-l-2 border-black pl-3 py-0.5">
                «Материалы предназначены исключительно для личного использования участником клуба.»
              </div>
            </div>
          </div>
        </section>

        {/* Modules Roadmap */}
        <section className="mt-16">
          <div className="mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-black pb-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-gray-500 block mb-1">
                Учебный план
              </span>
              <h2 className="text-3xl sm:text-4xl font-display font-bold text-black">
                Структура программы NWO BLACK
              </h2>
            </div>
            <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider">
              {modules.length} тематических блоков
            </span>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {modules.map((module, i) => {
              const moduleLessonsCount = module.lessons.length
              const moduleCompletedCount = module.lessons.filter((l) => completedLessons.includes(l.id)).length
              const isCompleted = moduleCompletedCount === moduleLessonsCount && moduleLessonsCount > 0
              const isActive = moduleCompletedCount > 0 && !isCompleted

              return (
                <div
                  key={module.id}
                  className="border border-gray-300 p-6 sm:p-8 bg-white hover:border-black transition-colors flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-3 mb-4">
                      <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">
                        Модуль {String(i + 1).padStart(2, "0")}
                      </span>
                      {isCompleted && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-black bg-gray-100 px-2 py-0.5 border border-gray-200">
                          <CheckCircle2 className="h-3 w-3" /> Пройден
                        </span>
                      )}
                      {isActive && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-white bg-black px-2 py-0.5">
                          <Flame className="h-3 w-3" /> В процессе
                        </span>
                      )}
                    </div>

                    <h3 className="text-2xl font-display font-bold text-black leading-tight mb-3">
                      {module.title}
                    </h3>
                  </div>

                  <div className="mt-8 pt-4 border-t border-gray-100 flex items-center justify-between text-xs font-bold uppercase tracking-widest text-gray-500">
                    <div className="flex items-center gap-1.5">
                      <Layers3 className="h-3.5 w-3.5" />
                      <span>{moduleLessonsCount} уроков</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Trophy className="h-3.5 w-3.5" />
                      <span>{moduleCompletedCount} закрыто</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

      </div>
    </main>
  )
}
