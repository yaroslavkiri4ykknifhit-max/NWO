"use client"

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X, Mail, Send, ArrowUpRight } from "lucide-react"

// --- Subcomponents ---

function BreakingNewsBanner() {
  return (
    <div className="border-b border-gray-300 bg-black py-2 text-white">
      <div className="mx-auto flex max-w-[1200px] items-center justify-center gap-2 px-4 sm:px-6 lg:px-8">
        <span className="rounded-sm bg-red-700 px-1.5 py-0.5 font-ui text-[10px] font-bold uppercase tracking-[0.08em]">
          Live
        </span>
        <p className="font-ui text-xs font-medium tracking-tight">
          Набор на менторство открыт — первое занятие бесплатно
        </p>
      </div>
    </div>
  )
}

const navItems = [
  { label: "Главная", href: "/" },
  { label: "Бесплатно", href: "/free" },
  { label: "NWO Black", href: "/premium" },
  { label: "Менторство", href: "/mentorship" },
  { label: "Журнал", href: "/blog" },
]

function Navigation() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-300 bg-white/95 backdrop-blur-sm font-ui">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <div className="flex h-12 items-center justify-between">
          <Link href="/" className="text-sm font-bold tracking-tight text-black">
            NWO
          </Link>

          <div className="hidden md:flex md:items-center md:space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-xs font-medium uppercase tracking-[0.05em] text-gray-700 transition-colors hover:text-black"
              >
                {item.label}
              </Link>
            ))}
          </div>

          <a
            href="https://t.me/c0lddev"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden text-xs font-semibold text-red-700 hover:underline md:block"
          >
            Написать в Telegram
          </a>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 text-black md:hidden"
            aria-label="Открыть меню"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="border-t border-gray-200 bg-white md:hidden">
          <div className="mx-auto max-w-[1200px] px-4 py-3">
            <div className="flex flex-col space-y-3">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="text-xs font-medium uppercase tracking-[0.05em] text-gray-800"
                >
                  {item.label}
                </Link>
              ))}
              <a
                href="https://t.me/c0lddev"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-semibold text-red-700"
              >
                Написать в Telegram
              </a>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}

function Masthead() {
  const today = new Date().toLocaleDateString("ru-RU", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).replace(/^\w/, c => c.toUpperCase())

  return (
    <header className="border-b-4 border-double border-black bg-white py-6 md:py-10">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center">
          <p className="mb-3 font-ui text-[10px] font-medium uppercase tracking-[0.1em] text-gray-500">
            {today}
          </p>
          <h1 style={{ fontFamily: "'UnifrakturMaguntia', serif", fontSize: "clamp(4rem, 18vw, 15rem)" }} className="leading-none font-normal tracking-tight text-black mb-2">
            New Way Out
          </h1>
          <p className="mt-2 font-ui text-xs font-medium uppercase tracking-[0.15em] text-gray-600">
            «Научись продавать. Перестань зависеть от обстоятельств.»
          </p>
        </div>
      </div>
    </header>
  )
}

function LeadStory() {
  return (
    <section className="border-b border-gray-300 bg-white py-10 md:py-14">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-7 lg:pr-8">
            <h2 className="mb-6 font-display text-4xl font-bold tracking-tight text-black sm:text-5xl md:text-6xl lg:text-[3rem] leading-[1.05]">
              Практический курс по активным продажам
            </h2>
            <p className="mb-5 font-display text-lg leading-relaxed text-gray-800 first-letter:float-left first-letter:text-6xl first-letter:pr-2 first-letter:font-bold first-letter:mt-[-4px]">
              Если компания хочет продать свой продукт, одного желания и грамотного маркетинга недостаточно. Нужен sales-менеджер, который сможет в короткие сроки обеспечить определенный объем продаж.
            </p>
            <p className="font-display text-lg leading-relaxed text-gray-800">
              Учитывая уровень конкуренции на рынках и сложное экономическое положение, сегодня владельцы бизнеса заинтересованы в «универсальных солдатах», которые справятся с любым заданием.
            </p>
            <div className="mt-6 flex items-center gap-3 font-ui text-xs text-gray-500">
              <span className="font-semibold text-black">Редакция NWO</span>
              <span>|</span>
              <span>5 минут чтения</span>
            </div>
          </div>

          <div className="lg:col-span-5">
            <figure className="border border-gray-200 p-1">
              <img
                src="/founder.jpg"
                alt="Ярослав Киричук, основатель New Way Out"
                className="w-full object-cover"
              />
              <figcaption className="mt-2 border-t border-gray-200 px-3 py-2 font-ui text-[10px] uppercase tracking-[0.05em] text-gray-500">
                Ярослав Киричук, основатель New Way Out.
              </figcaption>
            </figure>
          </div>
        </div>
      </div>
    </section>
  )
}

