"use client"

import { useEffect, useRef } from "react"
import gothicData from "./gothic-data.json"

interface LetterData {
  char: string
  d: string
  stroke: string
  dur: number
  delay: number
}

interface GothicHandwrittenLoaderProps {
  onComplete?: () => void
  loop?: boolean
}

const LETTERS: LetterData[] = gothicData as LetterData[]
const CYCLE_DURATION = 6.8 // секунд на полный цикл (написание 4.94с + удержание 1.3с + плавный перезапуск)
const WRITE_FINISH_TIME = 4.94 // когда завершается написание слова Out

// Функция плавности Hermite Smoothstep (S-кривая) для естественного ускорения и замедления руки
function smoothstep(t: number): number {
  const clamped = Math.max(0, Math.min(1, t))
  return clamped * clamped * (3 - 2 * clamped)
}

export function GothicHandwrittenLoader({
  onComplete,
  loop = true,
}: GothicHandwrittenLoaderProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const maskStrokesRef = useRef<(SVGPathElement | null)[]>([])
  const glyphsRef = useRef<(SVGPathElement | null)[]>([])
  const completedCalledRef = useRef(false)

  useEffect(() => {
    let animId: number
    const startTime = performance.now()

    // Состояние каждой буквы: 0 = скрыта, 1 = пишется прямо сейчас, 2 = завершена
    const letterStates = new Array(LETTERS.length).fill(0)
    let lastCycle = -1

    const resetAll = () => {
      for (let i = 0; i < LETTERS.length; i++) {
        const glyphEl = glyphsRef.current[i]
        const strokeEl = maskStrokesRef.current[i]
        if (glyphEl) glyphEl.style.opacity = "0"
        if (strokeEl) strokeEl.style.strokeDashoffset = "1"
        letterStates[i] = 0
      }
      if (svgRef.current) svgRef.current.style.opacity = "1"
    }

    resetAll()

    const tick = (now: number) => {
      const totalElapsed = (now - startTime) / 1000
      const currentCycle = Math.floor(totalElapsed / CYCLE_DURATION)
      const elapsed = loop ? totalElapsed % CYCLE_DURATION : totalElapsed

      if (loop && currentCycle !== lastCycle) {
        lastCycle = currentCycle
        resetAll()
      }

      if (!loop && totalElapsed >= WRITE_FINISH_TIME && !completedCalledRef.current) {
        completedCalledRef.current = true
        if (onComplete) onComplete()
      }

      for (let i = 0; i < LETTERS.length; i++) {
        const letter = LETTERS[i]
        const strokeEl = maskStrokesRef.current[i]
        const glyphEl = glyphsRef.current[i]
        if (!strokeEl || !glyphEl) continue

        const state = letterStates[i]

        if (elapsed < letter.delay) {
          // Буква ждет очереди — на 100% невидима
          if (state !== 0) {
            glyphEl.style.opacity = "0"
            strokeEl.style.strokeDashoffset = "1"
            letterStates[i] = 0
          }
        } else if (elapsed >= letter.delay && elapsed < letter.delay + letter.dur) {
          // Буква пишется прямо сейчас на 60 FPS
          if (state === 0) {
            glyphEl.style.opacity = "1"
            letterStates[i] = 1
          }
          const rawProgress = (elapsed - letter.delay) / letter.dur
          const eased = smoothstep(rawProgress)
          // Обновляем напрямую через CSSOM style без вызова медленного setAttribute
          strokeEl.style.strokeDashoffset = (1 - eased).toFixed(5)
        } else {
          // Буква уже полностью написана
          if (state !== 2) {
            glyphEl.style.opacity = "1"
            strokeEl.style.strokeDashoffset = "0"
            letterStates[i] = 2
          }
        }
      }

      // Мягкое угасание перед повтором цикла в режиме loop
      if (svgRef.current && loop) {
        if (elapsed > 6.2) {
          const fadeOutProgress = (elapsed - 6.2) / 0.6
          svgRef.current.style.opacity = String(1 - Math.min(1, fadeOutProgress))
        } else {
          svgRef.current.style.opacity = "1"
        }
      }

      animId = requestAnimationFrame(tick)
    }

    animId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(animId)
  }, [loop, onComplete])

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white select-none overflow-hidden">
      <div 
        className="w-full max-w-2xl px-6 flex items-center justify-center"
        style={{
          willChange: "transform",
          transform: "translateZ(0)",
          WebkitFontSmoothing: "antialiased",
        }}
      >
        <svg
          ref={svgRef}
          viewBox="0 0 650 340"
          className="w-full h-auto overflow-visible select-none"
          style={{
            shapeRendering: "geometricPrecision",
            willChange: "transform",
            transform: "translateZ(0)",
            transition: "opacity 0.25s linear",
          }}
        >
          <defs>
            {LETTERS.map((letter, i) => (
              <mask
                key={`gothic-mask-${i}`}
                id={`gothic-mask-${i}`}
                maskUnits="userSpaceOnUse"
                x="0"
                y="0"
                width="650"
                height="340"
              >
                <rect width="650" height="340" fill="#000000" />
                <path
                  ref={(el) => {
                    maskStrokesRef.current[i] = el
                  }}
                  d={letter.stroke}
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="58"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  pathLength="1"
                  strokeDasharray="1"
                  strokeDashoffset="1"
                  style={{ willChange: "stroke-dashoffset" }}
                />
              </mask>
            ))}
          </defs>

          {/* Сами каноничные готические глифы UnifrakturMaguntia в две строки по центру */}
          <g>
            {LETTERS.map((letter, i) => (
              <path
                key={`glyph-${i}`}
                ref={(el) => {
                  glyphsRef.current[i] = el
                }}
                d={letter.d}
                fill="#000000"
                mask={`url(#gothic-mask-${i})`}
                style={{ opacity: 0 }}
              />
            ))}
          </g>
        </svg>
      </div>
    </div>
  )
}
