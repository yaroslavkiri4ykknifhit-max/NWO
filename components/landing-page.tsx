"use client"

import { type CSSProperties, useEffect, useRef, useState } from "react"
import { ArrowDown, ArrowRight, Check, LockKeyhole, Play } from "lucide-react"

type ScrollGifSceneProps = {
  number: string
  eyebrow: string
  title: string
  description: string
  gifSrc: string
  posterSrc: string
  first?: boolean
}

function useSlowScroll() {
  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)")
    const coarsePointer = window.matchMedia("(pointer: coarse)")
    if (reducedMotion.matches || coarsePointer.matches) return

    let currentY = window.scrollY
    let targetY = window.scrollY
    let animationFrame = 0
    let animating = false

    const maxScroll = () => Math.max(0, document.documentElement.scrollHeight - window.innerHeight)

    const animate = () => {
      currentY += (targetY - currentY) * 0.085
      window.scrollTo(0, currentY)

      if (Math.abs(targetY - currentY) > 0.5) {
        animationFrame = window.requestAnimationFrame(animate)
      } else {
        window.scrollTo(0, targetY)
        currentY = targetY
        animating = false
      }
    }

    const handleWheel = (event: WheelEvent) => {
      if (event.ctrlKey || event.metaKey) return

      event.preventDefault()
      const multiplier = event.deltaMode === 1 ? 18 : event.deltaMode === 2 ? window.innerHeight : 1
      targetY = Math.min(maxScroll(), Math.max(0, targetY + event.deltaY * multiplier * 0.72))

      if (!animating) {
        currentY = window.scrollY
        animating = true
        animationFrame = window.requestAnimationFrame(animate)
      }
    }

    const handleNativeScroll = () => {
      if (!animating) {
        currentY = window.scrollY
        targetY = window.scrollY
      }
    }

    window.addEventListener("wheel", handleWheel, { passive: false })
    window.addEventListener("scroll", handleNativeScroll, { passive: true })

    return () => {
      window.cancelAnimationFrame(animationFrame)
      window.removeEventListener("wheel", handleWheel)
      window.removeEventListener("scroll", handleNativeScroll)
    }
  }, [])
}

function ScrollGifScene({
  number,
  eyebrow,
  title,
  description,
  gifSrc,
  posterSrc,
  first = false,
}: ScrollGifSceneProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let frame = 0

    const update = () => {
      const section = sectionRef.current
      if (!section) return

      const rect = section.getBoundingClientRect()
      const distance = Math.max(1, rect.height - window.innerHeight)
      const nextProgress = Math.min(1, Math.max(0, -rect.top / distance))
      setProgress(nextProgress)

      const insideScene = rect.top < window.innerHeight * 0.82 && rect.bottom > window.innerHeight * 0.18
      const hasStartedScrolling = first ? window.scrollY > 4 : rect.top < window.innerHeight * 0.75
      if (insideScene && hasStartedScrolling) setIsPlaying(true)
    }

    const handleScroll = () => {
      window.cancelAnimationFrame(frame)
      frame = window.requestAnimationFrame(update)
    }

    update()
    window.addEventListener("scroll", handleScroll, { passive: true })
    window.addEventListener("resize", handleScroll)
    return () => {
      window.cancelAnimationFrame(frame)
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("resize", handleScroll)
    }
  }, [first])

  const contentOpacity = Math.min(1, 0.42 + progress * 1.15)
  const contentOffset = Math.max(0, 26 - progress * 38)

  return (
    <section ref={sectionRef} className="landing-scene" aria-label={`${number}. ${eyebrow}`}>
      <div className="landing-scene-sticky">
        <img
          key={isPlaying ? "playing" : "poster"}
          src={isPlaying ? gifSrc : posterSrc}
          alt=""
          className="landing-scene-media"
          loading={first ? "eager" : "lazy"}
          aria-hidden="true"
        />
        <div className="landing-scene-shade" />
        <div className="landing-scene-grain" />

        <div
          className="landing-scene-copy"
          style={{
            opacity: contentOpacity,
            "--landing-copy-offset": `${contentOffset}px`,
          } as CSSProperties}
        >
          <p className="landing-scene-number">{number}</p>
          <p className="landing-eyebrow">{eyebrow}</p>
          <h1>{title}</h1>
          <p className="landing-scene-description">{description}</p>
          {first && (
            <div className="landing-hero-actions">
              <a href="/free/" className="landing-button landing-button-light">
                Начать бесплатно <ArrowRight size={18} />
              </a>
              <a href="/premium/" className="landing-button landing-button-ghost">
                NWO BLACK <LockKeyhole size={16} />
              </a>
            </div>
          )}
        </div>

        {!isPlaying && (
          <div className="landing-play-hint" aria-hidden="true">
            <Play size={13} fill="currentColor" />
            {first ? "Прокрути — кадр оживёт" : "Следующий кадр ждёт"}
          </div>
        )}

        {first && (
          <div className="landing-scroll-hint" aria-hidden="true">
            <span>Листай</span>
            <ArrowDown size={16} />
          </div>
        )}
      </div>
    </section>
  )
}

