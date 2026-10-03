"use client";

import Link from "next/link";
import {
  ArrowUpRight,
  ArrowRight,
  Check,
  BookOpen,
  Loader2,
} from "lucide-react";
import {
  CourseFolio,
  SiteFooter,
  SiteHeader,
  contactHref,
} from "@/components/site-shell";

const topics = [
  [
    "01",
    "Понять клиента",
    "Мотивы покупки, ожидания и вопросы, которые помогают увидеть настоящую задачу.",
  ],
  [
    "02",
    "Начать разговор",
    "Первый контакт, уверенная подача и переход к содержательному диалогу.",
  ],
  [
    "03",
    "Объяснить ценность",
    "Связь между задачей клиента, предложением и ценой. Без заученных лозунгов.",
  ],
  [
    "04",
    "Договориться о шаге",
    "Работа с сомнениями и ясная договорённость о том, что произойдёт дальше.",
  ],
];

export function ProgramIntro({
  variant,
  onStart,
  busy = false,
}: {
  variant: "free" | "premium";
  onStart: () => void;
  busy?: boolean;
}) {
  const black = variant === "premium";
  return (
    <div className="editorial-site">
      <SiteHeader />
      <main id="main-content">
        <section className="site-container program-intro">
          <div className="hero-edition">
            <Link href="/">Все программы</Link>
            <span>
              {black
                ? "NWO Black / Углублённое обучение"
                : "NWO Free / Открытая база"}
            </span>
          </div>
          <div className="hero-grid">
            <div className="hero-copy">
              <span className="site-eyebrow">
                {black
                  ? "Для следующего уровня переговоров"
                  : "Бесплатный курс по продажам"}
              </span>
              <h1>
                {black ? (
                  <>
                    Больше ясности.
                    <br />
                    Сильнее
                    <br />
                    <em>переговоры.</em>
                  </>
                ) : (
                  <>
                    Первый шаг
                    <br />к уверенным
                    <br />
                    <em>продажам.</em>
                  </>
                )}
              </h1>
              <p className="hero-description">
                {black
                  ? "NWO Black — структура переговоров, работа с ценой и инструментами закрытия сделок. Для самостоятельной практики."
                  : "Пойми логику клиента, подготовь первый контакт и научись говорить о своём предложении."}
              </p>
              <ul className="intro-checks">
                {(black
                  ? [
                      "Материалы о сложных переговорах",
                      "Практика работы с возражениями",
                      "Личный кабинет с сохранением прогресса",
                    ]
                  : [
                      "Без регистрации и оплаты",
                      "Учись в удобном темпе",
                      "Прогресс сохраняется в этом браузере",
                    ]
                ).map((text) => (
                  <li key={text}>
                    <Check size={17} />
                    {text}
                  </li>
                ))}
              </ul>
              <div className="site-actions">
                {black ? (
                  <a
                    className="site-button"
                    href={contactHref}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Получить доступ за $17 <ArrowUpRight size={18} />
                  </a>
                ) : (
                  <button
                    className="site-button"
                    onClick={onStart}
                    disabled={busy}
                  >
                    {busy ? (
                      <>
                        <Loader2 className="animate-spin" size={18} />
                        Открываем материалы…
                      </>
                    ) : (
                      <>
                        Перейти к урокам <ArrowRight size={18} />
                      </>
                    )}
                  </button>
                )}
                {black && (
                  <button
                    className="site-button site-button-outline"
                    onClick={onStart}
                  >
                    Уже купил — войти <ArrowRight size={18} />
                  </button>
                )}
              </div>
              <p className="site-microcopy">
                {black
                  ? "Оплата и условия — в Telegram. Доступ по email и инвайт-коду."
                  : "Сразу к практике. Карта не нужна."}
              </p>
            </div>
            <CourseFolio black={black} />
          </div>
        </section>
        <section className="programs-section">
          <div className="site-container site-section">
            <div className="section-heading">
              <span className="site-eyebrow">
                Содержание / Основные направления
              </span>
              <h2>
                {black ? "От вопросов" : "Начни с понимания."}
                <br />
                <em>{black ? "к решению." : "Закрепи действием."}</em>
              </h2>
              <p>
                {black
                  ? "Выстраивай диалог по этапам и адаптируй инструменты к своей нише."
                  : "База помогает подготовиться к разговору. После урока попробуй подход на своём предложении."}
              </p>
            </div>
            <div className="skills-grid">
              {topics.map(([number, title, text]) => (
                <article className="skill-card" key={number}>
                  <span className="skill-number">{number}</span>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
        <section className="site-container site-section">
          <div className="how-start-grid">
            <div>
              <span className="site-eyebrow">Как начать</span>
              <h2>{black ? "Три простых шага" : "Открой. Изучи. Попробуй."}</h2>
            </div>
            <ol>
              {(black
                ? [
                    "Напиши Ярославу в Telegram: уточни условия и способ оплаты до покупки.",
                    "Получи инвайт-код после оплаты и войди в кабинет по email.",
                    "Активируй код и переходи к материалам NWO Black.",
                  ]
                : [
                    "Нажми «Перейти к урокам» — регистрация не нужна.",
                    "Выбери урок из оглавления и изучи материал.",
                    "Отметь урок завершённым. В следующий раз продолжишь с непройденного.",
                  ]
              ).map((text, i) => (
                <li key={text}>
                  <span>0{i + 1}</span>
                  {text}
                </li>
              ))}
            </ol>
          </div>
          <div className="intro-bottom-callout">
            <BookOpen size={23} />
            <div>
              <h3>
                {black
                  ? "Хочешь сначала познакомиться с подходом?"
                  : "Нужно больше практики?"}
              </h3>
              <p>
                {black
                  ? "Бесплатная база поможет понять, подходит ли тебе формат."
                  : "Посмотри NWO Black или обсуди индивидуальную работу с Ярославом."}
              </p>
            </div>
            <Link
              className="site-text-link"
              href={black ? "/free/" : "/premium/"}
            >
              {black ? "Открыть базу" : "Узнать о Black"}
              <ArrowUpRight size={17} />
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

export function CourseLoading({
  label = "Открываем материалы",
}: {
  label?: string;
}) {
  return (
    <div className="course-loading" role="status" aria-live="polite">
      <span className="site-wordmark">New Way Out</span>
      <Loader2 size={24} className="animate-spin" />
      <p>{label}</p>
      <span>Можно начать, как только курс загрузится.</span>
      <Link href="/">На главную</Link>
    </div>
  );
}
