"use client"

import { BookOpen, MessageCircle, ExternalLink, Code, Lightbulb } from "lucide-react"
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
  const studentName = telegramUser?.username || telegramUser?.first_name || "colddev"

  return (
    <main className="flex-1 overflow-y-auto bg-[#faf8f3] flex flex-col min-h-full font-sans text-slate-800 relative">
      
      {/* Decorative top-right purple handwritten scribble */}
      <div className="absolute top-8 right-12 text-purple-300/40 select-none pointer-events-none hidden lg:block">
        <svg className="w-32 h-20" fill="none" viewBox="0 0 96 64" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M 10 12 C 30 6, 60 18, 80 8 C 88 5, 94 14, 88 20 C 70 32, 20 22, 10 38 C 5 46, 25 58, 55 48 C 75 42, 85 54, 78 58" />
        </svg>
      </div>

      {/* Decorative bottom-left blue handwritten squiggle */}
      <div className="absolute bottom-16 left-12 text-blue-300/40 select-none pointer-events-none hidden lg:block">
        <svg className="w-24 h-16" fill="none" viewBox="0 0 64 48" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M 5 35 C 10 15, 20 40, 25 10 C 30 35, 38 15, 45 42 C 48 30, 52 38, 58 12" />
        </svg>
      </div>

      <div className="max-w-4xl w-full mx-auto p-6 sm:p-8 lg:p-10 flex-1 flex flex-col justify-between relative">
        
        {/* Welcome Section */}
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300 relative">
          
          <div className="flex flex-col md:flex-row justify-between items-start gap-8 relative">
            {/* Left Header */}
            <div className="space-y-5 max-w-xl">
              
              {/* Hand-drawn sketchy border badge with a spark */}
              <div className="relative inline-flex items-center gap-1.5 px-6 py-2.5 text-[#2b9348] text-sm sm:text-base font-semibold font-neucha tracking-wide">
                <svg className="absolute inset-0 w-full h-full text-[#2b9348]/60 pointer-events-none" viewBox="0 0 240 44" fill="none" preserveAspectRatio="none">
                  <path d="M 6,6 Q 120,3 234,6 Q 237,22 234,38 Q 120,41 6,38 Q 3,22 6,6 Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  <path d="M 9,9 Q 120,7 231,9 Q 233,22 231,35 Q 120,37 9,35 Q 7,22 9,9 Z" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" strokeDasharray="4 3" />
                </svg>
                <span className="relative z-10 flex items-center gap-2">
                  <svg className="w-4 h-4 text-[#2b9348] fill-current shrink-0" viewBox="0 0 24 24">
                    <path d="M12 2l2.4 5.3 5.8.5-4.4 3.9 1.3 5.7-5.1-3-5.1 3 1.3-5.7-4.4-3.9 5.8-.5z" />
                  </svg>
                  Рады видеть вас в команде
                </span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-none font-serif">
                Привет, <span className="relative inline-block text-[#2b9348]">
                  {studentName}!
                  {/* Custom hand-drawn highlighter stroke */}
                  <svg className="absolute -bottom-2 left-0 w-full h-3.5 text-[#2b9348]/25 pointer-events-none" viewBox="0 0 100 10" fill="none" preserveAspectRatio="none">
                    <path d="M 2 5 Q 50 1, 98 5 Q 50 9, 2 5" fill="currentColor" />
                  </svg>
                </span> 👋
              </h1>

              <p className="text-slate-600 text-base sm:text-lg leading-relaxed font-neucha tracking-wide">
                Добро пожаловать в закрытое образовательное пространство{" "}
                <span className="relative inline-block px-2">
                  NWO
                  {/* Pencil-style circled loop around NWO */}
                  <svg className="absolute -inset-x-1.5 -inset-y-1 w-[calc(100%+12px)] h-[calc(100%+8px)] text-slate-400 pointer-events-none" viewBox="0 0 60 30" fill="none" preserveAspectRatio="none">
                    <path d="M 4 20 C 1 10, 15 3, 35 4 C 55 5, 59 18, 48 25 C 37 32, 10 28, 6 15" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                  </svg>
                </span>
                . Здесь собраны все необходимые материалы, лекции и инструменты для вашего профессионального роста.
              </p>
            </div>

            {/* Right Sticky Note Block (Post-it style) - Tilted Counter-Clockwise */}
            <div className="bg-[#fffdf0] border border-[#f2edbc]/80 shadow-lg rounded-2xl p-6 w-48 -rotate-2 transform hover:rotate-0 transition-transform duration-300 relative select-none shrink-0 self-center md:self-start">
              {/* Sticky Tape effect */}
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-16 h-6 bg-[#eae4c3]/40 border-l border-r border-[#ded8b1]/60 -rotate-2 backdrop-blur-[0.5px]" />
              
              <div className="flex items-center gap-1.5 mb-3 text-yellow-600/90">
                <Lightbulb className="w-5 h-5 fill-yellow-500/10" />
                <span className="text-xs font-bold uppercase tracking-wider font-neucha">Учитесь</span>
              </div>
              
              <div className="font-neucha text-slate-700 text-lg leading-relaxed tracking-wide space-y-1.5">
                <p>Учитесь.</p>
                <p>Практикуйтесь.</p>
                <div className="relative inline-block w-full">
                  <span>Развивайтесь.</span>
                  {/* Hand-drawn organic double underline */}
                  <svg className="absolute -bottom-1 -left-1 w-[calc(100%+8px)] h-2 text-slate-600/80 pointer-events-none" viewBox="0 0 100 10" fill="none" preserveAspectRatio="none">
                    <path d="M 1 3 Q 50 1, 98 4 M 4 6 Q 50 4, 94 7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
            
            {/* Progress Card */}
            <div className="bg-white border border-slate-200/60 rounded-3xl p-6 shadow-md shadow-slate-100 relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-green-900/5 flex flex-col justify-between h-48 group">
              {/* Hand-drawn upward trend arrow at bottom-left */}
              <div className="absolute bottom-3 left-4 text-[#2b9348]/25 pointer-events-none group-hover:scale-105 transition-all">
                <svg className="w-12 h-8" fill="none" viewBox="0 0 40 24">
                  <path d="M 4 20 Q 15 16, 25 6 M 25 6 L 18 5 M 25 6 L 22 13" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M 3 21 C 12 18, 18 10, 26 4" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" strokeDasharray="3 2" />
                </svg>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider font-neucha">Прогресс обучения</span>
                
                {/* Green Ribbon Medal Icon */}
                <svg className="w-6 h-6 text-[#2b9348]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>

              <div className="space-y-2 mt-4 relative z-10">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-3xl sm:text-4xl font-extrabold text-slate-800 font-serif">{progressPercent}%</span>
                  <span className="text-base text-[#2b9348]/80 font-bold font-neucha">пройдено</span>
                </div>
                <div className="w-full bg-[#ecebe6] h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-[#2b9348] h-full rounded-full transition-all duration-500" 
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <p className="text-xs text-slate-400 font-semibold font-neucha">
                  Выполнено {completedCount} из {lessonsCount} уроков
                </p>
              </div>
            </div>

            {/* Structure Card */}
            <div className="bg-white border border-slate-200/60 rounded-3xl p-6 shadow-md shadow-slate-100 relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-green-900/5 flex flex-col justify-between h-48 group">
              {/* Blue handwritten rays above card */}
              <div className="absolute -top-3 right-6 text-blue-500/70 select-none pointer-events-none group-hover:scale-105 transition-all">
                <svg className="w-8 h-6" fill="none" viewBox="0 0 32 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M 6 22 L 2 12 M 16 22 L 16 6 M 26 22 L 30 12" />
                </svg>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider font-neucha">Материалы курса</span>
                <BookOpen className="w-6 h-6 text-[#2b9348]" />
              </div>

              <div className="space-y-2 mt-4 relative">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-3xl sm:text-4xl font-extrabold text-slate-800 font-serif">{lessonsCount}</span>
                  <span className="text-base text-[#2b9348]/80 font-bold font-neucha">уроков</span>
                </div>
                
                {/* Purple dry brush stroke under module count */}
                <div className="relative inline-block pt-1">
                  <span className="relative z-10 font-neucha text-slate-500 text-sm font-semibold">
                    Курс разбит на {modulesCount} модуля
                  </span>
                  <svg className="absolute -bottom-1 -left-2 w-[calc(100%+16px)] h-4 text-purple-200/60 -z-0 pointer-events-none" viewBox="0 0 120 16" fill="currentColor" preserveAspectRatio="none">
                    <path d="M 2 12 Q 30 2, 60 6 Q 90 2, 118 10 Q 60 14, 2 12" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Telegram Card */}
            <div className="bg-white border border-slate-200/60 rounded-3xl p-6 shadow-md shadow-slate-100 relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-green-900/5 flex flex-col justify-between h-48 group">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider font-neucha">Наше сообщество</span>
                
                {/* Blue bubble icon with three dots */}
                <svg className="w-6 h-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>

              <div className="space-y-1.5 mt-4">
                <div className="relative inline-block mb-1">
                  <span className="font-serif text-lg font-bold text-slate-800 tracking-tight leading-tight block">
                    Закрытый Telegram-канал
                  </span>
                  {/* Blue handwritten underline stroke */}
                  <svg className="absolute -bottom-1 -left-1 w-[calc(100%+8px)] h-2 text-blue-500/40 pointer-events-none" viewBox="0 0 180 8" fill="none" preserveAspectRatio="none">
                    <path d="M 2 4 Q 90 1, 178 5 M 4 6 Q 90 3, 174 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </div>
                
                <p className="text-xs text-slate-400 leading-normal font-neucha pb-1">
                  Обновления, новости и общение с участниками
                </p>
                
                <a
                  href="https://t.me/+qbeP6wZuBXBiZGZi"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm font-bold text-blue-500 hover:text-blue-600 transition-colors mt-0.5 font-neucha cursor-pointer"
                >
                  <span>Перейти в канал</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>

          {/* Banner 1: Start Learning (Green block) */}
          <div className="p-6 sm:p-8 bg-[#f5f9f4] border-2 border-[#d2edd5]/80 rounded-3xl flex flex-col lg:flex-row items-center justify-between gap-6 relative shadow-lg shadow-green-900/5 overflow-hidden">
            
            {/* Hand-drawn star in top-right */}
            <div className="absolute right-4 top-4 text-[#2b9348]/15 select-none pointer-events-none">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                <path d="M12 2l2.4 5.3 5.8.5-4.4 3.9 1.3 5.7-5.1-3-5.1 3 1.3-5.7-4.4-3.9 5.8-.5z" />
              </svg>
            </div>

            {/* Hand-drawn curved arrow pointing to button */}
            <div className="hidden lg:block absolute left-[56%] top-[50%] text-[#2b9348]/25 select-none pointer-events-none">
              <svg className="w-16 h-10" fill="none" viewBox="0 0 64 40">
                <path d="M 4 12 Q 24 35, 48 20 M 48 20 L 40 18 M 48 20 L 44 28" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
              <div className="w-10 h-10 rounded-full bg-[#2b9348] flex items-center justify-center text-white shrink-0 shadow-md shadow-[#2b9348]/20">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2l2.4 5.3 5.8.5-4.4 3.9 1.3 5.7-5.1-3-5.1 3 1.3-5.7-4.4-3.9 5.8-.5z" />
                </svg>
              </div>

              <div className="space-y-1.5">
                <h3 className="text-xl font-bold text-slate-800 font-serif leading-tight">
                  Готовы начать обучение?
                </h3>
                <p className="text-sm sm:text-base text-slate-500 max-w-md leading-relaxed font-neucha">
                  Вы можете выбрать любой доступный урок в боковом меню слева или нажать кнопку ниже, чтобы начать с самого первого урока.
                </p>
              </div>
            </div>
            
            <button
              onClick={onStartLearning}
              className="bg-[#2b9348] hover:bg-[#207536] text-white font-neucha text-xl font-bold tracking-wide rounded-2xl h-14 px-8 flex items-center justify-center gap-2 shadow-lg shadow-green-700/20 active:scale-[0.97] transition-all cursor-pointer w-full lg:w-auto shrink-0 select-none border-b-4 border-[#1c602e] border-t border-[#3cb45a]"
            >
              <span>Начать обучение</span>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>

          {/* Banner 2: Telegram Link (Blue block) */}
          <div className="p-6 sm:p-8 bg-[#f3f7fe] border-2 border-[#d6e8fc]/80 rounded-3xl flex flex-col lg:flex-row items-center justify-between gap-6 relative shadow-lg shadow-blue-950/5 overflow-hidden">
            
            {/* Hand-drawn blue star in top-right */}
            <div className="absolute right-4 top-4 text-blue-500/15 select-none pointer-events-none">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                <path d="M12 2l2.4 5.3 5.8.5-4.4 3.9 1.3 5.7-5.1-3-5.1 3 1.3-5.7-4.4-3.9 5.8-.5z" />
              </svg>
            </div>

            {/* Hand-drawn blue rays next to button */}
            <div className="hidden lg:block absolute right-[320px] top-[30%] text-blue-400/35 select-none pointer-events-none">
              <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                <path d="M 4 12 L 1 12 M 6 6 L 3 3 M 12 4 L 12 1 M 18 6 L 21 3 M 20 12 L 23 12" />
              </svg>
            </div>

            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
              <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white shrink-0 shadow-md shadow-blue-500/20">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.19-.04-.27-.02-.12.02-1.96 1.24-5.54 3.65-.52.36-.97.53-1.34.52-.42-.01-1.22-.24-1.82-.44-.73-.24-1.32-.37-1.27-.78.02-.21.32-.43.89-.65 3.48-1.52 5.81-2.52 6.98-3.01 3.33-1.39 4.02-1.63 4.47-1.64.1 0 .32.02.46.14.12.1.15.29.17.41-.02.1.03-.02 0 .02z" />
                </svg>
              </div>

              <div className="space-y-1.5">
                <div className="relative inline-block">
                  <h3 className="text-xl font-bold text-slate-800 font-serif leading-tight">
                    Официальный Telegram Канал
                  </h3>
                  {/* Blue marker underline under official channel header */}
                  <svg className="absolute -bottom-1 -left-1 w-[calc(100%+8px)] h-2 text-blue-500/30 pointer-events-none" viewBox="0 0 240 8" fill="none" preserveAspectRatio="none">
                    <path d="M 2 4 Q 120 1, 238 5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                  </svg>
                </div>
                
                <p className="text-sm sm:text-base text-slate-500 max-w-md leading-relaxed font-neucha pt-1">
                  Вступайте в наш приватный канал для получения анонсов, обратной связи и закрытых трансляций.
                </p>
              </div>
            </div>

            <a
              href="https://t.me/+qbeP6wZuBXBiZGZi"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#2ea6ff] hover:bg-[#1fa0ff] text-white font-neucha text-xl font-bold tracking-wide rounded-2xl h-14 px-8 flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 active:scale-[0.97] transition-all cursor-pointer w-full lg:w-auto shrink-0 select-none border-b-4 border-[#1a85cf] border-t border-[#5ec0ff] text-center"
            >
              <span>Присоединиться к каналу</span>
              <ExternalLink className="w-4 h-4 shrink-0" />
            </a>
          </div>
        </div>

        {/* Footer Credit & Author Credit */}
        <div className="mt-16 pt-6 border-t border-slate-200/80 flex flex-col items-center gap-6 text-center animate-in fade-in duration-500 delay-200">
          
          {/* Handwritten slogan with custom heart underline */}
          <div className="relative inline-block pb-3">
            <div className="font-caveat text-3xl text-slate-500/90 select-none flex items-center justify-center gap-2.5">
              <span>Ваш успех — наша миссия</span>
              <span className="text-red-400 text-3xl">♡</span>
            </div>
            
            {/* Soft underline below mission slogan */}
            <svg className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-48 h-2 text-slate-300 pointer-events-none" viewBox="0 0 160 8" fill="none" preserveAspectRatio="none">
              <path d="M 2 4 Q 80 1, 158 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between w-full text-xs text-slate-400 gap-4 mt-2">
            <p>© {new Date().getFullYear()} Закрытое сообщество NWO. Все права защищены.</p>
            
            <a
              href="https://t.me/c0lddev"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200/75 text-slate-500 hover:text-slate-800 px-3.5 py-1.5 rounded-xl transition-all font-medium border border-slate-200/40 cursor-pointer font-sans"
            >
              <Code className="w-3.5 h-3.5 text-[#2b9348]" />
              <span>Сделано @c0lddev</span>
            </a>
          </div>
        </div>
      </div>
    </main>
  )
}

