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
const CYCLE_DURATION = 5.4 // секунд на полный цикл
const WRITE_FINISH_TIME = 3.4 // когда заканчивается последняя буква

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

    // Предварительно вычисляем длины штрихов
    const lengths = maskStrokesRef.current.map((path) => {
      try {
        return path ? path.getTotalLength() : 1
      } catch {
        return 1
      }
    })

    const tick = (now: number) => {
      const elapsedRaw = (now - startTime) / 1000
      const elapsed = loop ? elapsedRaw % CYCLE_DURATION : elapsedRaw

      if (!loop && elapsedRaw >= WRITE_FINISH_TIME && !completedCalledRef.current) {
        completedCalledRef.current = true
        if (onComplete) onComplete()
      }

      for (let i = 0; i < LETTERS.length; i++) {
        const letter = LETTERS[i]
        const strokeEl = maskStrokesRef.current[i]
        const glyphEl = glyphsRef.current[i]
        if (!strokeEl || !glyphEl) continue

        const len = lengths[i] || 1

        if (elapsed < letter.delay) {
          // Буква еще не началась — АБСОЛЮТНО НЕВИДИМА
          glyphEl.style.opacity = "0"
          strokeEl.setAttribute("stroke-dashoffset", "1")
        } else if (elapsed >= letter.delay && elapsed < letter.delay + letter.dur) {
          // Буква пишется чернилами прямо сейчас
          const rawP = (elapsed - letter.delay) / letter.dur
          const p = Math.max(0, Math.min(1, rawP))

          glyphEl.style.opacity = "1"
          strokeEl.setAttribute("stroke-dashoffset", String(1 - p))
        } else {
          // Буква уже полностью написана — остается черной на листе
          glyphEl.style.opacity = "1"
          strokeEl.setAttribute("stroke-dashoffset", "0")
        }
      }

      // Мягкое угасание перед повтором цикла в режиме loop
      if (svgRef.current && loop) {
        if (elapsed > 5.0) {
          const fadeOutProgress = (elapsed - 5.0) / 0.4
          svgRef.current.style.opacity = String(1 - fadeOutProgress)
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
      <div className="w-full max-w-2xl px-6 flex items-center justify-center">
        <svg
          ref={svgRef}
          viewBox="0 0 650 340"
          className="w-full h-auto overflow-visible select-none"
          style={{ transition: "opacity 0.2s linear" }}
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
