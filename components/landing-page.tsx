"use client";

import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  MessageCircle,
  Plus,
} from "lucide-react";
import {
  CourseFolio,
  SiteFooter,
  SiteHeader,
  contactHref,
} from "@/components/site-shell";

import { salesFaq } from "@/lib/site-content";

const skills = [
  [
    "Первый контакт",
    "Начать разговор так, чтобы тебя услышали. Без неловкого зачитывания скрипта.",
  ],
  [
    "Правильные вопросы",
    "Понять задачу клиента и критерии решения, прежде чем предлагать продукт.",
  ],
  [
    "Ценность и цена",
    "Объяснить, за что человек платит. Уверенно назвать стоимость и выдержать паузу.",
  ],
  [
    "Работа с сомнениями",
    "Разобраться, что стоит за «дорого» и «я подумаю», и договориться о следующем шаге.",
  ],
];
const programs = [
  {
    number: "01",
    name: "Бесплатная база",
    label: "Познакомиться с подходом",
    price: "$0",
    unit: "без регистрации",
    description:
      "Для первого шага в продажах. Разберись в логике разговора и попробуй её в работе.",
    features: [
      "Психология клиента и первый контакт",
      "Вопросы о потребностях",
      "Основа работы с возражениями",
    ],
    href: "/free/",
    cta: "Открыть бесплатный курс",
    className: "",
  },
  {
    number: "02",
    name: "NWO Black",
    label: "Углубить навык",
    price: "$17",
    unit: "стоимость доступа",
    description:
      "Для тех, кто хочет увереннее вести переговоры, объяснять цену и доводить диалог до решения.",
    features: [
      "Структура сложных переговоров",
      "Работа с ценой и сомнениями",
      "Материалы и инструменты для практики",
    ],
    href: "/premium/",
    cta: "Посмотреть NWO Black",
    className: "program-card-black",
  },
  {
    number: "03",
    name: "Менторство",
    label: "Работать лично со мной",
    price: "$170",
    unit: "30 дней вместе",
    description:
      "Персональный формат: твои звонки, твои вопросы, твоя задача. С обратной связью от Ярослава.",
    features: [
      "Индивидуальные созвоны",
      "Разбор переговоров и ошибок",
      "Подготовка резюме и собеседований",
    ],
    href: "/mentorship/",
    cta: "Узнать о менторстве",
    className: "",
  },
];
// Existing participant quotes are preserved verbatim. No invented identities,
// verification badges, stock portraits, or unsupported aggregate ratings.
const reviews = [
  {
    name: "Артем Воронов",
    role: "IT-решения и SaaS",
    date: "2026-09-14",
    dateLabel: "14 сентября 2026",
    text: "До NWO я сливал 7 из 10 звонков на фразе «пришлите КП на почту». После внедрения протокола первых 90 секунд конверсия в квалифицированную встречу выросла до 60%. Закрыл свой первый контракт на $4,200 через 2 недели. Ярослав научил не бояться называть цену.",
  },
  {
    name: "Максим Дмитрук",
    role: "Оптовые поставки",
    date: "2026-09-08",
    dateLabel: "8 сентября 2026",
    text: "Самый сильный блок — это сложные переговоры и отработка возражения «дорого». Раньше я сразу падал в цене и терял маржу. Сейчас клиенты платят без скидок и благодарят за экспертизу. Обучение окупилось буквально с одной первой сделки.",
  },
  {
    name: "Екатерина Белова",
    role: "Менеджер по продажам · EdTech",
    date: "2026-09-02",
    dateLabel: "2 сентября 2026",
    text: "Пошла на менторство с нуля, очень боялась звонить в холодную. Ярослав буквально за 3 созвона убрал дрожь в голосе и поставил правильные паузы. Через месяц прошла собеседование в топовую команду на удаленке с фиксом $700 + % от выручки. Спасибо огромное!",
  },
];

