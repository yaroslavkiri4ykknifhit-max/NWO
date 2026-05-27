"use client"

import { BookOpen, CheckCircle2, MessageCircle, ExternalLink, Code, Sparkles, ArrowRight, Award } from "lucide-react"
import { Button } from "@/components/ui/button"
import { TelegramUser } from "@/lib/sheets-api"

interface DashboardProps {
  courseName: string
  modulesCount: number
  lessonsCount: number
  completedCount: number
  onStartLearning: () => void
  telegramUser?: TelegramUser | null
}

export function Dashboard({
  courseName,
  modulesCount,
  lessonsCount,
  completedCount,
  onStartLearning,
  telegramUser,
}: DashboardProps) {
  const progressPercent = lessonsCount > 0 ? Math.round((completedCount / lessonsCount) * 100) : 0
  const studentName = telegramUser?.first_name || "Студент"

  return (
    <main className="flex-1 overflow-y-auto bg-background flex flex-col min-h-full">
      <div className="max-w-4xl w-full mx-auto p-6 sm:p-8 lg:p-10 flex-1 flex flex-col justify-between">
        
        {/* Welcome Section */}
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 text-accent text-xs font-semibold border border-accent/20">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Рады видеть вас в команде</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-none">
              Привет, {studentName}! 👋
            </h1>
            <p className="text-slate-500 text-sm sm:text-base max-w-xl leading-relaxed">
              Добро пожаловать в закрытое образовательное пространство NWO. Здесь собраны все необходимые материалы, лекции и инструменты для вашего профессионального роста.
            </p>
          </div>

          {/* Stats Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {/* Progress Card */}
            <div className="bg-card border border-border/40 rounded-2xl p-5 shadow-lg shadow-slate-100/50 flex flex-col justify-between h-40">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Прогресс обучения</span>
                <Award className="w-5 h-5 text-accent" />
              </div>
              <div className="space-y-2">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold text-slate-800">{progressPercent}%</span>
                  <span className="text-xs text-muted-foreground font-medium">пройдено</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-accent h-full rounded-full transition-all duration-500" 
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <p className="text-[11px] text-muted-foreground font-medium">
                  Выполнено {completedCount} из {lessonsCount} уроков
                </p>
              </div>
            </div>

            {/* Structure Card */}
            <div className="bg-card border border-border/40 rounded-2xl p-5 shadow-lg shadow-slate-100/50 flex flex-col justify-between h-40">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Материалы курса</span>
                <BookOpen className="w-5 h-5 text-accent" />
              </div>
              <div className="space-y-1">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-3xl font-extrabold text-slate-800">{lessonsCount}</span>
                  <span className="text-sm text-slate-500 font-semibold">уроков</span>
                </div>
                <p className="text-xs text-muted-foreground font-medium">
                  Курс разбит на {modulesCount} модулей
                </p>
              </div>
            </div>

            {/* Telegram Card */}
            <div className="bg-card border border-border/40 rounded-2xl p-5 shadow-lg shadow-slate-100/50 flex flex-col justify-between h-40">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Наше сообщество</span>
                <MessageCircle className="w-5 h-5 text-blue-500" />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-semibold text-slate-800 leading-tight">
                  Закрытый Telegram-канал
                </p>
                <p className="text-[11px] text-muted-foreground leading-normal mb-1">
                  Обновления, новости и общение с участниками
                </p>
                <a
                  href="https://t.me/+qbeP6wZuBXBiZGZi"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-500 hover:text-blue-600 transition-colors mt-0.5"
                >
                  <span>Перейти в канал</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>

          {/* Call to action & Telegram Link Banner */}
          <div className="p-6 bg-gradient-to-r from-accent/5 to-accent/15 border border-accent/15 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-1.5 text-center sm:text-left">
              <h3 className="text-base font-bold text-slate-800 flex items-center justify-center sm:justify-start gap-1.5">
                <Sparkles className="w-4 h-4 text-accent" />
                Готовы начать обучение?
              </h3>
              <p className="text-xs text-slate-600 max-w-md leading-relaxed">
                Вы можете выбрать любой доступный урок в боковом меню слева или нажать кнопку ниже, чтобы начать с самого первого урока.
              </p>
            </div>
            <Button
              onClick={onStartLearning}
              className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-xl h-11 px-5 font-semibold gap-2 shadow-lg shadow-accent/10 active:scale-[0.98] transition-all cursor-pointer w-full sm:w-auto justify-center shrink-0"
            >
              Начать обучение
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>

          {/* Quick Telegram Button Banner */}
          <div className="p-6 bg-blue-50/30 border border-blue-100/50 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-1.5 text-center sm:text-left">
              <h3 className="text-base font-bold text-slate-800 flex items-center justify-center sm:justify-start gap-1.5">
                <MessageCircle className="w-4 h-4 text-blue-500" />
                Официальный Telegram Канал
              </h3>
              <p className="text-xs text-slate-600 max-w-md leading-relaxed">
                Вступайте в наш приватный канал для получения анонсов, обратной связи и закрытых трансляций.
              </p>
            </div>
            <a
              href="https://t.me/+qbeP6wZuBXBiZGZi"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-[#2ea6ff] hover:bg-[#1a93eb] text-white rounded-xl h-11 px-5 font-semibold shadow-lg shadow-blue-500/10 active:scale-[0.98] transition-all cursor-pointer w-full sm:w-auto shrink-0"
            >
              Присоединиться к каналу
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Footer Credit */}
        <div className="mt-12 pt-6 border-t border-border/40 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground animate-in fade-in duration-500 delay-200">
          <p>© {new Date().getFullYear()} Закрытое сообщество NWO. Все права защищены.</p>
          <a
            href="https://t.me/c0lddev"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 px-2.5 py-1 rounded-lg transition-colors font-medium border border-slate-200/50 cursor-pointer"
          >
            <Code className="w-3.5 h-3.5 text-accent" />
            <span>Разработка платформы: @c0lddev</span>
          </a>
        </div>
      </div>
    </main>
  )
}
