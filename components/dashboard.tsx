"use client"

import { BookOpen, Crown, Play, CheckCircle2, ArrowRight } from "lucide-react"
import { TelegramProfile } from "@/lib/sheets-api"
import Link from "next/link"

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
  const studentName = telegramUser?.username 
    ? `@${telegramUser.username}` 
    : telegramUser?.first_name || "Студент"

  return (
    <main className="flex-1 overflow-y-auto bg-white flex flex-col min-h-full font-ui text-[#121212]">
      <div className="max-w-4xl w-full mx-auto p-6 sm:p-10 lg:p-12 flex-1 flex flex-col justify-between">
        
        {/* Welcome Section */}
        <div className="border-b border-gray-300 pb-12 pt-4">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] px-2 py-1 bg-black text-white">
              NWO FREE · Базовый уровень
            </span>
            <span className="text-xs text-gray-500 font-medium">
              Открытая библиотека материалов
            </span>
          </div>
          
          <h1 className="text-4xl sm:text-6xl font-display font-bold leading-[1.05] tracking-tight text-black mb-4">
            Привет, {studentName}
          </h1>
          
          <p className="text-lg sm:text-xl text-gray-700 leading-relaxed font-display max-w-2xl mb-8">
            Это твоя стартовая площадка. Здесь собрана основа системы New Way Out: фундаментальные принципы психологии клиентов, скрипты первого контакта и разборы ошибок.
          </p>

          <button
            onClick={onStartLearning}
            className="inline-flex items-center gap-2.5 bg-black hover:bg-gray-800 text-white px-8 py-4 font-bold uppercase tracking-widest text-xs transition-colors cursor-pointer"
          >
            <Play className="h-3.5 w-3.5 fill-current" />
            <span>Перейти к первому уроку</span>
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid sm:grid-cols-2 gap-6 my-12">
          <div className="border border-gray-300 p-6 sm:p-8 bg-[#fafaf9]">
            <div className="flex items-center justify-between mb-6 text-xs font-bold uppercase tracking-widest text-gray-500">
              <span>Текущий прогресс</span>
              <CheckCircle2 className="w-4 h-4 text-black" />
            </div>
            <div className="flex items-baseline gap-2 mb-4">
              <span className="text-5xl font-display font-bold text-black">{progressPercent}%</span>
              <span className="text-gray-500 font-bold uppercase text-[10px] tracking-wider">Пройдено</span>
            </div>
            <div className="h-1.5 w-full bg-gray-200 overflow-hidden">
              <div 
                className="h-full bg-black transition-all duration-700 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <p className="text-xs text-gray-600 mt-4">
              Завершено уроков: <strong>{completedCount}</strong> из <strong>{lessonsCount}</strong>
            </p>
          </div>

          <div className="border border-gray-300 p-6 sm:p-8 bg-[#fafaf9]">
            <div className="flex items-center justify-between mb-6 text-xs font-bold uppercase tracking-widest text-gray-500">
              <span>Содержание программы</span>
              <BookOpen className="w-4 h-4 text-black" />
            </div>
            <div className="flex items-baseline gap-2 mb-4">
              <span className="text-5xl font-display font-bold text-black">{lessonsCount}</span>
              <span className="text-gray-500 font-bold uppercase text-[10px] tracking-wider">Уроков</span>
            </div>
            <div className="h-1.5 w-full bg-gray-200">
              <div className="h-full bg-black w-full" />
            </div>
            <p className="text-xs text-gray-600 mt-4">
              Структурировано по <strong>{modulesCount}</strong> тематическим блокам
            </p>
          </div>
        </div>

        {/* Premium Upgrade Section */}
        {premiumHref && (
          <div className="border-2 border-black p-8 sm:p-10 bg-white">
            <div className="flex flex-col sm:flex-row gap-6 sm:items-center justify-between">
              <div className="max-w-lg">
                <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">
                  <Crown className="w-3.5 h-3.5 text-black" />
                  <span>Следующий шаг</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-display font-bold text-black mb-2">
                  Готов к серьезным сделкам?
                </h2>
                <p className="text-sm text-gray-700 leading-relaxed font-ui">
                  В закрытом клубе <strong>NWO BLACK</strong> ты получишь жесткие боевые скрипты, техники дожима сложных клиентов и разборы реальных переговоров на крупные чеки.
                </p>
              </div>

              <Link
                href={premiumHref}
                className="inline-flex items-center justify-center gap-2 bg-black hover:bg-gray-800 text-white px-6 py-4 font-bold text-xs uppercase tracking-widest transition-colors shrink-0"
              >
                <span>Узнать про NWO BLACK</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}

      </div>
    </main>
  )
}
