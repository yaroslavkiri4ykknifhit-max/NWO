"use client"

import { ArrowRight, Check, LockKeyhole } from "lucide-react"
import ScrollExpand from "@/components/scroll-expand"

function LandingStaticBackground() {
  return (
    <div className="landing-static-background" aria-hidden="true">
      <div className="landing-static-grid" />
      <div className="landing-static-ring landing-static-ring-one" />
      <div className="landing-static-ring landing-static-ring-two" />
      <div className="landing-static-word">NWO</div>
      <div className="landing-static-accent" />
    </div>
  )
}

export function LandingPage() {
  return (
    <main className="landing-shell">
      <LandingStaticBackground />

      <ScrollExpand
        mediaType="custom"
        title="NWO"
        scrollHint="Листай, чтобы войти"
        startWidth={44}
        startHeight={46}
        startRadius={28}
        endRadius={0}
        mediaZoom={1.42}
        scrollDistance={0.78}
        holdDistance={0.52}
        smoothing={0.075}
        overlayScrim={0.42}
        useWindowScroll
        className="nwo-scroll-intro"
        aria-label="Заставка NWO"
      >
        <div className="nwo-intro-offer">
          <p className="landing-eyebrow">NWO / система продаж</p>
          <h1>Ты не «не умеешь продавать». Тебя просто никто не научил.</h1>
          <p className="nwo-intro-description">
            Научись говорить уверенно, спокойно называть цену и вести человека к решению —
            без давления, кринжовых скриптов и роли «пожалуйста, купите».
          </p>
          <div className="landing-hero-actions">
            <a href="/premium/" className="landing-button landing-button-premium">
              Войти в NWO BLACK <LockKeyhole size={16} />
            </a>
            <a href="/free/" className="landing-button landing-button-ghost">
              Сначала бесплатная база <ArrowRight size={18} />
            </a>
          </div>
          <p className="nwo-intro-note">
            Для тех, кто продаёт услуги, продукты, идеи — или самого себя на собеседовании.
          </p>
        </div>
      </ScrollExpand>

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

      <section className="landing-statement">
        <div className="landing-statement-inner">
          <span className="landing-statement-number">02</span>
          <p className="landing-eyebrow">Если узнаёшь себя — пора менять систему</p>
          <h2>Ты идёшь в разговор без карты. Поэтому клиент ведёт тебя.</h2>
          <p className="landing-statement-lead">
            Большинство теряет сделку не из-за слабого продукта. Они теряются в момент,
            когда нужно задать неудобный вопрос, назвать цену или не отпустить разговор в пустоту.
          </p>

          <div className="landing-problem-grid">
            <article>
              <span>01</span>
              <h3>Цена звучит как извинение</h3>
              <p>Называешь стоимость — и сразу начинаешь оправдываться или давать скидку.</p>
            </article>
            <article>
              <span>02</span>
              <h3>Клиент держит рамку</h3>
              <p>Он задаёт темп и вопросы, а ты пытаешься понравиться вместо того, чтобы вести.</p>
            </article>
            <article>
              <span>03</span>
              <h3>«Я подумаю» = тишина</h3>
              <p>Созвон вроде прошёл нормально, но следующего шага нет и сделка растворяется.</p>
            </article>
          </div>

          <p className="landing-statement-bottom">
            NWO BLACK меняет не отдельные фразы. Он меняет твою логику внутри разговора.
          </p>
        </div>
      </section>

      <section id="program" className="landing-paths">
        <div className="landing-paths-heading">
          <p className="landing-eyebrow">Два входа. Один следующий уровень.</p>
          <h2>Проверь базу бесплатно.<br />Забери систему в BLACK.</h2>
          <p>
            FREE показывает, из чего состоит нормальная продажа. BLACK перестраивает то,
            как ты действуешь, когда на столе реальные деньги, сомнения и возражения.
          </p>
        </div>

        <div className="landing-path-grid">
          <article className="landing-path landing-path-free">
            <div>
              <span className="landing-path-label">Старт без регистрации</span>
              <h3>NWO FREE</h3>
              <p>Быстро собери фундамент и пойми, подходит ли тебе подход NWO.</p>
            </div>
            <ul>
              <li><Check size={17} /> Базовая логика сделки</li>
              <li><Check size={17} /> Уроки без регистрации и кодов</li>
              <li><Check size={17} /> Можно начать прямо сейчас</li>
            </ul>
            <a href="/free/" className="landing-path-action">
              Забрать бесплатную базу <ArrowRight size={18} />
            </a>
          </article>

          <article className="landing-path landing-path-black">
            <div className="landing-black-glow" />
            <div>
              <span className="landing-path-label"><LockKeyhole size={13} /> Полный платный доступ</span>
              <h3>NWO <em>BLACK</em></h3>
              <p>Для тех, кому нужен не ещё один список советов, а сильная позиция в разговоре.</p>
            </div>
            <ul>
              <li><Check size={17} /> Как держать рамку и не заискивать</li>
              <li><Check size={17} /> Вопросы, которые раскрывают мотив</li>
              <li><Check size={17} /> «Дорого», «подумаю», «не сейчас»</li>
              <li><Check size={17} /> Follow-up и дожим без токсичного давления</li>
            </ul>
            <a href="/premium/" className="landing-path-action">
              Хочу в NWO BLACK <ArrowRight size={18} />
            </a>
          </article>
        </div>
      </section>

      <section className="landing-outcomes">
        <div className="landing-outcomes-heading">
          <p className="landing-eyebrow">Что меняется после практики</p>
          <h2>Ты больше не надеешься на харизму. Ты понимаешь, что делать дальше.</h2>
          <p>
            Не магия и не набор фраз на все случаи. Это понятная система действий,
            которую можно перенести в созвон, переписку, переговоры и собеседование.
          </p>
        </div>

        <div className="landing-outcomes-grid">
          <article><span>01</span><h3>Спокойно называешь цену</h3><p>Без оправданий, суеты и скидки раньше времени.</p></article>
          <article><span>02</span><h3>Слышишь реальное возражение</h3><p>Отделяешь вежливую отговорку от настоящей причины.</p></article>
          <article><span>03</span><h3>Фиксируешь следующий шаг</h3><p>Разговор не заканчивается мутным «ну, спишемся».</p></article>
          <article><span>04</span><h3>Не чувствуешь себя попрошайкой</h3><p>Ты помогаешь принять решение, а не выпрашиваешь оплату.</p></article>
        </div>

        <div className="landing-honest-note">
          <p>
            <strong>Честно:</strong> просмотр уроков сам по себе не принесёт деньги.
            NWO BLACK даёт инструменты и тренировочную систему. Результат появляется,
            когда ты начинаешь применять их в настоящих разговорах.
          </p>
          <a href="/premium/" className="landing-button landing-button-premium">
            Посмотреть NWO BLACK <ArrowRight size={18} />
          </a>
        </div>
      </section>

      <section className="landing-final">
        <div className="landing-final-mark">NWO</div>
        <p className="landing-eyebrow">Без обещаний лёгких миллионов</p>
        <h2>Сначала пойми базу.<br />Потом зайди в разговор другим человеком.</h2>
        <p className="landing-final-description">
          Начни бесплатно. Если почувствуешь, что тебе нужен полный контроль над продажей —
          переходи в NWO BLACK.
        </p>
        <div className="landing-final-actions">
          <a href="/premium/" className="landing-button landing-button-premium">
            Войти в NWO BLACK <LockKeyhole size={16} />
          </a>
          <a href="/free/" className="landing-button landing-button-ghost">
            Открыть бесплатный курс <ArrowRight size={18} />
          </a>
        </div>
      </section>

      <footer className="landing-footer">
        <span>NWO © {new Date().getFullYear()}</span>
        <span>Система обучения продажам</span>
      </footer>
    </main>
  )
}
