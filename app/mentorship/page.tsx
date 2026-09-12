import Link from 'next/link'
import { ArrowLeft, CheckCircle2, Briefcase, ChevronRight } from "lucide-react"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: 'Менторство по продажам | НВО (New Way Out)',
  description: 'Менторство по продажам от NWO (НВО). Обучение с нуля до устройства менеджером по продажам с доходом от 700$ + процент. Личная работа, практика и гарантия результата.',
  keywords: ['менторство по продажам', 'НВО обучение продажам', 'курсы по продажам с трудоустройством', 'как стать менеджером по продажам', 'NWO', 'НВО', 'New Way Out'],
}

export default function MentorshipPage() {
  return (
    <main className="min-h-screen bg-white text-[#121212] font-ui selection:bg-black selection:text-white">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white sticky top-0 z-50">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-black transition-colors">
            <ArrowLeft size={16} /> Главная
          </Link>
          <div className="font-display font-bold uppercase tracking-widest text-sm">NWO Mentorship</div>
          <div className="w-24" />
        </div>
      </header>

      <article className="max-w-3xl mx-auto px-6 pt-16 pb-24">
        <div className="mb-6">
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-gray-500 border-b border-gray-300 pb-1 mb-4">
            Личное ведение
          </span>
          <h1 className="text-4xl sm:text-6xl font-display font-bold leading-[1.1] mb-6">
            Твой путь с нуля до стабильных $700+
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed font-display">
            Месяц работы со мной лично. Я встрою в голову правильное понимание продаж и доведу до реального трудоустройства. Без лишней теории — жесткая практика на реальных звонках.
          </p>
        </div>

        <img 
          src="/mentor_timeline.jpg" 
          alt="Timeline менторства" 
          className="w-full grayscale hover:grayscale-0 transition-all duration-700 mb-16 border border-gray-200"
        />

        <div className="prose prose-lg prose-gray max-w-none font-ui mb-16">
          <h2 className="font-display text-3xl font-bold mb-4">Почему я могу этому научить?</h2>
          <p className="text-gray-700 mb-6">
            В продажах я уже около двух лет, и я прошел все этапы: от страха первого звонка до закрытия крупных сделок. 
            Самое главное — я сделал <strong>$11,000 в 17 лет всего за три месяца</strong>. Это не случайность, это результат четкой системы, которую я открутил на практике.
          </p>

          <h2 className="font-display text-3xl font-bold mb-4 mt-12">Что будет происходить этот месяц?</h2>
          <ul className="space-y-4 list-none pl-0">
            {[
              "Разберем фундамент: поймешь, как мыслят люди с деньгами и как им продавать.",
              "Снимем страхи: перестанешь бояться отказов, слова «дорого» и неловких пауз.",
              "Жесткая практика: отыгрываем реальные диалоги, пока не появится уверенность.",
              "Твое позиционирование: научишься дорого продавать себя на собеседованиях.",
              "Трудоустройство: подготовим резюме, найдем компанию и выведем на позицию."
            ].map((text, i) => (
              <li key={i} className="flex gap-4 items-start border-b border-gray-100 pb-4">
                <CheckCircle2 className="w-6 h-6 text-black shrink-0 mt-0.5" />
                <span className="text-gray-700">{text}</span>
              </li>
            ))}
          </ul>
        </div>

        <img 
          src="/mentor_results.jpg" 
          alt="Результаты после менторства" 
          className="w-full grayscale hover:grayscale-0 transition-all duration-700 mb-16 border border-gray-200"
        />

        <div className="bg-gray-50 border border-gray-200 p-8 sm:p-12 text-center mb-16">
          <h2 className="text-3xl font-display font-bold mb-4">Твоя инвестиция в себя</h2>
          <div className="text-6xl font-display font-bold text-black mb-6">$170</div>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Это не просто цена за информацию. Это стоимость месяца моей личной работы и гарантия того, что ты начнешь зарабатывать.
          </p>
          
          <a 
            href="https://t.me/c0lddev" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-black text-white px-8 py-4 font-bold text-sm tracking-widest uppercase hover:bg-gray-800 transition-colors"
          >
            Написать в Telegram <ChevronRight size={16} />
          </a>
        </div>
      </article>
    </main>
  )
}
