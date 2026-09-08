"use client"

import { BookOpen, ExternalLink, Code, Lightbulb, Crown, ArrowRight, Play, CheckCircle2 } from "lucide-react"
import { TelegramProfile } from "@/lib/sheets-api"

interface DashboardProps {
  courseName: string
  modulesCount: number
  lessonsCount: number
  completedCount: number
  onStartLearning: () => void
  telegramUser?: TelegramProfile | null
  premiumHref?: string
}

export function Dashboard({
  courseName,
  modulesCount,
  lessonsCount,
  completedCount,
  onStartLearning,
  telegramUser,
  premiumHref,
}: DashboardProps) {
  const progressPercent = lessonsCount > 0 ? Math.round((completedCount / lessonsCount) * 100) : 0
  const studentName = telegramUser?.username || telegramUser?.first_name || "студент"

  return (
    <main className="flex-1 overflow-y-auto bg-white flex flex-col min-h-full font-ui text-[#121212] relative">
      <div className="max-w-4xl w-full mx-auto p-6 sm:p-8 lg:p-10 flex-1 flex flex-col justify-between relative">
        
        {/* Welcome Section */}
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300 border-b border-gray-200 pb-16 pt-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-gray-50 border border-gray-200 text-xs font-bold uppercase tracking-widest text-black w-fit">
            <span className="w-2 h-2 rounded-full bg-black animate-pulse" />
            NWO FREE
          </div>
          
          <h1 className="text-5xl md:text-7xl font-display font-bold leading-[1.05] tracking-tight">
            Привет, <span className="text-gray-500 italic font-display">{studentName}</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 leading-relaxed font-display max-w-2xl">
            Добро пожаловать в открытую базу знаний NWO. Здесь собраны фундаментальные лекции и инструменты для старта в продажах.
          </p>

          <button
            onClick={onStartLearning}
            className="inline-flex items-center gap-3 bg-black hover:bg-gray-800 text-white px-8 py-4 font-bold uppercase tracking-widest text-sm transition-all mt-4"
          >
            <Play className="h-4 w-4 fill-current" />
            Начать обучение
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid sm:grid-cols-2 gap-6 mt-16 animate-in fade-in slide-in-from-bottom-8 duration-500 delay-150 mb-16">
          <div className="bg-white p-8 border border-gray-200 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-8 text-xs font-bold uppercase tracking-widest text-gray-500">
              Прогресс
              <CheckCircle2 className="w-4 h-4 text-black" />
            </div>
            <div className="flex items-baseline gap-2 mb-4">
              <span className="text-5xl font-display font-bold tracking-tight">{progressPercent}%</span>
              <span className="text-gray-500 font-bold uppercase text-xs tracking-widest">Пройдено</span>
            </div>
            <div className="h-1.5 w-full bg-gray-100 overflow-hidden">
              <div 
                className="h-full bg-black transition-all duration-1000 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mt-4">
              Выполнено {completedCount} из {lessonsCount} уроков
            </p>
          </div>

          <div className="bg-white p-8 border border-gray-200 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-8 text-xs font-bold uppercase tracking-widest text-gray-500">
              Материалы
              <BookOpen className="w-4 h-4 text-black" />
            </div>
            <div className="flex items-baseline gap-2 mb-4">
              <span className="text-5xl font-display font-bold tracking-tight">{lessonsCount}</span>
              <span className="text-gray-500 font-bold uppercase text-xs tracking-widest">Уроков</span>
            </div>
            <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mt-5">
              Внутри {modulesCount} модулей
            </p>
          </div>
        </div>

        {/* Premium Upsell */}
        {premiumHref && (
          <div className="mt-auto pt-8 border-t border-gray-200 animate-in fade-in slide-in-from-bottom-8 duration-500 delay-300">
            <div className="bg-black text-white p-8 sm:p-10 border border-black flex flex-col sm:flex-row gap-8 items-start sm:items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <Crown className="w-4 h-4 text-white" />
                  <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Продвинутый уровень</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-display font-bold mb-3">NWO BLACK</h3>
                <p className="text-gray-400 max-w-md leading-relaxed">
                  Закрытая система: скрипты, сложные переговоры, работа с возражениями и выход на чеки $1000+.
                </p>
              </div>
              <a 
                href={premiumHref}
                className="inline-flex items-center gap-2 bg-white text-black px-6 py-4 font-bold uppercase tracking-widest text-sm hover:bg-gray-100 transition-colors shrink-0"
              >
                Перейти к BLACK <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
