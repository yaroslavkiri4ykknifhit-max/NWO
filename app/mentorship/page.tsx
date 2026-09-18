"use client"

import Link from 'next/link'
import { ArrowLeft, CheckCircle2, ChevronRight, ArrowUpRight } from "lucide-react"

export default function MentorshipPage() {
  return (
    <main className="min-h-screen bg-white text-[#121212] font-ui selection:bg-black selection:text-white">
      {/* Editorial Top Bar */}
      <div className="border-b border-gray-300 bg-black py-2 text-white">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between px-4 sm:px-6 lg:px-8 text-xs font-medium">
          <div className="flex items-center gap-2">
            <span className="rounded-sm bg-red-700 px-1.5 py-0.5 font-ui text-[10px] font-bold uppercase tracking-[0.08em]">
              Личный формат
            </span>
            <span className="hidden sm:inline text-gray-300">Набор на текущий поток ограничен — не более 5 человек</span>
            <span className="sm:hidden text-gray-300">Осталось 2 места на поток</span>
          </div>
          <Link href="/" className="text-gray-300 hover:text-white flex items-center gap-1">
            На главную <ArrowUpRight size={12} />
          </Link>
        </div>
      </div>

      {/* Masthead Header */}
      <header className="border-b border-gray-300 bg-white">
        <div className="mx-auto max-w-[1200px] px-4 py-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <Link href="/" className="group flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-black transition-colors">
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> 
            <span>Все программы</span>
          </Link>
          
          <Link href="/" className="text-center">
            <span 
              className="text-3xl sm:text-4xl text-black block tracking-tight select-none"
              style={{ fontFamily: "'UnifrakturMaguntia', serif" }}
            >
              New Way Out
            </span>
            <span className="text-[9px] font-display uppercase tracking-[0.3em] text-gray-500 block -mt-1">
              Private Mentorship
            </span>
          </Link>

          <a 
            href="https://t.me/c0lddev"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-black border border-black px-3 py-1.5 hover:bg-black hover:text-white transition-colors"
          >
            Связаться в TG
          </a>
        </div>
        <div className="border-t border-b border-black py-1.5 text-center bg-[#fafaf9]">
          <p className="font-display text-[11px] uppercase tracking-[0.25em] text-gray-600">
            Персональное ведение до результата · 30 дней интенсивной практики · Гарантия трудоустройства
          </p>
        </div>
      </header>

      {/* Hero Article Section */}
      <article className="mx-auto max-w-[1100px] px-4 py-12 sm:px-6 lg:px-8">
        <div className="border-b border-gray-300 pb-12 mb-12">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 border-b-2 border-black pb-1 mb-6">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-black">
                Флагманский формат
              </span>
            </div>
            
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-display font-bold leading-[1.05] tracking-tight text-black mb-6">
              Твой прямой путь к стабильным $700+ в продажах
            </h1>

            <p className="text-xl sm:text-2xl text-gray-700 leading-relaxed font-display mb-8">
              30 дней персональной работы с основателем NWO Ярославом Киричуком. Мы разберем твои затыки, поставим навык на реальных звонках и доведем до официального оффера в компанию. Без сухой теории.
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs font-ui text-gray-500 uppercase tracking-wider">
              <span>Автор: <strong>Ярослав Киричук</strong></span>
              <span>•</span>
              <span>Формат: <strong>1 на 1 онлайн</strong></span>
              <span>•</span>
              <span>Длительность: <strong>4 недели</strong></span>
            </div>
          </div>
        </div>

        {/* Why Listen to Me — Editorial Grid */}
        <section className="grid lg:grid-cols-12 gap-10 border-b border-gray-300 pb-14 mb-14">
          <div className="lg:col-span-5">
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-black mb-4">
              Почему этот метод работает?
            </h2>
            <p className="text-gray-600 font-display text-lg leading-relaxed mb-6">
              Большинство курсов по продажам ведут теоретики, которые сами в последний раз звонили клиенту пять лет назад. Я нахожусь в боевой практике каждый день.
            </p>
            <div className="p-6 bg-[#fafaf9] border border-gray-200">
              <div className="font-display text-4xl font-bold text-black mb-1">$11,000</div>
              <p className="text-xs uppercase font-bold tracking-wider text-gray-500 mb-3">Заработано в 17 лет за 3 месяца</p>
              <p className="text-sm text-gray-700 leading-relaxed">
                Это был результат не «удачи», а жесткой системы отработки возражений и правильного донесения ценности. В менторстве я просто передаю этот навык тебе в руки.
              </p>
            </div>
          </div>

          <div className="lg:col-span-7 flex flex-col justify-between">
            <div className="space-y-6">
              <h3 className="text-xl font-display font-bold text-black border-b border-gray-200 pb-3">
                С чем мы справимся за этот месяц:
              </h3>
              
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="border border-gray-200 p-5">
                  <div className="text-xs font-bold uppercase tracking-widest text-red-700 mb-2">Проблема №1</div>
                  <h4 className="font-display font-bold text-lg text-black mb-2">Страх первого звонка</h4>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Дрожащий голос, ступор при слове «дорого» и страх показаться навязчивым. Мы снимем это на первых же совместных прозвонах.
                  </p>
                </div>

                <div className="border border-gray-200 p-5">
                  <div className="text-xs font-bold uppercase tracking-widest text-red-700 mb-2">Проблема №2</div>
                  <h4 className="font-display font-bold text-lg text-black mb-2">Слив на возражениях</h4>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Клиент говорит «я подумаю» или «мне не надо», и менеджер сразу вешает трубку. Научимся закрывать такие диалоги в оплату.
                  </p>
                </div>

                <div className="border border-gray-200 p-5">
                  <div className="text-xs font-bold uppercase tracking-widest text-red-700 mb-2">Проблема №3</div>
                  <h4 className="font-display font-bold text-lg text-black mb-2">Бесплатная работа</h4>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Сидение на копеечной фиксе в 30 000 руб без бонусов. Мы выберем нишу, где процент с одной сделки превышает среднюю зарплату.
                  </p>
                </div>

                <div className="border border-gray-200 p-5">
                  <div className="text-xs font-bold uppercase tracking-widest text-red-700 mb-2">Проблема №4</div>
                  <h4 className="font-display font-bold text-lg text-black mb-2">Провал собеседований</h4>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Неумение продать самого себя работодателю. Мы соберем резюме и отрепетируем собеседование так, чтобы выбрали тебя.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* HUMAN EDITORIAL INFOGRAPHIC 1: 4-WEEK ROADMAP */}
        <section className="mb-16 border-b border-gray-300 pb-16">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-gray-500 block mb-2">
              Инфографика программы
            </span>
            <h2 className="text-3xl sm:text-5xl font-display font-bold text-black tracking-tight">
              4 недели протокола менторства
            </h2>
            <p className="mt-3 text-gray-600 font-display text-base">
              Пошаговый технологический маршрут: от постановки голоса до подписания оффера
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Week 1 */}
            <div className="border border-black p-6 flex flex-col justify-between bg-white relative hover:shadow-lg transition-shadow">
              <div className="absolute -top-3 left-6 bg-black text-white px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest">
                Неделя 01
              </div>
              <div>
                <h3 className="text-xl font-display font-bold text-black mt-2 mb-3">
                  Фундамент и психология чека
                </h3>
                <p className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-4 border-b border-gray-200 pb-2">
                  Результат: Логика покупателя
                </p>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-black font-bold">•</span>
                    <span>Анатомия мышления людей с деньгами</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-black font-bold">•</span>
                    <span>Ликвидация синдрома самозванца</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-black font-bold">•</span>
                    <span>Позиционирование не просителя, а эксперта</span>
                  </li>
                </ul>
              </div>
              <div className="mt-6 pt-4 border-t border-gray-100 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                1 личный созвон + ДЗ
              </div>
            </div>

            {/* Week 2 */}
            <div className="border border-black p-6 flex flex-col justify-between bg-white relative hover:shadow-lg transition-shadow">
              <div className="absolute -top-3 left-6 bg-black text-white px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest">
                Неделя 02
              </div>
              <div>
                <h3 className="text-xl font-display font-bold text-black mt-2 mb-3">
                  Скрипты без скриптов
                </h3>
                <p className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-4 border-b border-gray-200 pb-2">
                  Результат: Контроль над диалогом
                </p>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-black font-bold">•</span>
                    <span>Снятие сопротивления в первые 7 секунд</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-black font-bold">•</span>
                    <span>Вопросы, выявляющие реальную боль</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-black font-bold">•</span>
                    <span>Работа с возражением «Дорого» и «Подумаю»</span>
                  </li>
                </ul>
              </div>
              <div className="mt-6 pt-4 border-t border-gray-100 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                Разбор твоих реплик в записи
              </div>
            </div>

            {/* Week 3 */}
            <div className="border border-black p-6 flex flex-col justify-between bg-[#fafaf9] relative hover:shadow-lg transition-shadow">
              <div className="absolute -top-3 left-6 bg-red-700 text-white px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest">
                Неделя 03 · Практика
              </div>
              <div>
                <h3 className="text-xl font-display font-bold text-black mt-2 mb-3">
                  Боевые симуляции и звонки
                </h3>
                <p className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-4 border-b border-gray-200 pb-2">
                  Результат: Железная уверенность
                </p>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-black font-bold">•</span>
                    <span>Отыгрыш сложных клиентов лично со мной</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-black font-bold">•</span>
                    <span>Дожим сомневающихся лидов до предоплаты</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-black font-bold">•</span>
                    <span>Постановка тембра, пауз и уверенного тона</span>
                  </li>
                </ul>
              </div>
              <div className="mt-6 pt-4 border-t border-gray-200 text-[11px] font-bold uppercase tracking-wider text-black">
                Живые тренировки до идеала
              </div>
            </div>

            {/* Week 4 */}
            <div className="border border-black p-6 flex flex-col justify-between bg-white relative hover:shadow-lg transition-shadow">
              <div className="absolute -top-3 left-6 bg-black text-white px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest">
                Неделя 04
              </div>
              <div>
                <h3 className="text-xl font-display font-bold text-black mt-2 mb-3">
                  Трудоустройство и оффер
                </h3>
                <p className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-4 border-b border-gray-200 pb-2">
                  Результат: Выход на доход $700+
                </p>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-black font-bold">•</span>
                    <span>Упаковка продающего резюме и кейса</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-black font-bold">•</span>
                    <span>Подбор проверенных компаний с высоким чеком</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-black font-bold">•</span>
                    <span>Прохождение собеседования и выход в штат</span>
                  </li>
                </ul>
              </div>
              <div className="mt-6 pt-4 border-t border-gray-100 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                Финал: Подписание контракта
              </div>
            </div>
          </div>
        </section>

        {/* HUMAN EDITORIAL INFOGRAPHIC 2: METRICS TABLE */}
        <section className="mb-16 border-b border-gray-300 pb-16">
          <div className="max-w-3xl mb-8">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500">
              Сравнительный анализ трансформации
            </span>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-black mt-2">
              Твои показатели: До менторства vs После
            </h2>
          </div>

          <div className="border border-black overflow-x-auto">
            <table className="w-full text-left border-collapse font-ui">
              <thead>
                <tr className="border-b-2 border-black bg-black text-white text-xs uppercase tracking-wider">
                  <th className="p-4 sm:p-5 font-bold">Ключевая метрика</th>
                  <th className="p-4 sm:p-5 font-bold bg-gray-900 text-gray-300">Самостоятельно (До)</th>
                  <th className="p-4 sm:p-5 font-bold text-white bg-black">После менторства NWO</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 text-sm">
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 sm:p-5 font-display font-bold text-base text-black">
                    Конверсия из первого звонка в диалог
                  </td>
                  <td className="p-4 sm:p-5 text-gray-500 bg-[#fafaf9]">
                    10–15% (слив на секретарях и фразе «не надо»)
                  </td>
                  <td className="p-4 sm:p-5 font-bold text-black bg-white">
                    45–65% (проход к ЛПР без стресса и заикания)
                  </td>
                </tr>
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 sm:p-5 font-display font-bold text-base text-black">
                    Средний чек закрываемой сделки
                  </td>
                  <td className="p-4 sm:p-5 text-gray-500 bg-[#fafaf9]">
                    $50 – $150 (страх называть большие цифры)
                  </td>
                  <td className="p-4 sm:p-5 font-bold text-black bg-white">
                    $500 – $2,000+ (уверенная работа с ценностью)
                  </td>
                </tr>
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 sm:p-5 font-display font-bold text-base text-black">
                    Реакция на возражение «Дорого»
                  </td>
                  <td className="p-4 sm:p-5 text-gray-500 bg-[#fafaf9]">
                    Скидка, ступор или завершение звонка
                  </td>
                  <td className="p-4 sm:p-5 font-bold text-black bg-white">
                    Вскрытие истинной причины и дожим до сделки
                  </td>
                </tr>
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 sm:p-5 font-display font-bold text-base text-black">
                    Ежемесячный доход менеджера
                  </td>
                  <td className="p-4 sm:p-5 text-gray-500 bg-[#fafaf9]">
                    $200 – $400 на базовой ставке
                  </td>
                  <td className="p-4 sm:p-5 font-bold text-black bg-white">
                    От $700 до $1,500+ (фикс + высокий процент)
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Investment & Offer Card */}
        <section className="max-w-3xl mx-auto border-2 border-black p-8 sm:p-14 bg-[#fafaf9] text-center mb-16">
          <span className="inline-block bg-black text-white px-3 py-1 text-xs font-bold uppercase tracking-widest mb-6">
            Инвестиция в профессию
          </span>

          <h2 className="text-4xl sm:text-5xl font-display font-bold text-black mb-4">
            Стоимость персонального месяца
          </h2>

          <div className="flex items-center justify-center gap-2 mb-6">
            <span className="text-6xl sm:text-7xl font-display font-bold text-black">$170</span>
            <span className="text-sm font-bold uppercase text-gray-500 tracking-widest text-left leading-tight">
              За весь<br />курс
            </span>
          </div>

          <p className="text-gray-700 font-display text-lg leading-relaxed max-w-lg mx-auto mb-8">
            Это не стоимость «записанных видео». Это месяц работы со мной лично 1 на 1, где я веду тебя за руку до первого оффера и гарантирую, что ты окупишь эту сумму с первой же зарплаты.
          </p>

          <div className="border-t border-b border-gray-300 py-6 mb-8 grid sm:grid-cols-3 gap-4 text-center">
            <div>
              <div className="font-display font-bold text-2xl text-black">1 на 1</div>
              <div className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Только личные созвоны</div>
            </div>
            <div>
              <div className="font-display font-bold text-2xl text-black">24/7</div>
              <div className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Прямая связь в Telegram</div>
            </div>
            <div>
              <div className="font-display font-bold text-2xl text-black">100%</div>
              <div className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Доведение до оффера</div>
            </div>
          </div>

          <a 
            href="https://t.me/c0lddev" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-3 bg-black text-white px-10 py-5 font-bold text-sm tracking-[0.15em] uppercase hover:bg-gray-800 transition-all w-full sm:w-auto"
          >
            <span>Записаться в Telegram</span>
            <ChevronRight size={18} />
          </a>

          <p className="mt-4 text-xs text-gray-500">
            Личный контакт: <strong>@c0lddev</strong> · Напиши «Хочу в менторство»
          </p>
        </section>
      </article>

      {/* Editorial Footer */}
      <footer className="border-t border-gray-300 bg-white py-12 text-center text-xs text-gray-500 font-ui">
        <div className="mx-auto max-w-[1200px] px-4">
          <span 
            className="text-2xl text-black block mb-2 select-none"
            style={{ fontFamily: "'UnifrakturMaguntia', serif" }}
          >
            New Way Out
          </span>
          <p>© {new Date().getFullYear()} NWO. Все права защищены. Образовательная система нового поколения.</p>
        </div>
      </footer>
    </main>
  )
}
