"use client"

import { motion } from "motion/react"

interface HandwrittenLoaderProps {
  statusText?: string
  subText?: string
}

export function HandwrittenLoader({
  statusText = "Входим в систему...",
  subText = "Проверяем доступ в Telegram и открываем кабинет",
}: HandwrittenLoaderProps) {
  // Каллиграфические кривые для "New Way Out"
  // Продуманные изящные петли и соединения рукописного письма (ручка / перьевая подпись)
  const pathN = "M 45 92 C 45 45, 60 28, 78 28 C 96 28, 72 95, 88 95 C 104 95, 122 34, 138 34 L 138 95"
  const pathEw = "M 138 72 C 148 60, 168 60, 168 76 C 168 94, 146 94, 158 94 C 170 94, 180 72, 192 72 C 204 72, 198 94, 210 94 C 218 94, 228 72, 240 72 C 252 72, 246 94, 258 88"

  const pathW = "M 295 38 C 302 70, 312 95, 324 95 C 336 95, 348 52, 360 52 C 372 52, 382 95, 394 95 C 406 95, 420 44, 432 38"
  const pathAy = "M 432 78 C 426 66, 410 66, 410 79 C 410 91, 436 91, 448 91 C 448 72, 448 66, 448 95 M 448 74 C 460 66, 472 66, 478 78 C 484 90, 484 95, 490 95 C 496 95, 506 70, 512 70 C 518 70, 512 100, 500 122 C 488 142, 472 136, 478 124 C 484 110, 518 92, 530 92"

  const pathO = "M 575 62 C 552 62, 546 95, 575 95 C 602 95, 602 62, 575 62"
  const pathUt = "M 590 74 C 596 66, 608 66, 614 80 C 620 94, 632 94, 642 74 L 642 95 M 654 48 L 654 95 C 654 100, 666 100, 672 94 M 642 66 L 670 66"

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white/95 backdrop-blur-md font-ui text-[#121212] p-4 sm:p-6 select-none animate-in fade-in duration-300">
      <div className="w-full max-w-xl border-2 border-black p-8 sm:p-12 bg-[#fafaf9] shadow-2xl text-center relative overflow-hidden">
        
        {/* Newspaper Top Issue Strip */}
        <div className="flex items-center justify-between border-b border-gray-300 pb-4 mb-6 text-[10px] font-bold uppercase tracking-[0.25em] text-gray-500">
          <span>Читательский билет · Авторизация</span>
          <span className="flex items-center gap-1.5 text-black">
            <span className="w-2 h-2 rounded-full bg-red-600 animate-ping" />
            ВХОД
          </span>
        </div>

        {/* The Animated Signature Canvas */}
        <div className="relative w-full py-4 sm:py-6 flex items-center justify-center">
          <svg
            viewBox="30 15 650 135"
            className="w-full max-w-[520px] h-auto overflow-visible select-none drop-shadow-sm"
          >
            {/* Ruled guide notebook line */}
            <line
              x1="35"
              y1="97"
              x2="675"
              y2="97"
              stroke="#e5e5e5"
              strokeWidth="1.2"
              strokeDasharray="4 4"
            />

            {/* Faint pencil trace */}
            <path
              d={`${pathN} ${pathEw} ${pathW} ${pathAy} ${pathO} ${pathUt}`}
              fill="none"
              stroke="#ececec"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Word: NEW */}
            <motion.path
              d={`${pathN} ${pathEw}`}
              fill="none"
              stroke="#000000"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{
                duration: 1.1,
                ease: [0.4, 0, 0.2, 1],
                repeat: Infinity,
                repeatDelay: 1.8,
              }}
            />

            {/* Word: WAY */}
            <motion.path
              d={`${pathW} ${pathAy}`}
              fill="none"
              stroke="#000000"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{
                duration: 1.2,
                delay: 0.8,
                ease: [0.4, 0, 0.2, 1],
                repeat: Infinity,
                repeatDelay: 1.8,
              }}
            />

            {/* Word: OUT */}
            <motion.path
              d={`${pathO} ${pathUt}`}
              fill="none"
              stroke="#000000"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{
                duration: 0.9,
                delay: 1.8,
                ease: [0.4, 0, 0.2, 1],
                repeat: Infinity,
                repeatDelay: 1.8,
              }}
            />
          </svg>
        </div>

        {/* Live Status Description */}
        <div className="mt-4 pt-6 border-t border-gray-300 space-y-2">
          <h3 className="text-2xl sm:text-3xl font-display font-bold text-black tracking-tight">
            {statusText}
          </h3>
          <p className="text-xs text-gray-600 font-ui max-w-sm mx-auto leading-relaxed">
            {subText}
          </p>
        </div>

        {/* Ink-flowing animated line */}
        <div className="mt-6 w-56 mx-auto h-1 bg-gray-200 overflow-hidden">
          <motion.div
            className="h-full bg-black"
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{
              repeat: Infinity,
              duration: 1.5,
              ease: "easeInOut",
            }}
          />
        </div>

        <p className="mt-4 text-[10px] uppercase font-bold tracking-[0.25em] text-gray-400">
          New Way Out · Личный кабинет
        </p>

      </div>
    </div>
  )
}
