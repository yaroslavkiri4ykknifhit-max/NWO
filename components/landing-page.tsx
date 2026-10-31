import Link from "next/link";
import { ArrowDown, ArrowUpRight, Plus } from "lucide-react";
import {
  bootcampFaq,
  eventContactHref,
  eventProgram,
} from "@/lib/bootcamp-content";
import { SiteHeader, SiteFooter } from "@/components/site-shell";
import { LandingMotion } from "@/components/landing-motion";
import { TelegramCTA, StickyTelegramCTA } from "@/components/telegram-cta";

const formats = [
  {
    name: "Открытая база",
    price: "$0",
    detail: "Без регистрации",
    text: "Первый контакт, потребность и ценность. Учись в своём темпе — прогресс останется в твоём браузере.",
    href: "/free/",
    cta: "Открыть уроки",
  },
  {
    name: "NWO Black",
    price: "$17",
    detail: "Самостоятельное обучение",
    text: "Глубже в переговоры: цена, возражения и закрытие сделок. Доступ по email и инвайт-коду.",
    href: "/premium/",
    cta: "Программа Black",
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

function SectionLabel({
  number,
  children,
}: {
  number: string;
  children: React.ReactNode;
}) {
  return (
    <div className="section-label">
      <span>{number} /</span>
      <span>{children}</span>
    </div>
  );
}

export function LandingPage() {
  return (
    <div className="editorial-site home-site">
      <SiteHeader />
      <LandingMotion>
        <main id="main-content">
          <section
            id="hero"
            className="cover site-container"
            aria-labelledby="hero-title"
          >
            <div className="cover-meta">
              <span>New Way Out — практика продаж</span>
              <span>Понимание. Система. Действие.</span>
            </div>
            <h1 id="hero-title" className="cover-title">
              <span className="title-mask">
                <span>ПРОДАЖИ —</span>
              </span>
              <span className="title-mask">
                <span>ЭТО НАВЫК.</span>
              </span>
              <span className="title-mask title-outline">
                <span>НЕ СЛУЧАЙНОСТЬ.</span>
              </span>
            </h1>
            <div className="cover-bottom">
              <a href="#approach" className="cover-scroll">
                <ArrowDown size={22} aria-hidden />
                <span>
                  От первого контакта
                  <br />
                  до сделки
                </span>
              </a>
              <div className="cover-description">
                <p>
                  Учись понимать клиентов, работать с возражениями и уверенно
                  вести разговор к сделке.
                </p>
                <TelegramCTA placement="hero" />
                <span className="site-microcopy">
                  Telegram-канал NWO. Твой следующий шаг.
                </span>
              </div>
              <div className="cover-seal" aria-hidden="true">
                <span>NWO</span>
                <small>
                  NEW WAY OUT®
                  <br />
                  SALES PRACTICE
                </small>
              </div>
            </div>
            <div className="cover-footnote">
              <span>Навык, который остаётся с тобой.</span>
              <span>Листай, чтобы разобраться ↓</span>
            </div>
          </section>

          <section id="approach" className="objections-section site-container">
            <SectionLabel number="01">Знакомый разговор</SectionLabel>
            <div className="objections-layout">
              <h2 className="objection-words" data-reveal>
                <span>«ДОРОГО».</span>
                <span>«Я ПОДУМАЮ».</span>
                <span>
                  «СКИНЬТЕ
                  <br />
                  ИНФОРМАЦИЮ».
                </span>
              </h2>
              <div className="objections-copy">
                <span className="small-cross" aria-hidden>
                  ↗
                </span>
                <h3>
                  За каждым ответом
                  <br />
                  есть причина.
                </h3>
                <p>
                  Вместо волшебных скриптов — понятная структура разговора.
                  Узнай, что нужно человеку, свяжи предложение с его задачей и
                  договорись о следующем шаге.
                </p>
                <p>Без давления и бесконечных скидок.</p>
                <Link className="site-text-link" href="/free/#first-lesson">
                  Посмотреть бесплатный урок{" "}
                  <ArrowUpRight size={18} aria-hidden />
                </Link>
              </div>
            </div>
          </section>

          <section id="program" className="method-section">
            <div className="site-container">
              <SectionLabel number="02">Система NWO</SectionLabel>
              <div className="section-heading">
                <h2 data-reveal>
                  ПЯТЬ ШАГОВ.
                  <br />
                  <span>ОДИН ДИАЛОГ.</span>
                </h2>
                <p>
                  От первого сообщения до конкретной договорённости. Структура,
                  которую можно адаптировать к своему продукту.
                </p>
              </div>
              <div className="method-list">
                {eventProgram.map((item, i) => (
                  <details className="method-row" key={item.tag} open={i === 0}>
                    <summary>
                      <span className="method-number">0{i + 1}</span>
                      <span className="method-name">{item.tag}</span>
                      <span className="method-title">{item.title}</span>
                      <Plus size={23} aria-hidden />
                    </summary>
                    <div className="method-detail">
                      <p>{item.description}</p>
                      <ul>
                        {item.points.map((point) => (
                          <li key={point}>{point}</li>
                        ))}
                      </ul>
                    </div>
                  </details>
                ))}
              </div>
              <div className="method-after">
                <span>Понимать разговор. Управлять следующим шагом.</span>
                <TelegramCTA placement="midpage" />
              </div>
            </div>
          </section>

          <section id="host" className="author-section site-container">
            <SectionLabel number="03">Человек за проектом</SectionLabel>
            <div className="author-grid">
              <div className="author-title">
                <h2 data-reveal>
                  ЯРОСЛАВ
                  <br />
                  КИРИЧУК<span aria-hidden="true">↗</span>
                </h2>
                <p>Автор NWO / New Way Out</p>
                <div className="author-note">
                  <span>Личный опыт, собранный в систему.</span>
                  <span>Y. K. / NWO®</span>
                </div>
              </div>
              <div className="author-copy">
                <p>
                  Мои первые звонки были неуверенными, а цену я называл
                  извиняющимся тоном. Всё изменилось, когда я стал меньше
                  рассказывать о продукте и больше спрашивать.
                </p>
                <blockquote>
                  «Клиенту важен не список характеристик. Ему нужно решение
                  своей задачи».
                </blockquote>
                <p>
                  Этот опыт я собрал в открытую базу, Black и личное менторство.
                  На эфире разберём эту логику по шагам.
                </p>
                <Link href="/blog/how-i-made-11k/" className="site-text-link">
                  Моя история целиком <ArrowUpRight size={18} aria-hidden />
                </Link>
              </div>
            </div>
          </section>

          <section id="formats" className="editions-section">
            <div className="site-container">
              <SectionLabel number="04">Форматы обучения</SectionLabel>
              <div className="section-heading">
                <h2 data-reveal>
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
              <div className="editions-list">
                {formats.map((format, i) => (
                  <article className="edition-row" key={format.name}>
                    <span className="edition-number">0{i + 1}</span>
                    <div className="edition-name">
                      <span>{format.detail}</span>
                      <h3>{format.name}</h3>
                    </div>
                    <p>{format.text}</p>
                    <strong>{format.price}</strong>
                    <Link
                      href={format.href}
                      data-program-link={format.name}
                      className="edition-link"
                    >
                      <span>{format.cta}</span>
                      <ArrowUpRight size={23} aria-hidden />
                    </Link>
                  </article>
                ))}
              </div>
              <p className="edition-note">
                Black и менторство — отдельные форматы. Для участия в бесплатном
                эфире покупать их не нужно.
              </p>
            </div>
          </section>

          <section id="practice" className="practice-section site-container">
            <SectionLabel number="05">Из теории в практику</SectionLabel>
            <div className="practice-grid">
              <div>
                <h2 data-reveal>
                  СНАЧАЛА
                  <br />
                  ПОПРОБУЙ.
                </h2>
                <p>
                  Познакомься с подходом NWO до выбора платного формата: открой
                  урок или прочитай историю автора.
                </p>
                <Link
                  href="/free/#first-lesson"
                  className="site-button site-button-outline"
                >
                  Первый урок бесплатно <ArrowUpRight size={20} aria-hidden />
                </Link>
              </div>
              <div className="practice-links">
                <Link href="/blog/how-i-made-11k/">
                  <span className="site-eyebrow">01 / Личный опыт</span>
                  <h3>
                    Как я пришёл
                    <br />в продажи
                  </h3>
                  <ArrowUpRight size={28} aria-hidden />
                </Link>
                <Link href="/blog/why-managers-burn-out/">
                  <span className="site-eyebrow">02 / Журнал NWO</span>
                  <h3>
                    Почему менеджеры
                    <br />
                    выгорают
                  </h3>
                  <ArrowUpRight size={28} aria-hidden />
                </Link>
                <Link href="/blog/" className="site-text-link">
                  Все материалы <ArrowUpRight size={18} aria-hidden />
                </Link>
              </div>
            </div>
          </section>

          <section id="faq" className="questions-section site-container">
            <SectionLabel number="06">Перед первым шагом</SectionLabel>
            <div className="questions-grid">
              <h2>
                ЕСТЬ
                <br />
                ВОПРОСЫ?
              </h2>
              <div className="questions-list">
                {bootcampFaq.map((item) => (
                  <details key={item.question}>
                    <summary>
                      {item.question}
                      <Plus size={21} aria-hidden />
                    </summary>
                    <p>{item.answer}</p>
                  </details>
                ))}
                <a
                  href={eventContactHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="site-text-link"
                >
                  Записаться через Telegram{" "}
                  <ArrowUpRight size={18} aria-hidden />
                </a>
              </div>
            </div>
          </section>

          <section id="pricing" className="next-step-section">
            <div className="site-container">
              <SectionLabel number="07">Дальше — твой ход</SectionLabel>
              <h2 data-reveal>
                ТВОЙ
                <br />
                СЛЕДУЮЩИЙ ШАГ.
              </h2>
              <TelegramCTA placement="footer" className="telegram-finale">
                TELEGRAM
              </TelegramCTA>
              <div className="next-step-note">
                <span>New Way Out / Практика продаж</span>
                <span>Начни с одного решения.</span>
              </div>
            </div>
          </section>
        </main>
      </LandingMotion>
      <SiteFooter />
      <StickyTelegramCTA />
    </div>
  );
}
