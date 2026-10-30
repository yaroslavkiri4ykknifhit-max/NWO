import Link from "next/link";
import { ArrowDown, ArrowUpRight, Plus } from "lucide-react";
import {
  bootcampFaq,
  eventContactHref,
  eventProgram,
} from "@/lib/bootcamp-content";
import { SiteHeader, SiteFooter } from "@/components/site-shell";
import { LandingMotion } from "@/components/landing-motion";
import { BrandPlaceholder } from "@/components/brand";

const formats = [
  {
    name: "Открытая база",
    price: "$0",
    detail: "Самостоятельный старт",
    text: "Первый контакт, потребность и ценность. Уроки без регистрации, прогресс — в твоём браузере.",
    href: "/free/",
    cta: "Открыть уроки",
  },
  {
    name: "NWO Black",
    price: "$17",
    detail: "Глубже в переговоры",
    text: "Работа с ценой, возражениями и закрытием сделок. Доступ по email и инвайт-коду, сохранение прогресса.",
    href: "/premium/",
    cta: "Посмотреть Black",
  },
  {
    name: "Менторство",
    price: "$170",
    detail: "Один на один / 30 дней",
    text: "Личные созвоны, разбор твоих диалогов и обратная связь в Telegram. Работаем с твоими задачами.",
    href: "/mentorship/",
    cta: "Как это устроено",
  },
];

