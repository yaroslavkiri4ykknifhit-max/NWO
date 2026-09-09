"use client"

import Link from 'next/link'
import { ArrowRight, PlayCircle, Star } from "lucide-react"

export function LandingPage() {
  const currentDate = new Date().toLocaleDateString('ru-RU', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  }).replace(/^\w/, c => c.toUpperCase());

  return (
    <main className="min-h-screen bg-[#f7f7f5] text-[#121212] font-display selection:bg-black selection:text-white pb-20">
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=UnifrakturMaguntia&display=swap');
      `}} />
      
      {/* Top Header */}
      <div className="border-b border-gray-300 bg-white">
        <div className="max-w-[1200px] mx-auto px-4 py-1 flex items-center justify-between text-[11px] font-ui text-gray-600 uppercase tracking-wide">
          <div className="flex-1">{currentDate}</div>
          <div className="flex-1 text-center font-bold">ОБУЧЕНИЕ ПРОДАЖАМ</div>
          <div className="flex-1 text-right"><Link href="/free" className="hover:text-black">Войти в кабинет</Link></div>
        </div>
      </div>

      {/* Main Logo Header */}
      <header className="bg-white border-b-4 border-double border-black">
        <div className="max-w-[1200px] mx-auto px-4 py-8 flex flex-col items-center">
          <Link href="/">
            <h1 style={{ fontFamily: "'UnifrakturMaguntia', serif" }} className="text-6xl md:text-8xl tracking-tight text-center mb-4 leading-none font-normal">
              New Way Out
            </h1>
          </Link>
          <div className="flex items-center gap-2 text-sm font-display italic text-gray-700">
            «Научись продавать. Перестань зависеть от обстоятельств.»
          </div>
        </div>
        
        {/* Navigation Bar */}
        <nav className="border-t border-gray-300">
          <ul className="max-w-[1200px] mx-auto px-4 py-3 flex flex-wrap justify-center items-center gap-x-8 gap-y-2 text-[13px] font-bold font-ui uppercase tracking-widest">
            <li><Link href="#about" className="hover:underline decoration-2 underline-offset-4">Обо мне</Link></li>
            <li><Link href="/free" className="hover:underline decoration-2 underline-offset-4">Free База</Link></li>
            <li><Link href="/premium" className="text-red-700 hover:text-red-800 hover:underline decoration-2 underline-offset-4">NWO Black</Link></li>
            <li><Link href="/mentorship" className="hover:underline decoration-2 underline-offset-4">Менторство</Link></li>
            <li><Link href="/blog" className="hover:underline decoration-2 underline-offset-4">Журнал</Link></li>
          </ul>
        </nav>
      </header>

      {/* Main Newspaper Grid */}
      <div className="max-w-[1200px] mx-auto px-4 mt-6 bg-[#f7f7f5]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative">
          
          {/* Left Column (Narrow) */}
          <div className="lg:col-span-3 flex flex-col gap-6 lg:border-r border-gray-300 lg:pr-8">
            <article className="border-b border-gray-300 pb-6">
              <span className="block text-[11px] font-ui font-bold uppercase tracking-widest text-gray-500 mb-2">Начало</span>
              <h3 className="text-2xl font-bold leading-tight mb-3 hover:text-gray-600 cursor-pointer">
                <Link href="/free">Фундамент продаж: с чего начать, если ты новичок?</Link>
              </h3>
              <p className="text-[15px] leading-relaxed text-gray-700 mb-4">
                Бесплатная открытая база NWO содержит всё необходимое для старта. Пойми, как клиент принимает решение, и перестань бояться отказов.
              </p>
              <Link href="/free" className="text-[11px] font-ui font-bold uppercase tracking-widest text-black hover:underline">Читать материалы →</Link>
            </article>

            <article className="border-b border-gray-300 pb-6">
              <span className="block text-[11px] font-ui font-bold uppercase tracking-widest text-gray-500 mb-2">Отзывы</span>
              <h3 className="text-xl font-bold leading-tight mb-3 italic">
                «Я отбил стоимость курса с первой сделки»
              </h3>
              <p className="text-[14px] leading-relaxed text-gray-700 mb-3">
                Десятки студентов уже прошли систему NWO BLACK и вышли на стабильные чеки.
              </p>
              <div className="flex gap-1 text-yellow-500 mb-3">
                <Star className="w-3 h-3 fill-current" /><Star className="w-3 h-3 fill-current" /><Star className="w-3 h-3 fill-current" /><Star className="w-3 h-3 fill-current" /><Star className="w-3 h-3 fill-current" />
              </div>
            </article>
            
            <article>
              <h3 className="text-lg font-bold mb-3 uppercase tracking-wide font-ui">The Blog</h3>
              <ul className="space-y-3 font-display">
                <li className="flex items-start gap-2 border-b border-gray-200 pb-2">
                  <span className="font-bold text-lg mt-1">•</span>
                  <Link href="/blog/how-i-made-11k" className="hover:underline text-[15px] leading-snug">Как я заработал свои первые $11k</Link>
                </li>
                <li className="flex items-start gap-2 pb-2">
                  <span className="font-bold text-lg mt-1">•</span>
                  <Link href="/blog/why-managers-burn-out" className="hover:underline text-[15px] leading-snug">Почему выгорают менеджеры по продажам</Link>
                </li>
              </ul>
            </article>
          </div>

          {/* Center Column (Wide Main Story) */}
          <div className="lg:col-span-6 flex flex-col lg:border-r border-gray-300 lg:pr-8">
            <article className="mb-8 border-b-2 border-black pb-8" id="about">
              <h2 className="text-4xl sm:text-[3.5rem] leading-[1.05] font-bold tracking-tight mb-6 text-center italic">
                Я — Ярослав Киричук. В 17 лет я сделал $11,000 на продажах.
              </h2>
              <div className="mb-6 flex justify-center">
                <div className="aspect-[4/3] w-full bg-gray-200 border border-gray-300 relative overflow-hidden flex items-center justify-center">
                  <span className="text-gray-400 font-ui text-sm tracking-widest uppercase">Фото основателя</span>
                </div>
              </div>
              <p className="text-[17px] leading-[1.6] text-gray-800 mb-5 first-letter:float-left first-letter:text-6xl first-letter:pr-2 first-letter:font-bold first-letter:mt-[-4px]">
                Сейчас я учу людей находить клиентов, доносить ценность и уверенно называть высокие чеки. Моя система не основана на сухой теории из книжек. Она построена на реальной практике, тысячах звонков и живых переговорах.
              </p>
              <p className="text-[17px] leading-[1.6] text-gray-800 mb-5">
                Если вы хотите превратить продажи из стресса в управляемый и прогнозируемый процесс, где вы контролируете каждый этап сделки — добро пожаловать в New Way Out.
              </p>
            </article>

            {/* Secondary articles in center */}
            <div className="grid sm:grid-cols-2 gap-8">
              <article>
                <h3 className="text-2xl font-bold mb-3">
                  <Link href="/premium" className="hover:text-gray-600">NWO BLACK: Закрытая система</Link>
                </h3>
                <p className="text-[15px] leading-relaxed text-gray-700 mb-4">
                  Продвинутая программа для тех, кто хочет выйти на чеки от $1000+. Скрипты, кризисные переговоры и максимизация прибыли.
                </p>
                <Link href="/premium" className="bg-black text-white px-4 py-2 font-ui font-bold text-xs uppercase tracking-widest hover:bg-gray-800 inline-block">Получить доступ</Link>
              </article>
              <article>
                <h3 className="text-2xl font-bold mb-3">
                  <Link href="/mentorship" className="hover:text-gray-600">Личное Менторство</Link>
                </h3>
                <p className="text-[15px] leading-relaxed text-gray-700 mb-4">
                  Работа со мной лично до результата. Я беру вас за руку и довожу до трудоустройства на зарплату $700+ и процент.
                </p>
                <Link href="/mentorship" className="border border-black px-4 py-2 font-ui font-bold text-xs uppercase tracking-widest hover:bg-black hover:text-white inline-block">Узнать детали</Link>
              </article>
            </div>
          </div>

          {/* Right Column (Narrow, Opinion/Highlights) */}
          <div className="lg:col-span-3 flex flex-col gap-6">
            <div className="border-t-4 border-black pt-4">
              <h3 className="font-ui font-black uppercase tracking-widest text-xs mb-4 text-gray-500">The NWO Opinion</h3>
              
              <article className="border-b border-gray-300 pb-5 mb-5">
                <h4 className="font-bold text-xl leading-tight mb-2 italic">
                  «Продажи — это не впаривание, это помощь»
                </h4>
                <p className="text-sm text-gray-600">
                  Почему старые агрессивные методы больше не работают в 2026 году.
                </p>
              </article>
              
              <article className="border-b border-gray-300 pb-5 mb-5">
                <h4 className="font-bold text-xl leading-tight mb-2 italic">
                  Хватит работать за копейки
                </h4>
                <p className="text-sm text-gray-600">
                  Как перейти из сегмента дешевых услуг в премиум B2B сегмент.
                </p>
              </article>
            </div>

            <div className="bg-gray-100 p-5 border border-gray-200 mt-4">
              <h4 className="font-bold font-ui uppercase tracking-wide text-sm mb-3">Связь со мной</h4>
              <p className="text-[13px] text-gray-600 mb-4">
                Остались вопросы по обучению или хотите обсудить сотрудничество?
              </p>
              <a href="https://t.me/yaroslav_kiri4yk" target="_blank" rel="noreferrer" className="block w-full text-center bg-black text-white px-4 py-3 font-ui font-bold text-[11px] uppercase tracking-widest hover:bg-gray-800">
                Написать в Telegram
              </a>
            </div>
          </div>

        </div>
      </div>
      
      {/* Footer */}
      <footer className="max-w-[1200px] mx-auto px-4 mt-20 pt-8 border-t border-double border-t-4 border-black text-center font-ui text-xs text-gray-500 pb-10">
        <p>© {new Date().getFullYear()} NWO (New Way Out). Все права защищены.</p>
        <div className="mt-4 flex justify-center gap-6">
          <Link href="/free" className="hover:text-black">Terms of Service</Link>
          <Link href="/free" className="hover:text-black">Privacy Policy</Link>
        </div>
      </footer>
    </main>
  )
}
