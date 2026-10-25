import { ArrowUpRight } from "lucide-react";
import { SiteHeader, SiteFooter, contactHref } from "@/components/site-shell";
import { CinematicMotion } from "@/components/cinematic-motion";
export default function MentorshipPage() {
  return (
    <div className="editorial-site">
      <SiteHeader />
      <CinematicMotion>
        <main id="main-content">
          <section className="site-container mentorship-hero">
            <div className="hero-edition">
              <span>МЕНТОРСТВО</span>
              <span>ОДИН НА ОДИН / 30 ДНЕЙ</span>
            </div>
            <div className="hero-grid">
              <div className="hero-copy">
                <span className="site-eyebrow">Личная работа с Ярославом</span>
                <h1>
                  Твой опыт.
                  <br />
                  Твои задачи.
                  <br />
                  <em>Моя поддержка.</em>
                </h1>
                <p className="hero-description">
                  Разбираем твои переговоры, находим слабые места и закрепляем
                  новые навыки на практике.
                </p>
                <div className="mentorship-price">
                  $170 <span>за 30 дней работы</span>
                </div>
                <a
                  className="site-button"
                  href={contactHref}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Обсудить свою задачу <ArrowUpRight size={18} />
                </a>
                <p className="site-microcopy">
                  Напиши, чем занимаешься и что хочешь улучшить.
                </p>
              </div>
              <figure className="mentor-photo">
                <img
                  src="/founder.jpg"
                  width="640"
                  height="640"
                  alt="Ярослав Киричук — автор New Way Out"
                  fetchPriority="high"
                />
                <figcaption>
                  <strong>Ярослав Киричук</strong>
                  <span>Автор NWO</span>
                </figcaption>
              </figure>
            </div>
          </section>
          <section className="site-container compact-syllabus" data-reveal>
            <span className="site-eyebrow">Как работаем</span>
            <div className="syllabus-list">
              {[
                [
                  "Находим точку роста",
                  "Разбираем продукт, твой опыт и реальные диалоги.",
                ],
                [
                  "Практикуемся",
                  "Индивидуальные созвоны, разбор формулировок и связь в Telegram.",
                ],
                [
                  "Закрепляем навык",
                  "Пробуем в работе, разбираем ответы и корректируем подход.",
                ],
              ].map(([title, text], i) => (
                <article key={title}>
                  <span>0{i + 1}</span>
                  <h2>{title}</h2>
                  <p>{text}</p>
                </article>
              ))}
            </div>
            <p className="conditions-note">
              До оплаты согласуем задачи, график и объём обратной связи. При
              необходимости поработаем над резюме и собеседованиями. Результат
              зависит от практики; доход и трудоустройство не гарантируются.
            </p>
          </section>
        </main>
      </CinematicMotion>
      <SiteFooter />
    </div>
  );
}
