import Link from "next/link";
import { ArrowDown, ArrowRight, ArrowUpRight, Plus } from "lucide-react";
import { SiteHeader, SiteFooter, contactHref } from "@/components/site-shell";
import { CinematicMotion } from "@/components/cinematic-motion";
import { salesFaq } from "@/lib/site-content";
import { FreeLessonPoster } from "@/components/free-lesson-poster";

export function LandingPage() {
  return (
    <div className="editorial-site">
      <SiteHeader />
      <CinematicMotion>
        <main id="main-content">
          <section className="cinema-hero">
            <div className="hero-art" data-parallax aria-hidden="true">
              <img
                src="/art/impasto-blue.webp"
                alt=""
                width="1672"
                height="941"
                fetchPriority="high"
              />
            </div>
            <div className="site-container hero-stage">
              <div className="hero-overline">
                <span className="site-eyebrow">
                  <i />
                  Школа практических продаж
                </span>
                <span className="edition-label">NEW WAY OUT / 01</span>
              </div>
              <div className="cinema-copy">
                <h1>
                  Продажи —<br />
                  искусство
                  <br />
                  <em>понимать.</em>
                </h1>
                <p>
                  Научись слышать клиента, объяснять ценность
                  <br className="desktop-break" /> и уверенно вести разговор к
                  сделке.
                </p>
                <div className="site-actions">
                  <Link className="site-button" href="/free/#first-lesson">
                    Начать бесплатно <ArrowUpRight size={18} />
                  </Link>
                  <a className="site-text-link" href="#formats">
                    Выбрать формат <ArrowRight size={17} />
                  </a>
                </div>
                <span className="hero-caption">
                  От первого контакта до уверенных переговоров.
                </span>
              </div>
              <div className="hero-bottom">
                <a href="#approach">
                  <ArrowDown size={16} /> ДАЛЬШЕ — ПРАКТИКА
                </a>
                <span>Меньше теории. Больше диалога.</span>
                <span>SCROLL TO EXPLORE</span>
              </div>
            </div>
          </section>
          <section
            id="approach"
            className="site-container site-section approach-section"
            data-reveal
          >
            <FreeLessonPoster />
          </section>
          <section id="formats" className="formats-section">
            <div className="site-container site-section">
              <div className="section-heading" data-reveal>
                <span className="site-eyebrow">02 / Твой следующий шаг</span>
                <h2>
                  Выбери свою
                  <br />
                  <em>глубину.</em>
                </h2>
                <p>
                  Начни с открытой базы. Иди глубже самостоятельно или работай с
                  наставником.
                </p>
              </div>
              <div className="format-grid">
                <article className="format-card" data-reveal>
                  <div className="format-top">
                    <span>01 / ЗНАКОМСТВО</span>
                    <span>ОТКРЫТЫЙ ДОСТУП</span>
                  </div>
                  <h3>База.</h3>
                  <p>Первый контакт, вопросы и основа работы с возражениями.</p>
                  <div className="format-price">
                    Бесплатно<span>Без регистрации</span>
                  </div>
                  <Link
                    href="/free/#first-lesson"
                    className="site-button site-button-outline"
                  >
                    Открыть курс <ArrowUpRight size={17} />
                  </Link>
                </article>
                <article className="format-card format-black" data-reveal>
                  <div className="format-card-art" aria-hidden="true" />
                  <div className="format-top">
                    <span>02 / ПОГРУЖЕНИЕ</span>
                    <span>NWO BLACK</span>
                  </div>
                  <h3>Глубже.</h3>
                  <p>
                    Переговоры, работа с ценой и инструменты закрытия сделок.
                  </p>
                  <div className="format-price">
                    $17<span>Стоимость доступа</span>
                  </div>
                  <Link href="/premium/" className="site-button">
                    Открыть Black <ArrowUpRight size={17} />
                  </Link>
                </article>
                <article className="format-card" data-reveal>
                  <div className="format-top">
                    <span>03 / ЛИЧНАЯ РАБОТА</span>
                    <span>ОДИН НА ОДИН</span>
                  </div>
                  <h3>С наставником.</h3>
                  <p>
                    Твои переговоры, разбор ошибок и персональная обратная
                    связь.
                  </p>
                  <div className="format-price">
                    $170<span>30 дней работы</span>
                  </div>
                  <Link
                    href="/mentorship/"
                    className="site-button site-button-outline"
                  >
                    О менторстве <ArrowUpRight size={17} />
                  </Link>
                </article>
              </div>
            </div>
          </section>
          <section
            className="site-container founder-strip site-section"
            data-reveal
          >
            <div className="founder-avatar">
              <img
                src="/founder.jpg"
                width="120"
                height="120"
                alt="Ярослав Киричук"
                loading="lazy"
              />
            </div>
            <div>
              <span className="site-eyebrow">Автор NWO / Ярослав Киричук</span>
              <h2>
                Работаем с тем,
                <br />
                <em>что происходит у тебя.</em>
              </h2>
            </div>
            <p>
              Здесь продажи разбираются на конкретных ситуациях: первый контакт,
              ответ клиента, цена и следующий шаг.
              <a
                href={contactHref}
                target="_blank"
                rel="noopener noreferrer"
                className="site-text-link"
              >
                Познакомиться <ArrowUpRight size={17} />
              </a>
            </p>
          </section>
          <section
            className="site-container site-section faq-section"
            data-reveal
          >
            <div className="section-heading">
              <span className="site-eyebrow">03 / Перед стартом</span>
              <h2>
                Осталось
                <br />
                <em>пару вопросов?</em>
              </h2>
            </div>
            <div className="faq-list">
              {salesFaq.map((item) => (
                <details key={item.question}>
                  <summary>
                    {item.question}
                    <Plus size={18} />
                  </summary>
                  <p>{item.answer}</p>
                </details>
              ))}
            </div>
          </section>
          <section className="closing-section" data-reveal>
            <div className="site-container">
              <span className="site-eyebrow">NEW WAY OUT</span>
              <h2>
                Хороший разговор
                <br />
                начинается <em>с тебя.</em>
              </h2>
              <Link href="/free/#first-lesson" className="site-button">
                Начать бесплатно <ArrowUpRight size={18} />
              </Link>
              <span className="site-microcopy">
                Открой первый урок. Попробуй в следующем диалоге.
              </span>
            </div>
          </section>
        </main>
      </CinematicMotion>
      <SiteFooter />
    </div>
  );
}