function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-6 border-b-2 border-black pb-2">
      <div className="flex items-end justify-between">
        <h3 className="font-ui text-xs font-bold uppercase tracking-[0.12em] text-black">
          {title}
        </h3>
        {subtitle && (
          <span className="hidden font-ui text-[10px] font-medium uppercase tracking-[0.08em] text-gray-500 sm:block">
            {subtitle}
          </span>
        )}
      </div>
    </div>
  )
}

function ProgramCard({
  eyebrow,
  eyebrowColor = "blue",
  title,
  description,
  price,
  features,
  cta,
  href,
  variant = "standard",
}: any) {
  const colorMap: Record<string, string> = {
    red: "text-red-700",
    blue: "text-blue-700",
    orange: "text-orange-600",
    green: "text-green-700",
  }

  return (
    <article
      className={`group flex h-full flex-col border border-gray-300 bg-white p-5 transition-all hover:border-black ${
        variant === "featured" ? "lg:p-6 shadow-md" : ""
      }`}
    >
      <span
        className={`mb-3 font-ui text-[10px] font-semibold uppercase tracking-[0.1em] ${colorMap[eyebrowColor]}`}
      >
        {eyebrow}
      </span>
      <h4 className="font-display text-2xl font-bold leading-tight text-black md:text-3xl mb-2">
        {title}
      </h4>
      {price && (
        <p className="mt-2 font-ui text-sm font-semibold text-gray-900">{price}</p>
      )}
      <p className="mt-3 font-display text-sm leading-relaxed text-gray-700">{description}</p>

      {features && features.length > 0 && (
        <ul className="mt-4 space-y-2 mb-6">
          {features.map((feature: string, index: number) => (
            <li
              key={index}
              className="flex items-start gap-2 font-display text-sm text-gray-600"
            >
              <span className="mt-1.5 h-1 w-1 shrink-0 bg-black" />
              {feature}
            </li>
          ))}
        </ul>
      )}

      <div className="mt-auto pt-5 border-t border-gray-200">
        <Link
          href={href}
          className="inline-flex items-center gap-1 font-ui text-xs font-semibold uppercase tracking-[0.05em] text-black underline-offset-4 hover:underline"
        >
          {cta}
          <ArrowUpRight size={14} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
      </div>
    </article>
  )
}

const programs = [
  {
    id: "free",
    eyebrow: "Бесплатный доступ",
    eyebrowColor: "green",
    title: "База продаж — бесплатно",
    description:
      "Открытый вводный курс для тех, кто только начинает. Поймёте мышление продавца, получите первые скрипты и научитесь не выгорать от отказов.",
    price: "$0",
    features: [
      "Мышление продавца",
      "Скрипты первого звонка",
      "Как исследовать клиента",
      "Работа с базовыми возражениями",
    ],
    cta: "Начать бесплатно",
    href: "/free",
    variant: "standard",
  },
  {
    id: "premium",
    eyebrow: "Премиум-программа",
    eyebrowColor: "red",
    title: "NWO Black",
    description:
      "Углублённое обучение для тех, кто готов продавать дорого, контролировать весь цикл сделки и строить личный бренд, за который платят премиум.",
    price: "Уточняйте стоимость",
    features: [
      "Фреймворк закрытия высоких чеков",
      "Контроль всего цикла продаж",
      "Позиционирование эксперта",
      "Живые разборы и ролевые игры",
    ],
    cta: "Присоединиться к NWO Black",
    href: "/premium",
    variant: "featured",
  },
  {
    id: "mentorship",
    eyebrow: "Личное менторство",
    eyebrowColor: "blue",
    title: "Месяц менторства",
    description:
      "Месяц совместной работы один на один: разбираем реальные диалоги, снимаем страхи, позиционируем вас на собеседованиях и выводим на позицию.",
    price: "$170 / месяц",
    features: [
      "Фундамент психологии покупателя",
      "Работа со страхом и отказами",
      "Позиционирование на собеседованиях",
      "Помощь с трудоустройством",
    ],
    cta: "Узнать детали",
    href: "/mentorship",
    variant: "standard",
  },
]

