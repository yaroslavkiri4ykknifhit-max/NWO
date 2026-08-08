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
          <p className="landing-eyebrow">Твой доход начинается с умения продавать</p>
          <h1>Научись продавать — и перестань зависеть от обстоятельств.</h1>
          <p className="nwo-intro-description">
            Неважно, сколько у тебя денег сейчас и откуда они. Когда ты умеешь продавать,
            ты можешь находить клиентов, дороже оценивать себя, запускать свои идеи и сам
            влиять на то, сколько зарабатываешь.
          </p>
          <div className="landing-hero-actions">
            <a href="/premium/" className="landing-button landing-button-premium">
              Забрать полный навык <LockKeyhole size={16} />
            </a>
            <a href="/free/" className="landing-button landing-button-ghost">
              Начать бесплатно <ArrowRight size={18} />
            </a>
          </div>
          <p className="nwo-intro-note">
            Один навык для работы, бизнеса, переговоров и жизни.
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
          <p className="landing-eyebrow">Почему одни растут быстрее других</p>
          <h2>Деньги приходят к тому, кто умеет показать свою ценность.</h2>
          <p className="landing-statement-lead">
            Можно быть умным, талантливым и много работать. Но если ты не умеешь объяснить,
            почему человеку нужен именно твой продукт, услуга или идея, — деньги проходят мимо.
          </p>

          <div className="landing-problem-grid">
            <article>
              <span>01</span>
              <h3>Ты стоишь дороже, чем получаешь</h3>
              <p>У тебя есть способности, но ты не умеешь превратить их в понятное предложение и доход.</p>
            </article>
            <article>
              <span>02</span>
              <h3>Ты боишься сделать предложение</h3>
              <p>Думаешь, что покажешься навязчивым, и ждёшь, пока человек сам захочет купить.</p>
            </article>
            <article>
              <span>03</span>
              <h3>Ты теряешься после слова «дорого»</h3>
              <p>Не знаешь, что ответить, начинаешь оправдываться или сразу снижаешь цену.</p>
            </article>
          </div>

          <p className="landing-statement-bottom">
            NWO учит не уговаривать. Он учит понимать людей, уверенно говорить о деньгах
            и вести разговор к решению.
          </p>
        </div>
      </section>

      <section id="program" className="landing-paths">
        <div className="landing-paths-heading">
          <p className="landing-eyebrow">Начни с того уровня, на котором ты сейчас</p>
          <h2>Попробуй бесплатно.<br />Собери полный навык в BLACK.</h2>
          <p>
            Бесплатный курс даст понятную базу. NWO BLACK проведёт тебя через весь разговор:
            от первого контакта до момента, когда человек говорит «да» и оплачивает.
          </p>
        </div>

        <div className="landing-path-grid">
          <article className="landing-path landing-path-free">
            <div>
              <span className="landing-path-label">Старт без регистрации</span>
              <h3>NWO FREE</h3>
              <p>Пойми, как устроена продажа, и сразу забери приёмы, которые можно применить сегодня.</p>
            </div>
            <ul>
              <li><Check size={17} /> Как человек принимает решение о покупке</li>
              <li><Check size={17} /> Что говорить, чтобы тебя слушали</li>
              <li><Check size={17} /> Уроки без регистрации и кодов</li>
            </ul>
            <a href="/free/" className="landing-path-action">
              Начать бесплатно <ArrowRight size={18} />
            </a>
          </article>

          <article className="landing-path landing-path-black">
            <div className="landing-black-glow" />
            <div>
              <span className="landing-path-label"><LockKeyhole size={13} /> Полный платный доступ</span>
              <h3>NWO <em>BLACK</em></h3>
              <p>Полная система для тех, кто хочет уверенно продавать себя, услуги, товары и идеи.</p>
            </div>
            <ul>
              <li><Check size={17} /> Как быстро понять, чего хочет человек</li>
              <li><Check size={17} /> Как показать ценность и спокойно назвать цену</li>
              <li><Check size={17} /> Что отвечать на «дорого», «подумаю» и «не сейчас»</li>
              <li><Check size={17} /> Как довести разговор до оплаты без давления</li>
            </ul>
            <a href="/premium/" className="landing-path-action">
              Получить полный доступ <ArrowRight size={18} />
            </a>
          </article>
        </div>
      </section>

      <section className="landing-outcomes">
        <div className="landing-outcomes-heading">
          <p className="landing-eyebrow">Твоя точка Б</p>
          <h2>Ты умеешь превращать разговоры, идеи и возможности в деньги.</h2>
          <p>
            Ты заходишь в любой разговор спокойно. Быстро понимаешь человека, показываешь ему
            ценность, уверенно называешь цену и знаешь, что сказать дальше. Ты больше не ждёшь,
            пока кто-то даст тебе шанс, — ты умеешь создавать возможности сам.
          </p>
        </div>

        <div className="landing-outcomes-grid">
          <article><span>01</span><h3>Умеешь продать себя</h3><p>На собеседовании, в переговорах, перед клиентом или партнёром.</p></article>
          <article><span>02</span><h3>Умеешь продать продукт</h3><p>Свой или чужой: понятно объясняешь, зачем он нужен человеку.</p></article>
          <article><span>03</span><h3>Уверенно говоришь о деньгах</h3><p>Не оправдываешь цену и не обесцениваешь себя первой же скидкой.</p></article>
          <article><span>04</span><h3>Сам создаёшь возможности</h3><p>Можешь найти клиента, договориться и превратить навык или идею в доход.</p></article>
        </div>

        <div className="landing-honest-note">
          <p>
            <strong>NWO BLACK не обещает деньги за один вечер.</strong> Он даёт навык,
            который останется с тобой при смене работы, ниши, продукта или страны.
            Чем больше применяешь его в реальных разговорах, тем сильнее становишься.
          </p>
          <a href="/premium/" className="landing-button landing-button-premium">
            Забрать NWO BLACK <ArrowRight size={18} />
          </a>
        </div>
      </section>

      <section className="landing-final">
        <div className="landing-final-mark">NWO</div>
        <p className="landing-eyebrow">Твоя стартовая точка не решает твоё будущее</p>
        <h2>Не жди идеального момента.<br />Научись создавать его сам.</h2>
        <p className="landing-final-description">
          Сегодня ты можешь не знать, с чего начать. После NWO ты знаешь, как найти возможность,
          показать свою ценность, договориться о деньгах и довести разговор до результата.
        </p>
        <div className="landing-final-actions">
          <a href="/premium/" className="landing-button landing-button-premium">
            Получить полный навык <LockKeyhole size={16} />
          </a>
          <a href="/free/" className="landing-button landing-button-ghost">
            Попробовать бесплатно <ArrowRight size={18} />
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
