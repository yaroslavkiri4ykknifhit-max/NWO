import Link from "next/link";
import { ArrowUpRight, Check } from "lucide-react";
import { SiteHeader, SiteFooter, contactHref } from "@/components/site-shell";

const weeks = [
  [
    "01",
    "Точка старта",
    "Разбираем твою задачу, продукт и текущие разговоры. Определяем, что мешает продавать увереннее.",
  ],
  [
    "02",
    "Диалог с клиентом",
    "Работаем над первым контактом, вопросами и подачей. Пробуем формулировки и разбираем ответы.",
  ],
  [
    "03",
    "Ценность и сомнения",
    "Учимся объяснять цену, отвечать на возражения и предлагать понятный следующий шаг.",
  ],
  [
    "04",
    "Самостоятельная практика",
    "Закрепляем подход на твоих ситуациях. При необходимости готовим резюме и тренируем собеседование.",
  ],
];
export default function MentorshipPage() {
  return (
    <div className="editorial-site">
      <SiteHeader />
      <main id="main-content">
        <section className="site-container mentorship-hero">
          <div className="hero-edition">
            <Link href="/">Все программы</Link>
            <span>Менторство / Один на один</span>
          </div>
          <div className="hero-grid">
            <div className="hero-copy">
              <span className="site-eyebrow">30 дней персональной работы</span>
              <h1>
                Твои задачи.
                <br />
                Моя обратная
                <br />
                <em>связь.</em>
              </h1>
              <p className="hero-description">
                Личное менторство с Ярославом Киричуком: разбор твоих
                переговоров, практика и конкретные шаги для развития в продажах.
              </p>
              <ul className="intro-checks">
                {[
                  "Индивидуальные созвоны и связь в Telegram",
                  "Разбор звонков, формулировок и ошибок",
                  "Подготовка резюме и собеседований",
                ].map((text) => (
                  <li key={text}>
                    <Check size={17} />
                    {text}
                  </li>
                ))}
              </ul>
              <div className="mentorship-price">
                $170 <span>за 30 дней работы</span>
              </div>
              <a
                className="site-button"
                href={contactHref}
                target="_blank"
                rel="noopener noreferrer"
              >
                Обсудить менторство <ArrowUpRight size={18} />
              </a>
              <p className="site-microcopy">
                Первое знакомство — бесплатно. Обсудим задачу и формат до
                оплаты.
              </p>
            </div>
            <figure className="mentor-photo">
              <img
                src="/founder.jpg"
                width="640"
                height="640"
                alt="Ярослав Киричук — твой наставник по продажам"
                fetchPriority="high"
              />
              <figcaption>
                <strong>Ярослав Киричук</strong>
                <span>Автор New Way Out</span>
              </figcaption>
            </figure>
          </div>
        </section>
        <section className="programs-section">
          <div className="site-container site-section">
            <div className="section-heading">
              <span className="site-eyebrow">План работы</span>
              <h2>
                Месяц практики.
                <br />
                <em>Шаг за шагом.</em>
              </h2>
              <p>
                План адаптируем под твой опыт и цель на первом разговоре. Это
                ориентир для совместной работы.
              </p>
            </div>
            <div className="skills-grid">
              {weeks.map(([number, title, text]) => (
                <article key={number} className="skill-card">
                  <span className="skill-number">{number} / неделя</span>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
        <section className="site-container site-section faq-section">
          <div className="section-heading">
            <span className="site-eyebrow">Перед стартом</span>
            <h2>
              Понятные условия.
              <br />
              <em>Личный контакт.</em>
            </h2>
            <p>
              Ты общаешься напрямую с наставником. До оплаты согласуем задачи,
              расписание и условия работы.
            </p>
          </div>
          <div className="faq-list">
            <details>
              <summary>Кому подходит менторство?</summary>
              <p>
                Новичкам, менеджерам и тем, кто продаёт свои услуги. Подходит,
                если тебе нужна обратная связь по своим разговорам и готовность
                регулярно практиковаться.
              </p>
            </details>
            <details>
              <summary>Как записаться?</summary>
              <p>
                Напиши Ярославу в Telegram: чем занимаешься, какой опыт в
                продажах и что хочешь улучшить. Обсудим формат, график и способы
                оплаты.
              </p>
            </details>
            <details>
              <summary>Что входит в стоимость?</summary>
              <p>
                30 дней персональной работы: индивидуальные созвоны, связь в
                Telegram и разбор твоих ситуаций. Частоту созвонов и объём
                обратной связи согласуем до начала.
              </p>
            </details>
            <details>
              <summary>Гарантируется ли работа или доход?</summary>
              <p>
                Гарантии дохода и трудоустройства нет. Мы можем готовить резюме
                и тренировать собеседования, но итог зависит от вакансий, твоих
                навыков и решений работодателя.
              </p>
            </details>
          </div>
        </section>
        <section className="site-container final-cta">
          <span className="site-eyebrow">Начнём с твоей задачи</span>
          <h2>
            Расскажи, что хочется
            <br />
            <em>изменить.</em>
          </h2>
          <p>
            Напиши несколько слов о себе. Я помогу понять, подходит ли
            менторство.
          </p>
          <a
            className="site-button"
            href={contactHref}
            target="_blank"
            rel="noopener noreferrer"
          >
            Написать Ярославу <ArrowUpRight size={18} />
          </a>
          <p className="site-microcopy">
            Можно сначала{" "}
            <Link href="/free/" className="underline">
              попробовать бесплатный курс
            </Link>
            .
          </p>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