export function LandingPage() {
  useSlowScroll()

  return (
    <main className="landing-shell">
      <header className="landing-header">
        <a href="/" className="landing-logo" aria-label="NWO — главная">
          NWO<span>.</span>
        </a>
        <nav aria-label="Основная навигация">
          <a href="#program">Что внутри</a>
          <a href="/free/">Бесплатный курс</a>
          <a href="/premium/" className="landing-nav-black">
            NWO BLACK
          </a>
        </nav>
      </header>

      <ScrollGifScene
        number="01"
        eyebrow="Деньги любят систему"
        title="Продажи — не талант. Это система."
        description="Забери базу бесплатно. Разбери механику сделки, перестань импровизировать и начни управлять разговором."
        gifSrc="/landing-money.gif"
        posterSrc="/landing-money-poster.jpg"
        first
      />

      <ScrollGifScene
        number="02"
        eyebrow="Фокус решает"
        title="Один разговор может изменить всю сделку."
        description="Не больше слов — больше точности. Научись видеть мотив клиента, держать рамку и вести к решению без суеты."
        gifSrc="/landing-focus.gif"
        posterSrc="/landing-focus-poster.jpg"
      />

      <section id="program" className="landing-paths">
        <div className="landing-paths-heading">
          <p className="landing-eyebrow">Выбери глубину</p>
          <h2>Сначала база.<br />Потом — тяжёлая артиллерия.</h2>
          <p>
            Бесплатный курс открыт сразу. Никаких кодов, регистраций и Telegram.
            В NWO BLACK попадают только после оплаты.
          </p>
        </div>

        <div className="landing-path-grid">
          <article className="landing-path landing-path-free">
            <div>
              <span className="landing-path-label">Свободный доступ</span>
              <h3>NWO FREE</h3>
              <p>Крепкая база продаж, которую можно открыть прямо сейчас.</p>
            </div>
            <ul>
              <li><Check size={17} /> Без регистрации и кодов</li>
              <li><Check size={17} /> Уроки и модули из программы</li>
              <li><Check size={17} /> Прогресс сохраняется на устройстве</li>
            </ul>
            <a href="/free/" className="landing-path-action">
              Открыть бесплатный курс <ArrowRight size={18} />
            </a>
          </article>

          <article className="landing-path landing-path-black">
            <div className="landing-black-glow" />
            <div>
              <span className="landing-path-label"><LockKeyhole size={13} /> Закрытый контур</span>
              <h3>NWO <em>BLACK</em></h3>
              <p>Платная система для тех, кому уже мало просто «знать теорию».</p>
            </div>
            <ul>
              <li><Check size={17} /> Продвинутая программа</li>
              <li><Check size={17} /> Отдельный премиальный кабинет</li>
              <li><Check size={17} /> Доступ только после оплаты</li>
            </ul>
            <a href="/premium/" className="landing-path-action">
              Посмотреть NWO BLACK <ArrowRight size={18} />
            </a>
          </article>
        </div>
      </section>

      <section className="landing-final">
        <div className="landing-final-mark">NWO</div>
        <p className="landing-eyebrow">Хватит готовиться продавать</p>
        <h2>Открой первый урок.<br />Остальное станет ясно в процессе.</h2>
        <a href="/free/" className="landing-button landing-button-light">
          Войти в бесплатный курс <ArrowRight size={18} />
        </a>
      </section>

      <footer className="landing-footer">
        <span>NWO © {new Date().getFullYear()}</span>
        <span>Система обучения продажам</span>
      </footer>
    </main>
  )
}
