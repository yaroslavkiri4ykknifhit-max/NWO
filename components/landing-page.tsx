"use client"

import { useEffect, useRef } from "react"
import { ArrowDown, ArrowRight, Check, LockKeyhole } from "lucide-react"

function ScrollReactiveBackground() {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)")
    let stopTimer = 0

    const stopVideo = () => {
      window.clearTimeout(stopTimer)
      video.pause()
    }

    const handleScroll = () => {
      if (reducedMotion.matches) return

      if (video.paused) {
        void video.play().catch(() => {
          // Muted inline video normally needs no permission. The poster remains
          // visible if a browser still blocks playback.
        })
      }

      window.clearTimeout(stopTimer)
      stopTimer = window.setTimeout(stopVideo, 90)
    }

    const handleVisibility = () => {
      if (document.hidden) stopVideo()
    }

    video.pause()
    window.addEventListener("scroll", handleScroll, { passive: true })
    document.addEventListener("visibilitychange", handleVisibility)

    return () => {
      stopVideo()
      window.removeEventListener("scroll", handleScroll)
      document.removeEventListener("visibilitychange", handleVisibility)
    }
  }, [])

  return (
    <div className="landing-motion-background" aria-hidden="true">
      <video
        ref={videoRef}
        className="landing-motion-video"
        muted
        loop
        playsInline
        preload="auto"
        poster="/flash-cut-poster.jpg"
        disablePictureInPicture
      >
        <source src="/flash-cut.mp4" type="video/mp4" />
      </video>
      <div className="landing-motion-shade" />
      <div className="landing-motion-noise" />
    </div>
  )
}

export function LandingPage() {
  return (
    <main className="landing-shell">
      <ScrollReactiveBackground />

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

      <section className="landing-hero">
        <div className="landing-hero-copy">
          <p className="landing-eyebrow">Деньги любят систему</p>
          <h1>Продажи — не талант. Это система.</h1>
          <p className="landing-hero-description">
            Забери базу бесплатно. Разбери механику сделки, перестань
            импровизировать и начни управлять разговором.
          </p>
          <div className="landing-hero-actions">
            <a href="/free/" className="landing-button landing-button-light">
              Начать бесплатно <ArrowRight size={18} />
            </a>
            <a href="/premium/" className="landing-button landing-button-ghost">
              NWO BLACK <LockKeyhole size={16} />
            </a>
          </div>
        </div>

        <div className="landing-scroll-cue" aria-hidden="true">
          <span>Двигай страницу</span>
          <ArrowDown size={17} />
        </div>
      </section>

      <section className="landing-statement">
        <div className="landing-statement-inner">
          <span className="landing-statement-number">02</span>
          <p className="landing-eyebrow">Фокус решает</p>
          <h2>Движение начинается только тогда, когда двигаешься ты.</h2>
          <p>
            Один разговор может изменить всю сделку. Не больше слов — больше
            точности, контроля и понимания реального мотива клиента.
          </p>
        </div>
      </section>

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