function ProgramsSection() {
  return (
    <section className="border-b border-gray-300 bg-white py-10 md:py-14">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <SectionHeader title="Программы" subtitle="Три формата обучения" />

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {programs.map((program) => (
            <div key={program.id} id={program.id}>
              <ProgramCard {...program} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

const stats = [
  { value: "№1", label: "Сложные продажи: техники влияния и убеждения" },
  { value: "100%", label: "Практический формат активных продаж" },
  { value: "4", label: "Ключевых навыка для отстройки от конкурентов" },
  { value: "PRO", label: "Универсальный солдат в продажах" },
]

const principles = [
  {
    title: "Эффективная презентация",
    body: "Вы будете способны провести эффективную презентацию продукта в любых условиях.",
  },
  {
    title: "Истинные мотивы",
    body: "Вы узнаете, как выявить реальные мотивы и потребности клиента до того, как он озвучит отказ.",
  },
  {
    title: "Сложные переговоры",
    body: "Вы сможете эффективно проводить сложные переговоры и справляться с жесткими возражениями клиента.",
  },
  {
    title: "Отстройка от конкурентов",
    body: "Вы узнаете о передовых техниках отстройки от конкурентов, чтобы выигрывать сделки без демпинга.",
  },
]

function ResultsSection() {
  return (
    <section id="results" className="border-b border-gray-300 bg-[#f7f7f5] py-10 md:py-14">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <SectionHeader title="Польза программы" subtitle="Чему вы научитесь" />

        <div className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <div className="grid gap-6 sm:grid-cols-2">
              {stats.map((stat) => (
                <div key={stat.label} className="border-b border-gray-300 pb-4">
                  <p className="font-display text-3xl font-bold text-black md:text-4xl">
                    {stat.value}
                  </p>
                  <p className="mt-1 font-display text-sm leading-relaxed text-gray-600">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-4">
            <div className="border-t-4 border-black bg-white p-5 md:p-6 shadow-sm border-x border-b border-gray-200">
              <h4 className="mb-4 font-ui text-[10px] font-bold uppercase tracking-[0.1em] text-black">
                Редакционная заметка
              </h4>
              <p className="font-display text-sm italic leading-relaxed text-gray-800">
                «Эта программа направлена на формирование универсального солдата в продажах. Мы учим проводить сложные переговоры, выявлять реальные мотивы и управлять сделками.»
              </p>
              <p className="mt-3 font-ui text-xs font-semibold text-black">
                — Ярослав Киричук
              </p>
            </div>
          </div>
        </div>

        <div className="mt-10 grid gap-6 border-t border-gray-300 pt-8 md:grid-cols-3">
          {principles.map((principle) => (
            <article key={principle.title}>
              <h5 className="font-display text-lg font-bold text-black">
                {principle.title}
              </h5>
              <p className="mt-2 font-display text-sm leading-relaxed text-gray-600">
                {principle.body}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="border-t-4 border-black bg-white py-10">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-12">
          <div className="md:col-span-5">
            <h2 style={{ fontFamily: "'UnifrakturMaguntia', serif" }} className="text-3xl text-black">New Way Out</h2>
            <p className="mt-3 max-w-sm font-display text-sm leading-relaxed text-gray-600">
              Обучение продажам, построенное на реальных звонках, реальных отказах и реальных результатах.
              Научитесь находить клиентов, доносить ценность и уверенно закрывать высокие чеки.
            </p>
          </div>

          <div className="md:col-span-3 md:col-start-7">
            <h3 className="mb-3 font-ui text-[10px] font-bold uppercase tracking-[0.1em] text-black">
              Разделы
            </h3>
            <ul className="space-y-2">
              {navItems.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="font-ui text-xs font-medium text-gray-600 hover:text-black"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-4">
            <h3 className="mb-3 font-ui text-[10px] font-bold uppercase tracking-[0.1em] text-black">
              Контакты
            </h3>
            <div className="space-y-3">
              <a
                href="https://t.me/c0lddev"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 font-ui text-xs font-medium text-gray-600 hover:text-black"
              >
                <Send size={14} />
                Telegram: @c0lddev
              </a>
              <p className="flex items-center gap-2 font-ui text-xs font-medium text-gray-600">
                <Mail size={14} />
                newwayout.online
              </p>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-gray-300 pt-6">
          <div className="flex flex-col items-center justify-between gap-3 md:flex-row">
            <p className="text-center font-ui text-[10px] uppercase tracking-[0.08em] text-gray-500">
              © {new Date().getFullYear()} NWO (New Way Out). Все права защищены.
            </p>
            <p className="text-center font-ui text-[10px] uppercase tracking-[0.08em] text-gray-500">
              Дизайн в редакционной традиции.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export function LandingPage() {
  return (
    <main className="min-h-screen bg-white text-[#121212] font-display selection:bg-black selection:text-white">
      <BreakingNewsBanner />
      <Navigation />
      <Masthead />
      
      <LeadStory />
      <ProgramsSection />
      <ResultsSection />
      
      <Footer />
    </main>
  )
}
