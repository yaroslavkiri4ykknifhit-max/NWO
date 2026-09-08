"use client"

import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  CheckCircle2,
  Crown,
  Flame,
  Layers3,
  Play,
  ShieldCheck,
  Sparkles,
  Target,
  Trophy,
  Zap,
} from "lucide-react"
import { CourseModule, TelegramProfile } from "@/lib/sheets-api"

interface PremiumDashboardProps {
  courseName: string
  modules: CourseModule[]
  completedLessons: string[]
  onStartLearning: () => void
  telegramUser?: TelegramProfile | null
}

export function PremiumDashboard({
  courseName,
  modules,
  completedLessons,
  onStartLearning,
  telegramUser,
}: PremiumDashboardProps) {
  const lessonsCount = modules.reduce((total, module) => total + module.lessons.length, 0)
  const progressPercent = lessonsCount
    ? Math.min(100, Math.round((completedLessons.length / lessonsCount) * 100))
    : 0
  const displayName = telegramUser?.username
    ? `@${telegramUser.username}`
    : telegramUser?.first_name || "Студент"

  return (
    <main className="flex-1 overflow-y-auto bg-white font-ui text-[#121212] relative">
      <div className="relative z-10 mx-auto w-full max-w-7xl px-5 py-8 sm:px-8 sm:py-12 lg:px-12 lg:py-16">
        
        {/* Header Section */}
        <section className="grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-14 min-h-[50vh] border-b border-gray-200 pb-16">
          <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
            <div className="mb-6 w-fit flex items-center gap-2 border border-gray-200 bg-gray-50 px-3 py-1 text-[11px] font-bold uppercase tracking-widest">
              <Sparkles className="h-3.5 w-3.5" />
              PRIVATE SALES SYSTEM
            </div>
            <p className="mb-4 text-sm font-bold uppercase tracking-[0.2em] text-gray-500">
              Добро пожаловать, {displayName}
            </p>
            <h1 className="mb-6 text-6xl md:text-8xl font-display font-bold uppercase tracking-tight leading-[0.9]">
              ТЫ ВНУТРИ.<br />
              <span className="text-black">ТЕПЕРЬ ПО-КРУПНОМУ.</span>
            </h1>
            <p className="mb-10 max-w-xl text-lg leading-relaxed text-gray-600 font-display">
              Здесь не будет базовых советов. Только система, разборы, механики и инструменты,
              которые превращают продажи из случайности в управляемый результат.
            </p>

            <div className="flex flex-wrap items-center gap-5">
              <button
                onClick={onStartLearning}
                className="inline-flex items-center gap-3 bg-black hover:bg-gray-800 text-white px-8 py-4 font-bold uppercase tracking-widest text-sm transition-all"
              >
                <Play className="h-4 w-4 fill-current" />
                Ворваться в программу
              </button>
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-500">
                <ShieldCheck className="h-4 w-4" />
                Защищённый доступ
              </div>
            </div>

            <div className="mt-12 flex items-center gap-8 border-t border-gray-200 pt-8">
              <div>
                <p className="text-3xl font-display font-bold text-black">{modules.length}</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Модулей</p>
              </div>
              <div>
                <p className="text-3xl font-display font-bold text-black">{lessonsCount}</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Уроков</p>
              </div>
              <div className="hidden sm:block">
                <p className="text-[10px] font-bold uppercase tracking-widest text-black flex items-center gap-1.5 mb-1">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Доступ открыт
                </p>
              </div>
            </div>
          </div>

          {/* Membership Card */}
          <div className="animate-in fade-in slide-in-from-right-8 duration-700 delay-200 hidden lg:block">
            <div className="sticky top-10 w-full sm:w-[420px] shrink-0 border border-gray-200 bg-white shadow-xl p-1 mx-auto">
              <div className="relative h-full border border-gray-100 bg-gray-50 p-8 flex flex-col">
                <div className="mb-12 flex items-start justify-between">
                  <div>
                    <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-500 mb-2">NWO</h3>
                    <p className="font-display text-4xl font-black tracking-wider text-black">BLACK</p>
                  </div>
                  <div className="w-12 h-12 bg-white border border-gray-200 flex items-center justify-center text-black shadow-sm">
                    <Crown className="w-6 h-6" />
                  </div>
                </div>

                <div className="mb-auto">
                  <div className="mb-3 flex items-center justify-between text-[11px] font-bold uppercase tracking-widest">
                    <span className="text-gray-500">Ваш прогресс</span>
                    <span className="text-black">{progressPercent}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-gray-200 overflow-hidden">
                    <div
                      className="h-full bg-black transition-all duration-1000 ease-out"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>

                  <div className="mt-8 grid grid-cols-3 gap-2">
                    <div className="border border-gray-200 bg-white p-3 text-center">
                      <p className="font-display text-xl font-bold text-black">{String(modules.length).padStart(2, "0")}</p>
                      <p className="mt-1 text-[9px] font-bold uppercase tracking-wider text-gray-500">Модулей</p>
                    </div>
                    <div className="border border-gray-200 bg-white p-3 text-center">
                      <p className="font-display text-xl font-bold text-black">{String(lessonsCount).padStart(2, "0")}</p>
                      <p className="mt-1 text-[9px] font-bold uppercase tracking-wider text-gray-500">Уроков</p>
                    </div>
                    <div className="border border-gray-200 bg-white p-3 text-center">
                      <p className="font-display text-xl font-bold text-black">{String(completedLessons.length).padStart(2, "0")}</p>
                      <p className="mt-1 text-[9px] font-bold uppercase tracking-wider text-gray-500">Готово</p>
                    </div>
                  </div>
                </div>

                <div className="mt-12 pt-6 border-t border-gray-200 flex items-center justify-between">
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-widest text-gray-500 mb-1">
                      Владелец доступа
                    </p>
                    <p className="font-bold text-black tracking-wide">{displayName}</p>
                  </div>
                  <BadgeCheck className="w-5 h-5 text-black" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Modules Roadmap */}
        <section className="mt-20">
          <div className="mb-12 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <div>
              <h2 className="text-4xl font-display font-bold uppercase tracking-tight text-black mb-3">
                План действий
              </h2>
              <p className="text-gray-500 font-medium">Ваша дорожная карта к мастерству.</p>
            </div>
            <div className="flex gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 border border-gray-200 text-xs font-bold uppercase tracking-widest text-black">
                <Target className="w-3.5 h-3.5" /> В фокусе
              </span>
            </div>
          </div>

          <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
            {modules.map((module, i) => {
              const moduleLessonsCount = module.lessons.length
              const moduleCompletedCount = module.lessons.filter((l) => completedLessons.includes(l.id)).length
              const isCompleted = moduleCompletedCount === moduleLessonsCount && moduleLessonsCount > 0
              const isActive = moduleCompletedCount > 0 && !isCompleted

              return (
                <div
                  key={module.id}
                  className="group relative flex flex-col sm:flex-row gap-5 p-6 sm:p-8 bg-white border border-gray-200 hover:border-black hover:shadow-lg transition-all duration-300"
                >
                  <div className="shrink-0 pt-1">
                    <div className="flex h-12 w-12 items-center justify-center bg-gray-50 border border-gray-200 text-black font-display font-bold text-xl group-hover:bg-black group-hover:text-white transition-colors">
                      {i + 1}
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="mb-2 flex flex-wrap items-center gap-3">
                      <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">
                        Модуль {String(i + 1).padStart(2, "0")}
                      </span>
                      {isCompleted && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-black bg-gray-100 px-2 py-0.5">
                          <CheckCircle2 className="h-3 w-3" /> Пройден
                        </span>
                      )}
                      {isActive && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-white bg-black px-2 py-0.5">
                          <Flame className="h-3 w-3" /> В процессе
                        </span>
                      )}
                    </div>
                    <h3 className="mb-3 text-xl font-display font-bold leading-tight text-black group-hover:underline decoration-2 underline-offset-4">
                      {module.title}
                    </h3>

                    <div className="mt-5 flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-gray-500">
                      <div className="flex items-center gap-1.5">
                        <Layers3 className="h-3.5 w-3.5" />
                        <span>{moduleLessonsCount} уроков</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Trophy className="h-3.5 w-3.5" />
                        <span>{moduleCompletedCount} готово</span>
                      </div>
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
