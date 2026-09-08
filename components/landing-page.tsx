"use client"

import Link from 'next/link'
import { ArrowRight, LockKeyhole, FileText, ChevronRight, PlayCircle } from "lucide-react"

export function LandingPage() {
  return (
    <main className="min-h-screen bg-white text-[#121212] font-ui selection:bg-black selection:text-white">
      {/* Header */}
      <header className="border-b border-gray-200 sticky top-0 bg-white/95 backdrop-blur-sm z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="font-display font-bold text-2xl tracking-tight">NWO</div>
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-gray-600">
            <Link href="#about" className="hover:text-black transition-colors">Обо мне</Link>
            <Link href="#programs" className="hover:text-black transition-colors">Программы</Link>
            <Link href="/blog" className="hover:text-black transition-colors">Журнал</Link>
            <Link href="#faq" className="hover:text-black transition-colors">FAQ</Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/free" className="text-sm font-bold text-gray-900 hover:text-gray-600 hidden sm:block">Войти</Link>
            <Link href="/premium" className="text-sm font-bold bg-black text-white px-5 py-2 rounded hover:bg-gray-800 transition-colors">
              NWO BLACK
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="border-b border-gray-200" id="about">
        <div className="max-w-6xl mx-auto px-6 py-20 md:py-32 grid md:grid-cols-12 gap-12 items-center">
          <div className="md:col-span-7">
            <h1 className="text-5xl md:text-7xl font-display font-bold leading-[1.05] tracking-tight mb-6">
              Научись продавать. Перестань зависеть от обстоятельств.
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 leading-relaxed font-display mb-8 max-w-2xl">
              Я — Ярослав Киричук. В 17 лет я заработал $11,000 на продажах с нуля. 
              Сейчас я учу людей находить клиентов, доносить ценность и уверенно называть высокие чеки.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="#programs" className="inline-flex items-center justify-center gap-2 bg-black text-white px-8 py-4 text-sm font-bold tracking-widest uppercase hover:bg-gray-800 transition-colors">
                Выбрать программу <ArrowRight size={16} />
              </Link>
              <Link href="/blog" className="inline-flex items-center justify-center gap-2 border border-gray-300 px-8 py-4 text-sm font-bold tracking-widest uppercase hover:border-gray-900 transition-colors">
                Читать журнал <FileText size={16} />
              </Link>
            </div>
          </div>
          <div className="md:col-span-5 relative">
            <div className="aspect-[3/4] bg-gray-100 p-8 border border-gray-200 flex flex-col justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Основатель</p>
                <h3 className="font-display text-2xl font-bold">Ярослав Киричук</h3>
              </div>
              <div>
                <p className="text-gray-600 font-display italic leading-relaxed mb-4">
                  «Продажи — это не впаривание. Это умение понять проблему человека и показать ему решение. 
                  Когда ты освоишь этот навык, деньги станут лишь математикой.»
                </p>
                <div className="w-12 h-1 bg-black"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Latest News / Blog Preview */}
      <section className="border-b border-gray-200 bg-gray-50 py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-end justify-between mb-12 border-b border-gray-300 pb-4">
            <h2 className="text-3xl font-display font-bold">Журнал NWO</h2>
            <Link href="/blog" className="text-sm font-bold uppercase tracking-widest hover:text-gray-600 flex items-center gap-1">
              Все статьи <ChevronRight size={16} />
            </Link>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Article 1 */}
            <Link href="/blog/why-managers-burn-out" className="group block">
              <div className="aspect-[16/9] bg-gray-200 mb-4 border border-gray-300"></div>
              <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Мышление</p>
              <h3 className="text-2xl font-display font-bold leading-tight mb-2 group-hover:underline decoration-2 underline-offset-4">
                Почему 90% менеджеров по продажам выгорают за год
              </h3>
              <p className="text-gray-600 line-clamp-2">И как правильная структура диалога помогает закрывать сделки, не теряя себя.</p>
            </Link>
            
            {/* Article 2 */}
            <Link href="/blog/how-i-made-11k" className="group block">
              <div className="aspect-[16/9] bg-gray-200 mb-4 border border-gray-300"></div>
              <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Кейс</p>
              <h3 className="text-2xl font-display font-bold leading-tight mb-2 group-hover:underline decoration-2 underline-offset-4">
                Как я заработал $11,000 в 17 лет на продажах
              </h3>
              <p className="text-gray-600 line-clamp-2">Никакой магии и успешного успеха. Только дисциплина, скрипты и понимание ценности.</p>
            </Link>
          </div>
        </div>
      </section>

      {/* Programs Grid */}
      <section id="programs" className="border-b border-gray-200 py-20 md:py-32">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-center mb-16">Система Обучения</h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            {/* Free */}
            <div className="border border-gray-200 p-8 flex flex-col justify-between hover:shadow-lg transition-shadow">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4">База</p>
                <h3 className="text-2xl font-display font-bold mb-4">NWO FREE</h3>
                <p className="text-gray-600 mb-8 leading-relaxed">
                  Бесплатная база по продажам. Изучи основы, пойми, как принимаются решения о покупке.
                </p>
              </div>
              <Link href="/free" className="block text-center border border-black py-3 text-sm font-bold uppercase tracking-widest hover:bg-gray-50">
                Начать бесплатно
              </Link>
            </div>

            {/* Black */}
            <div className="border border-black bg-black text-white p-8 flex flex-col justify-between shadow-2xl scale-[1.02] transform">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Премиум</p>
                <h3 className="text-2xl font-display font-bold mb-4">NWO BLACK</h3>
                <p className="text-gray-300 mb-8 leading-relaxed">
                  Закрытая премиальная система. Скрипты, отработка "дорого", сложные переговоры и выход на высокий чек.
                </p>
              </div>
              <Link href="/premium" className="flex items-center justify-center gap-2 bg-white text-black py-3 text-sm font-bold uppercase tracking-widest hover:bg-gray-100">
                Получить доступ <LockKeyhole size={14} />
              </Link>
            </div>

            {/* Mentorship */}
            <div className="border border-gray-200 p-8 flex flex-col justify-between hover:shadow-lg transition-shadow bg-gray-50">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4">Индивидуально</p>
                <h3 className="text-2xl font-display font-bold mb-4">МЕНТОРСТВО</h3>
                <p className="text-gray-600 mb-8 leading-relaxed">
                  Месяц личной работы. С нуля до гарантированного трудоустройства с доходом от $700 + %.
                </p>
              </div>
              <Link href="/mentorship" className="block text-center border border-black py-3 text-sm font-bold uppercase tracking-widest bg-black text-white hover:bg-gray-800">
                Забронировать место
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="py-20 border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-display font-bold mb-12">Результаты учеников</h2>
          <div className="grid sm:grid-cols-2 gap-8 text-left">
            <blockquote className="p-6 bg-gray-50 border border-gray-200">
              <p className="font-display text-lg italic text-gray-700 mb-4">«До NWO я панически боялся называть цену. Сейчас закрываю 4 из 5 заявок на высокий чек без скидок. Скрипты реально работают.»</p>
              <cite className="not-italic text-sm font-bold text-gray-900">— Александр, Фрилансер</cite>
            </blockquote>
            <blockquote className="p-6 bg-gray-50 border border-gray-200">
              <p className="font-display text-lg italic text-gray-700 mb-4">«Менторство окупилось в первый месяц работы. Ушел с нелюбимой работы, устроился менеджером B2B. Теперь стабильно делаю $1500+.»</p>
              <cite className="not-italic text-sm font-bold text-gray-900">— Максим, Sales Manager</cite>
            </blockquote>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 md:py-32 max-w-3xl mx-auto px-6">
        <h2 className="text-3xl font-display font-bold mb-8">Частые вопросы</h2>
        <div className="space-y-8 divide-y divide-gray-200">
          <article className="pt-8">
            <h3 className="text-xl font-bold mb-3">Что такое НВО (NWO)?</h3>
            <p className="text-gray-600 leading-relaxed">НВО (New Way Out) — это практическая система обучения продажам. Мы учим доносить ценность, работать с возражениями и экологично закрывать сделки, чтобы вы могли уверенно продавать свои услуги, продукты или идеи.</p>
          </article>
          <article className="pt-8">
            <h3 className="text-xl font-bold mb-3">Как стать менеджером по продажам с нуля?</h3>
            <p className="text-gray-600 leading-relaxed">В рамках нашего Менторства мы проводим обучение с абсолютного нуля, ставим навык на реальных звонках и гарантируем трудоустройство с выходом на стабильный доход.</p>
          </article>
          <article className="pt-8">
            <h3 className="text-xl font-bold mb-3">Чем NWO BLACK отличается от бесплатной базы?</h3>
            <p className="text-gray-600 leading-relaxed">NWO FREE даёт фундамент. NWO BLACK — это полная закрытая система, где разбираются конкретные скрипты, сложные переговоры, ответы на «дорого» и доведение до оплаты.</p>
          </article>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-gray-50 py-12">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500 font-semibold">
          <div className="font-display font-bold text-lg text-black">NWO</div>
          <p>НВО (New Way Out) — профессиональное обучение продажам © {new Date().getFullYear()}</p>
        </div>
      </footer>
    </main>
  )
}
