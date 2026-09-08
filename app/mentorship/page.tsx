import { ArrowRight, ArrowLeft, Target, Briefcase, Flame, CheckCircle2 } from "lucide-react"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: 'Менторство по продажам | НВО (New Way Out)',
  description: 'Менторство по продажам от NWO (НВО). Обучение с нуля до устройства менеджером по продажам с доходом от 700$ + процент. Личная работа, практика и гарантия результата.',
  keywords: ['менторство по продажам', 'НВО обучение продажам', 'курсы по продажам с трудоустройством', 'как стать менеджером по продажам', 'NWO', 'НВО', 'New Way Out'],
}

export default function MentorshipPage() {
  return (
    <main className="min-h-screen bg-[#050505] text-white selection:bg-[#b14cff]/30">
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#050505]/80 backdrop-blur-md px-6 py-4 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2 text-sm font-semibold text-white/60 hover:text-white transition-colors">
          <ArrowLeft size={16} /> Назад
        </a>
        <div className="font-black tracking-widest uppercase text-sm">NWO Менторство</div>
        <div className="w-16" />
      </header>

      <article className="max-w-3xl mx-auto px-5 pt-32 pb-24">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#b14cff]/10 border border-[#b14cff]/20 text-[#d28eff] text-xs font-bold uppercase tracking-wider mb-8">
          <Flame size={14} /> Личная работа до результата
        </div>

        <h1 className="text-4xl sm:text-5xl font-black leading-[1.1] mb-6 uppercase tracking-tight">
          Твой прямой путь с абсолютного нуля до стабильных <span className="text-[#b14cff]">700$ + процент</span>
        </h1>

        <p className="text-xl text-white/70 leading-relaxed mb-12">
          Месяц работы со мной лично. Я возьму тебя за руку, встрою в голову правильное понимание продаж и доведу до реального трудоустройства. Без воды, без лишней теории - только жесткая практика на реальных разговорах.
        </p>

        <img 
          src="/mentor_timeline.jpg" 
          alt="Timeline менторства" 
          className="w-full rounded-2xl border border-white/10 mb-16 shadow-[0_0_80px_rgba(177,76,255,0.15)]"
        />

        <div className="space-y-12 mb-16">
          <section>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded bg-white/5 text-[#b14cff] text-sm">01</span>
              Почему я могу этому научить?
            </h2>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8 space-y-4 text-white/80 leading-relaxed">
              <p>Давай сразу к делу. Я не теоретик, который прочитал книжку и решил стать гуру. В продажах я уже около двух лет, и я прошел все этапы от страха первого звонка до закрытия крупных сделок.</p>
              <p>Самое главное - я сделал <strong className="text-white">11 000$ в 17 лет всего за три месяца</strong>. Это не случайность, это результат четкой системы, которую я сам построил и открутил на практике. Я знаю, как продавать на высокие чеки, как доносить ценность и как закрывать возражения так, чтобы клиент сам захотел отдать деньги.</p>
              <p>Эту же систему я встрою в тебя.</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded bg-white/5 text-[#b14cff] text-sm">02</span>
              Что будет происходить этот месяц?
            </h2>
            <ul className="grid gap-4">
              {[
                "Разберем фундамент: поймешь, как мыслят люди с деньгами и как им продавать.",
                "Снимем страхи: перестанешь бояться отказов, слова «дорого» и неловких пауз.",
                "Жесткая практика: будем отыгрывать реальные звонки и диалоги, пока не появится уверенность.",
                "Твое позиционирование: научишься дорого продавать себя как специалиста на собеседованиях.",
                "Трудоустройство: подготовим крутое резюме, найдем компанию и выведем тебя на позицию менеджера по продажам."
              ].map((text, i) => (
                <li key={i} className="flex gap-4 bg-white/5 border border-white/10 p-5 rounded-xl">
                  <CheckCircle2 className="w-6 h-6 text-[#b14cff] shrink-0" />
                  <span className="text-white/80">{text}</span>
                </li>
              ))}
            </ul>
          </section>

          <img 
            src="/mentor_results.jpg" 
            alt="Результаты после менторства" 
            className="w-full rounded-2xl border border-white/10 my-16 shadow-[0_0_80px_rgba(177,76,255,0.15)]"
          />

          <section>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded bg-white/5 text-[#b14cff] text-sm">03</span>
              Твой результат на выходе
            </h2>
            <div className="bg-[#b14cff]/5 border border-[#b14cff]/20 rounded-2xl p-6 sm:p-8">
              <div className="flex items-start gap-4 mb-6">
                <Briefcase className="w-8 h-8 text-[#b14cff] shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-bold mb-2">Стабильная работа и навык на всю жизнь</h3>
                  <p className="text-white/70">Через месяц ты выходишь на работу менеджером по продажам. У тебя будет стабильная зарплата от 700$ плюс хороший процент с каждой закрытой сделки. Ты окупишь это обучение буквально в первый месяц работы.</p>
                </div>
              </div>
              <p className="text-white/60 text-sm italic">
                А самое главное - навык продаж останется с тобой навсегда. Куда бы ты ни пошел потом, ты всегда сможешь продать себя, свои идеи или продукты.
              </p>
            </div>
          </section>
        </div>

        <div className="text-center bg-white/5 border border-white/10 rounded-[2rem] p-8 sm:p-12 relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#b14cff]/20 blur-[100px] rounded-full pointer-events-none" />
          
          <h2 className="text-3xl font-black uppercase mb-4 relative z-10">Твоя инвестиция в себя</h2>
          <div className="text-6xl font-black text-[#b14cff] mb-6 relative z-10">170$</div>
          <p className="text-white/60 mb-8 max-w-md mx-auto relative z-10">
            Это не просто цена за информацию. Это стоимость месяца моей личной работы с тобой и гарантия того, что ты начнешь зарабатывать реальные деньги. Количество мест жестко ограничено, потому что я работаю лично.
          </p>
          
          <a 
            href="https://t.me/yaroslav_kiri4yk" 
            target="_blank" 
            rel="noopener noreferrer"
            className="relative z-10 inline-flex items-center justify-center gap-2 bg-[#b14cff] text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-[#c275ff] transition-all hover:scale-105 active:scale-95"
          >
            Написать в Telegram <ArrowRight size={20} />
          </a>
          <p className="mt-4 text-xs text-white/40 uppercase tracking-widest relative z-10">
            Напиши мне, чтобы забронировать место
          </p>
        </div>
      </article>
    </main>
  )
}