export function LandingPage() {
  return (
    <div className="editorial-site home-site">
      <SiteHeader />
      <LandingMotion>
        <main id="main-content">
          <section className="opening-scene" aria-labelledby="hero-title">
            <div className="opening-sticky">
              <div className="opening-copy">
                <div className="opening-meta">
                  <span>New Way Out / Обучение продажам</span>
                  <span>Открытый онлайн-эфир</span>
                </div>
                <h1 id="hero-title" className="opening-title">
                  <span>ОТ КОНТАКТА</span>
                  <span>ДО СДЕЛКИ.</span>
                </h1>
                <div className="opening-bottom">
                  <div>
                    <p>
                      Пойми клиента.
                      <br />
                      Покажи ценность.
                      <br />
                      Договорись о следующем шаге.
                    </p>
                    <a
                      href={eventContactHref}
                      className="site-button"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      На бесплатный эфир <ArrowUpRight size={20} aria-hidden />
                    </a>
                    <small>С Ярославом Киричуком. Можно без опыта.</small>
                  </div>
                  <a className="scroll-cue" href="#approach">
                    <ArrowDown size={23} aria-hidden />
                    <span>Листай вниз</span>
                  </a>
                </div>
              </div>
              <div className="opening-poster" aria-hidden="true">
                <div className="poster-top">
                  <span>Меньше случайностей.</span>
                  <span>Больше системы.</span>
                </div>
                <div className="signal-symbol">
                  <svg viewBox="0 0 400 500" fill="none">
                    <path
                      d="M40 400 305 135M72 135h233v233"
                      stroke="currentColor"
                      strokeWidth="88"
                    />
                  </svg>
                  <div className="signal-echo" />
                </div>
                <div className="poster-bottom">
                  <span>
                    Твой следующий
                    <br />
                    разговор будет другим.
                  </span>
                  <b>NWO®</b>
                </div>
                <div className="poster-shutter" />
              </div>
              <div className="scene-index" aria-hidden="true">
                Навык в движении <span>↓</span>
              </div>
            </div>
          </section>

          <section id="approach" className="approach-section site-container">
            <div className="section-kicker">
              <span>Подход NWO</span>
              <span>Продажи начинаются с понимания</span>
            </div>
            <h2 className="manifesto" data-ink>
              НЕ ИСКАТЬ
              <br />
              НУЖНЫЕ СЛОВА.
              <br />
              ПОНИМАТЬ,
              <br />
              ЧТО ЗА НИМИ.
            </h2>
            <div className="approach-bottom">
              <span className="asterisk" aria-hidden="true">
                ✳
              </span>
              <div>
                <p>
                  «Дорого». «Я подумаю». «Скиньте информацию». Знакомо? Вместо
                  волшебных скриптов — понятная структура разговора.
                </p>
                <p>
                  Узнай, что нужно человеку, свяжи предложение с его задачей и
                  закончи диалог конкретной договорённостью. Без давления и
                  бесконечных скидок.
                </p>
                <Link className="site-text-link" href="/free/#first-lesson">
                  Посмотреть бесплатный урок{" "}
                  <ArrowUpRight size={19} aria-hidden />
                </Link>
              </div>
            </div>
          </section>

          <section id="program" className="program-section">
            <div className="site-container program-layout">
              <div className="program-heading">
                <span className="site-eyebrow">Программа эфира</span>
                <h2>
                  ПЯТЬ ШАГОВ.
                  <br />
                  ОДИН
                  <br />
                  ДИАЛОГ.
                </h2>
                <p>
                  Разберём путь от первого сообщения до следующего действия. С
                  примерами, которые можно адаптировать к своему продукту.
                </p>
                <a
                  href={eventContactHref}
                  className="site-text-link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Участвовать бесплатно <ArrowUpRight size={19} aria-hidden />
                </a>
              </div>
              <div className="program-steps">
                {eventProgram.map((item, i) => (
                  <article className="program-step" key={item.tag} data-step>
                    <div className="step-top">
                      <span>0{i + 1}</span>
                      <span>{item.tag.toLocaleLowerCase("ru")}</span>
                      <ArrowDown size={20} aria-hidden />
                    </div>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                    <details>
                      <summary>
                        Что внутри <Plus size={17} aria-hidden />
                      </summary>
                      <ul>
                        {item.points.map((point) => (
                          <li key={point}>{point}</li>
                        ))}
                      </ul>
                    </details>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <section id="host" className="host-section site-container">
            <div className="host-art">
              <BrandPlaceholder variant="portrait" />
              <span className="host-art-caption">
                Личный опыт → понятная система
              </span>
            </div>
            <div className="host-copy">
              <span className="site-eyebrow">Кто ведёт</span>
              <h2>
                ЯРОСЛАВ
                <br />
                КИРИЧУК.
              </h2>
              <span className="host-role">Автор NWO / New Way Out</span>
              <p>
                Мои первые звонки были неуверенными, а цену я называл
                извиняющимся тоном. Всё изменилось, когда я стал меньше
                рассказывать о продукте и больше спрашивать.
              </p>
              <blockquote>
                «Клиенту важен не список характеристик. Ему нужно решение своей
                задачи».
              </blockquote>
              <p>
                Этот опыт я собрал в открытую базу, Black и личное менторство.
                На эфире разберём эту логику по шагам.
              </p>
              <Link href="/blog/how-i-made-11k/" className="site-text-link">
                Моя история в журнале <ArrowUpRight size={19} aria-hidden />
              </Link>
            </div>
          </section>

          <section id="formats" className="formats-section">
            <div className="site-container">
              <div className="formats-heading">
                <h2>
                  ТВОЙ ТЕМП.
                  <br />
                  ТВОЙ МАРШРУТ.
                </h2>
                <p>
                  Начни бесплатно.
                  <br />
                  Продолжение выбираешь сам.
                </p>
              </div>
              <div className="format-grid">
                {formats.map((format, i) => (
                  <article
                    className={`format-card format-card-${i}`}
                    key={format.name}
                  >
                    <div className="format-top">
                      <span>{format.detail}</span>
                      <ArrowUpRight size={22} aria-hidden />
                    </div>
                    <h3>{format.name}</h3>
                    <strong className="format-price">{format.price}</strong>
                    <p>{format.text}</p>
                    <Link href={format.href} className="format-link">
                      {format.cta}
                      <ArrowUpRight size={20} aria-hidden />
                    </Link>
                  </article>
                ))}
              </div>
              <p className="format-note">
                Black и менторство — отдельные форматы. Для участия в бесплатном
                эфире покупать их не нужно.
              </p>
            </div>
          </section>

          <section className="journal-teaser site-container">
            <div>
              <span className="site-eyebrow">Журнал NWO</span>
              <h2>
                ОТ ОПЫТА
                <br />К ПРАКТИКЕ.
              </h2>
            </div>
            <div className="teaser-links">
              <Link href="/blog/how-i-made-11k/">
                <span>Как я пришёл в продажи</span>
                <ArrowUpRight aria-hidden />
              </Link>
              <Link href="/blog/why-managers-burn-out/">
                <span>Почему структура важнее импровизации</span>
                <ArrowUpRight aria-hidden />
              </Link>
              <Link href="/blog/" className="all-posts">
                Все материалы
                <ArrowUpRight size={18} aria-hidden />
              </Link>
            </div>
          </section>

          <section id="faq" className="faq-section site-container">
            <h2>
              ЕСТЬ
              <br />
              ВОПРОСЫ?
            </h2>
            <div>
              {bootcampFaq.map((item) => (
                <details key={item.question}>
                  <summary>
                    {item.question}
                    <Plus size={22} aria-hidden />
                  </summary>
                  <p>{item.answer}</p>
                </details>
              ))}
            </div>
          </section>

          <section id="pricing" className="event-closing">
            <div className="site-container">
              <div className="closing-meta">
                <span>Онлайн. Бесплатно. По делу.</span>
                <span>Дата и время уточняются</span>
              </div>
              <h2>
                НАЧНИ
                <br />С ДИАЛОГА.
              </h2>
              <div className="closing-bottom">
                <p>
                  Напиши «ЭФИР» Ярославу в Telegram.
                  <br />
                  Уточни расписание, площадку и ссылку на участие.
                </p>
                <a
                  href={eventContactHref}
                  className="site-button"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Записаться через Telegram
                  <ArrowUpRight size={22} aria-hidden />
                </a>
              </div>
              <p className="closing-note">
                Отправь подготовленное сообщение в чате — кнопка сама по себе не
                завершает запись. Наличие записи эфира уточни у Ярослава.
              </p>
            </div>
          </section>
        </main>
      </LandingMotion>
      <SiteFooter />
    </div>
  );
}