export function LandingPage() {
  return (
    <div className="editorial-site">
      <SiteHeader />
      <main id="main-content">
        <section className="site-container home-hero">
          <div className="hero-edition">
            <span>Независимая школа продаж</span>
            <span>Твой следующий шаг / NWO</span>
          </div>
          <div className="hero-grid">
            <div className="hero-copy">
              <span className="site-eyebrow">
                <span className="ink-dot" /> Обучение продажам на практике
              </span>
              <h1>
                Продавать —<br />
                значит быть
                <br />
                <em>понятным.</em>
              </h1>
              <p className="hero-description">
                Находить клиентов. Уверенно говорить о цене.
                <br className="desktop-break" /> Договариваться о сделке без
                давления и скидок.
              </p>
              <p className="hero-secondary">
                New Way Out — бесплатная база, углублённое обучение и личное
                менторство. Выбери свой следующий шаг.
              </p>
              <div className="site-actions">
                <Link href="/free/" className="site-button">
                  Начать бесплатно <ArrowUpRight size={19} />
                </Link>
                <a href="#programs" className="site-button site-button-outline">
                  Выбрать обучение <ArrowRight size={18} />
                </a>
              </div>
              <p className="site-microcopy">
                Без регистрации и карты. Сразу к материалам.
              </p>
              <div className="hero-author">
                <img
                  src="/founder.jpg"
                  width="44"
                  height="44"
                  alt="Ярослав Киричук"
                />
                <div>
                  <strong>Ярослав Киричук</strong>
                  <span>Автор New Way Out</span>
                </div>
                <span className="author-line" />
                <span className="author-note">
                  От первого звонка
                  <br />к уверенному диалогу.
                </span>
              </div>
            </div>
            <CourseFolio />
          </div>
          <div className="hero-bottom">
            <span>Для тех, кто продаёт</span>
            <span>Свои услуги</span>
            <span>Продукты бизнеса</span>
            <span>Свой опыт</span>
          </div>
        </section>
        <section className="site-section site-container" id="approach">
          <div className="section-heading">
            <span className="site-eyebrow">01 / Подход</span>
            <h2>
              Хороший разговор.
              <br />
              <em>Конкретный следующий шаг.</em>
            </h2>
            <p>
              Продажа становится понятнее, когда у каждого этапа есть задача. На
              этом и строится обучение.
            </p>
          </div>
          <div className="skills-grid">
            {skills.map(([title, description], i) => (
              <article className="skill-card" key={title}>
                <span className="skill-number">0{i + 1}</span>
                <h3>{title}</h3>
                <p>{description}</p>
              </article>
            ))}
          </div>
        </section>
        <section className="programs-section" id="programs">
          <div className="site-container site-section">
            <div className="section-heading">
              <span className="site-eyebrow">02 / Программы</span>
              <h2>
                Один навык.
                <br />
                <em>Три способа освоить.</em>
              </h2>
              <p>
                Начни с базы, углубись самостоятельно или приходи за личной
                обратной связью.
              </p>
            </div>
            <div className="programs-grid">
              {programs.map((program) => (
                <article
                  key={program.name}
                  className={`program-card ${program.className}`}
                >
                  <div className="program-card-top">
                    <span>{program.label}</span>
                    <span>/{program.number}</span>
                  </div>
                  <h3>{program.name}</h3>
                  <p className="program-price">
                    {program.price}
                    <span>{program.unit}</span>
                  </p>
                  <p className="program-description">{program.description}</p>
                  <ul>
                    {program.features.map((feature) => (
                      <li key={feature}>
                        <Check size={16} />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Link href={program.href} className="site-button">
                    {program.cta}
                    <ArrowUpRight size={18} />
                  </Link>
                </article>
              ))}
            </div>
            <p className="programs-help">
              Не уверен, какой формат выбрать?{" "}
              <a href={contactHref} target="_blank" rel="noopener noreferrer">
                Опиши свою задачу Ярославу <ArrowUpRight size={14} />
              </a>
            </p>
          </div>
        </section>
        <section className="site-container site-section founder-section">
          <div className="founder-portrait">
            <img
              src="/founder.jpg"
              width="640"
              height="640"
              loading="lazy"
              alt="Ярослав Киричук — автор и наставник New Way Out"
            />
            <div>
              <span>Ярослав Киричук</span>
              <span>Основатель / NWO</span>
            </div>
          </div>
          <div className="founder-copy">
            <span className="site-eyebrow">03 / Личный подход</span>
            <h2>
              По ту сторону
              <br />
              курса — <em>человек.</em>
            </h2>
            <p>
              Я Ярослав, автор New Way Out. Работаю с сайтами, рекламой и
              продажами услуг. В NWO собираю подход к переговорам, который можно
              применять в собственной работе.
            </p>
            <blockquote>
              «Мне важно, чтобы после урока ты понимал, что попробовать в
              следующем разговоре с клиентом».
            </blockquote>
            <a
              href={contactHref}
              target="_blank"
              rel="noopener noreferrer"
              className="site-text-link"
            >
              Познакомиться в Telegram <ArrowUpRight size={18} />
            </a>
          </div>
        </section>
        <section className="reviews-section">
          <div className="site-container site-section">
            <div className="section-heading">
              <span className="site-eyebrow">04 / Опыт участников</span>
              <h2>
                У каждого —<br />
                <em>своя точка старта.</em>
              </h2>
              <a
                className="site-text-link"
                href={contactHref}
                target="_blank"
                rel="noopener noreferrer"
              >
                Поделиться своим опытом <MessageCircle size={17} />
              </a>
            </div>
            <div className="reviews-grid">
              {reviews.map((review) => (
                <figure className="review-card" key={review.name}>
                  <span className="review-quote" aria-hidden="true">
                    “
                  </span>
                  <blockquote>{review.text}</blockquote>
                  <figcaption>
                    <strong>{review.name}</strong>
                    <span>{review.role}</span>
                    <time dateTime={review.date}>{review.dateLabel}</time>
                  </figcaption>
                </figure>
              ))}
            </div>
            <p className="site-microcopy">
              Личный опыт участников. Результаты индивидуальны и не являются
              обещанием дохода.
            </p>
          </div>
        </section>
        <section className="site-container site-section faq-section">
          <div className="section-heading">
            <span className="site-eyebrow">05 / До первого шага</span>
            <h2>
              Давай проясним
              <br />
              <em>главное.</em>
            </h2>
            <p>
              Если остался вопрос —{" "}
              <a href={contactHref} target="_blank" rel="noopener noreferrer">
                напиши мне в Telegram.
              </a>
            </p>
          </div>
          <div className="faq-list">
            {salesFaq.map((item) => (
              <details key={item.question}>
                <summary>
                  {item.question}
                  <Plus size={20} />
                </summary>
                <p>{item.answer}</p>
              </details>
            ))}
          </div>
        </section>
        <section className="site-container final-cta">
          <span className="site-eyebrow">
            Новая глава начинается с действия
          </span>
          <h2>
            Следующий разговор
            <br />
            может быть <em>другим.</em>
          </h2>
          <p>Попробуй бесплатную базу и реши, подходит ли тебе наш подход.</p>
          <Link href="/free/" className="site-button">
            Открыть бесплатный курс <ArrowUpRight size={19} />
          </Link>
          <span className="site-microcopy">
            Без регистрации. Без оплаты. В своём темпе.
          </span>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
