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
    : telegramUser?.first_name || "Участник"

  return (
    <main className="premium-dashboard flex-1 overflow-y-auto relative">
      <div className="premium-grid absolute inset-0 pointer-events-none opacity-35" />
      <div className="premium-spotlight premium-spotlight-one" />
      <div className="premium-spotlight premium-spotlight-two" />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-5 py-8 sm:px-8 sm:py-12 lg:px-12 lg:py-16">
        <section className="grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-14 min-h-[66vh]">
          <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
            <div className="premium-kicker mb-6 w-fit">
              <Sparkles className="h-3.5 w-3.5" />
              PRIVATE SALES SYSTEM · 2026
            </div>

            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.28em] text-[#b8ff3d]">
              Добро пожаловать, {displayName}
            </p>
            <h1 className="premium-display max-w-4xl text-[clamp(3.2rem,7vw,7rem)] font-black uppercase leading-[0.82] tracking-[0.015em] text-white">
              Ты внутри.
              <span className="mt-3 block premium-gradient-text">Теперь - по-крупному.</span>
            </h1>
            <p className="mt-8 max-w-2xl text-base leading-relaxed text-white/60 sm:text-lg lg:text-xl">
              Здесь не будет базовых советов из интернета. Только система, разборы,
              механики и инструменты, которые превращают продажи из случайности в управляемый результат.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
              <button
                type="button"
                onClick={onStartLearning}
                className="premium-primary-button group inline-flex min-h-14 items-center justify-center gap-3 rounded-2xl px-7 py-3.5 text-base font-black uppercase tracking-[0.08em] cursor-pointer"
              >
                <Play className="h-5 w-5 fill-current" />
                Ворваться в программу
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </button>
              <div className="flex items-center justify-center gap-2 px-4 py-3 text-sm text-white/45 sm:justify-start">
                <ShieldCheck className="h-4 w-4 text-[#b8ff3d]" />
                Персональный защищённый доступ
              </div>
            </div>

            <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 border-t border-white/10 pt-6 text-xs font-bold uppercase tracking-[0.18em] text-white/35">
              <span>{modules.length} модулей</span>
              <span>{lessonsCount} уроков</span>
              <span>Доступ открыт</span>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-md animate-in fade-in zoom-in-95 duration-700 delay-150">
            <div className="premium-membership-card relative overflow-hidden rounded-[32px] p-1">
              <div className="premium-card-inner relative min-h-[500px] overflow-hidden rounded-[29px] p-7 sm:p-9">
                <div className="premium-card-noise absolute inset-0 opacity-40" />
                <div className="absolute -right-16 -top-20 h-64 w-64 rounded-full bg-[#b8ff3d]/15 blur-3xl" />
                <div className="absolute -bottom-24 -left-16 h-64 w-64 rounded-full bg-violet-500/15 blur-3xl" />

                <div className="relative z-10 flex h-full min-h-[430px] flex-col justify-between">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-xs font-bold uppercase tracking-[0.28em] text-white/40">NWO</div>
                      <div className="premium-display mt-1 text-4xl font-black tracking-[0.012em] text-white">BLACK</div>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#b8ff3d]/30 bg-[#b8ff3d]/10 text-[#b8ff3d]">
                      <Crown className="h-6 w-6" />
                    </div>
                  </div>

                  <div className="my-10">
                    <div className="mb-3 flex items-center justify-between text-xs font-bold uppercase tracking-[0.16em]">
                      <span className="text-white/40">Ваш прогресс</span>
                      <span className="text-[#b8ff3d]">{progressPercent}%</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-white/8">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#b8ff3d] via-emerald-400 to-cyan-400 shadow-[0_0_24px_rgba(184,255,61,0.55)] transition-all duration-700"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                    <div className="mt-7 grid grid-cols-3 gap-3">
                      {[
                        [String(modules.length).padStart(2, "0"), "модулей"],
                        [String(lessonsCount).padStart(2, "0"), "уроков"],
                        [String(completedLessons.length).padStart(2, "0"), "готово"],
                      ].map(([value, label]) => (
                        <div key={label} className="rounded-2xl border border-white/8 bg-white/[0.035] p-3 text-center">
                          <div className="premium-display text-2xl font-bold text-white">{value}</div>
                          <div className="mt-1 text-[9px] font-bold uppercase tracking-[0.12em] text-white/30">{label}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-end justify-between border-t border-white/10 pt-6">
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/30">Владелец доступа</div>
                      <div className="mt-1.5 font-semibold text-white">{displayName}</div>
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-[#b8ff3d]">
                      <BadgeCheck className="h-4 w-4" />
                      Verified
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-5 left-1/2 -z-10 h-20 w-4/5 -translate-x-1/2 rounded-full bg-[#b8ff3d]/20 blur-3xl" />
          </div>
        </section>

        <section className="mt-16 border-t border-white/10 pt-16 lg:mt-24 lg:pt-24">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <div className="premium-kicker mb-5 w-fit">
                <Layers3 className="h-3.5 w-3.5" />
                ВАША БОЕВАЯ КАРТА
              </div>
              <h2 className="premium-display text-4xl font-black uppercase tracking-[0.012em] text-white sm:text-6xl">
                Маршрут до результата
              </h2>
            </div>
            <p className="max-w-md text-sm leading-relaxed text-white/45 md:text-right">
              Каждый модуль - следующий уровень системы. Проходите последовательно или заходите сразу в нужную точку.
            </p>
          </div>

          <div className="mt-10 grid gap-4 lg:grid-cols-2">
            {modules.map((module, index) => {
              const completedInModule = module.lessons.filter((lesson) =>
                completedLessons.includes(lesson.id),
              ).length
              const modulePercent = module.lessons.length
                ? Math.round((completedInModule / module.lessons.length) * 100)
                : 0

              return (
                <article key={module.id} className="premium-module-card group relative overflow-hidden rounded-3xl border border-white/10 p-6 sm:p-7">
                  <div className="absolute right-5 top-3 premium-display text-7xl font-black tracking-[0.01em] text-white/[0.035] transition-colors group-hover:text-[#b8ff3d]/[0.07]">
                    {String(index + 1).padStart(2, "0")}
                  </div>
                  <div className="relative z-10 flex items-start gap-4">
                    <div className="premium-module-number flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-sm font-black">
                      {String(index + 1).padStart(2, "0")}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="mb-2 flex flex-wrap items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#b8ff3d]">Уровень открыт</span>
                        {modulePercent === 100 && <CheckCircle2 className="h-4 w-4 text-[#b8ff3d]" />}
                      </div>
                      <h3 className="text-xl font-bold leading-tight text-white sm:text-2xl">{module.title}</h3>
                      <div className="mt-5 flex items-center justify-between text-xs text-white/35">
                        <span>{module.lessons.length} уроков</span>
                        <span>{completedInModule} завершено</span>
                      </div>
                      <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/8">
                        <div className="h-full bg-[#b8ff3d] transition-all" style={{ width: `${modulePercent}%` }} />
                      </div>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        </section>

        <section className="mt-20 grid gap-4 md:grid-cols-3 lg:mt-28">
          {[
            { icon: Target, label: "Система", title: "Не набор советов", text: "Цельная архитектура продаж: от первого контакта до денег и повторных сделок." },
            { icon: BarChart3, label: "Практика", title: "Разбор по костям", text: "Механики, примеры и решения, которые можно внедрить в работу сразу после урока." },
            { icon: Trophy, label: "Результат", title: "Новый стандарт", text: "Не просто знать больше - действовать точнее, увереннее и зарабатывать системно." },
          ].map(({ icon: Icon, label, title, text }) => (
            <article key={title} className="premium-value-card rounded-3xl border border-white/10 p-7">
              <div className="mb-8 flex items-center justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/5 text-[#b8ff3d]">
                  <Icon className="h-5 w-5" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/25">{label}</span>
              </div>
              <h3 className="text-2xl font-bold text-white">{title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-white/45">{text}</p>
            </article>
          ))}
        </section>

        <section className="premium-final-cta relative mt-20 overflow-hidden rounded-[36px] border border-[#b8ff3d]/20 px-6 py-12 text-center sm:px-12 sm:py-16 lg:mt-28">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(184,255,61,0.22),transparent_55%)]" />
          <div className="relative z-10 mx-auto max-w-3xl">
            <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#b8ff3d] text-black shadow-[0_0_35px_rgba(184,255,61,0.35)]">
              <Flame className="h-7 w-7 fill-current" />
            </div>
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#b8ff3d]">Доступ подтверждён</p>
            <h2 className="premium-display mt-4 text-4xl font-black uppercase tracking-[0.012em] text-white sm:text-6xl">
              Хватит смотреть. Пора делать.
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-white/50">
              {courseName}. Начните с первого модуля и соберите свою систему шаг за шагом.
            </p>
            <button
              type="button"
              onClick={onStartLearning}
              className="premium-primary-button group mx-auto mt-8 inline-flex min-h-14 items-center justify-center gap-3 rounded-2xl px-8 py-3.5 font-black uppercase tracking-[0.08em] cursor-pointer"
            >
              <Zap className="h-5 w-5 fill-current" />
              Начать сейчас
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </section>

        <footer className="mt-14 flex flex-col items-center justify-between gap-3 border-t border-white/8 py-8 text-center text-[11px] font-semibold uppercase tracking-[0.16em] text-white/20 sm:flex-row sm:text-left">
          <span>NWO BLACK · PRIVATE SALES SYSTEM</span>
          <span>Материалы защищены персональным доступом</span>
        </footer>
      </div>
    </main>
  )
}
