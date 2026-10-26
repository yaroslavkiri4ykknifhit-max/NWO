import Link from "next/link";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Check,
  Plus,
  Radio,
  Send,
} from "lucide-react";
import { SiteHeader, SiteFooter } from "@/components/site-shell";
import { CinematicMotion } from "@/components/cinematic-motion";
import {
  bootcampFaq,
  eventContactHref,
  eventProgram,
} from "@/lib/bootcamp-content";
import s from "./bootcamp.module.css";

function EventButton({
  children = "Хочу на эфир",
}: {
  children?: React.ReactNode;
}) {
  return (
    <a href="#pricing" className={s.cta}>
      {children}
      <ArrowUpRight aria-hidden size={23} />
    </a>
  );
}

export function LandingPage() {
  return (
    <div className={`editorial-site ${s.site}`}>
      <SiteHeader />
      <CinematicMotion>
        <main id="main-content">
          <section className={s.hero}>
            <div className={s.heroGlow} aria-hidden />
            <div className={s.container}>
              <div className={s.eventLabel}>
                <Radio size={15} aria-hidden /> ОТКРЫТЫЙ ОНЛАЙН-ЭФИР ПО ПРОДАЖАМ
              </div>
              <h1>
                Хватит слышать
                <br />
                <span>«Я подумаю».</span>
                <br />
                Начни вести к сделке.
              </h1>
              <p className={s.heroLead}>
                Как находить потребность, объяснять ценность и говорить о
                деньгах — даже если сейчас теряешься после первого возражения.
              </p>
              <div className={s.heroActions}>
                <EventButton />
                <a className={s.quietLink} href="#program">
                  Что будет на эфире <ArrowDown size={16} aria-hidden />
                </a>
              </div>
              <p className={s.micro}>
                Участие бесплатно · Для новичков и тех, кто уже продаёт
              </p>
              <div className={s.eventPoster}>
                <img
                  className={s.posterTexture}
                  src="/art/impasto-blue.webp"
                  width="1672"
                  height="941"
                  fetchPriority="high"
                  alt=""
                  aria-hidden
                />
                <div className={s.posterTop}>
                  <span>NWO / SALES SESSION</span>
                  <span>
                    <i /> АНОНС ЭФИРА
                  </span>
                </div>
                <div className={s.posterBody}>
                  <div className={s.posterTitle}>
                    Разговор.
                    <br />
                    Ценность.
                    <br />
                    <em>Сделка.</em>
                  </div>
                  <div
                    className={s.posterDialog}
                    aria-label="Учебный пример диалога"
                  >
                    <span className={s.dialogTag}>РАЗБЕРЁМ НА ПРИМЕРЕ</span>
                    <p className={s.clientBubble}>
                      «У вас дорого. Я ещё посмотрю».
                    </p>
                    <ArrowDown size={25} aria-hidden />
                    <p className={s.sellerBubble}>
                      «Что для вас важнее всего
                      <br />
                      при выборе решения?»
                    </p>
                    <span className={s.dialogFoot}>
                      Сначала понять. Затем предлагать.
                    </span>
                  </div>
                </div>
                <div className={s.posterBottom}>
                  <span>С ЯРОСЛАВОМ КИРИЧУКОМ</span>
                  <span>NEW WAY OUT ↗</span>
                </div>
              </div>
            </div>
          </section>
          <div className={s.ribbon}>
            <span>ОТ ПЕРВОГО КОНТАКТА</span>
            <i>✳</i>
            <span>ДО УВЕРЕННОГО «ДА»</span>
            <i>✳</i>
            <span>ПРОДАЖИ ПО СИСТЕМЕ</span>
          </div>
          <section
            className={`${s.section} ${s.container} ${s.problem}`}
            data-reveal
          >
            <div>
              <span className={s.eyebrow}>01 / ЗНАКОМАЯ СИТУАЦИЯ?</span>
              <h2>
                Ты рассказываешь.
                <br />
                Клиент <span>исчезает.</span>
              </h2>
              <p className={s.lead}>
                Ты знаешь продукт. Стараешься. Отвечаешь на вопросы. Но разговор
                снова заканчивается без понятного следующего шага.
              </p>
              <p className={s.punch}>
                Дело может быть в том,
                <br />
                как устроен сам диалог.
              </p>
            </div>
            <div className={s.painList}>
              {[
                [
                  "«Скиньте информацию»",
                  "Отправляешь презентацию и больше не получаешь ответа.",
                ],
                [
                  "«Дорого»",
                  "Начинаешь оправдывать цену или сразу предлагаешь скидку.",
                ],
                [
                  "«Мы подумаем»",
                  "Не понимаешь, что осталось неясным и когда вернуться.",
                ],
                [
                  "«Мне ничего не нужно»",
                  "Вступление заканчивается раньше, чем начинается разговор.",
                ],
              ].map(([title, text]) => (
                <div key={title}>
                  <span aria-hidden>↗</span>
                  <div>
                    <h3>{title}</h3>
                    <p>{text}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
          <section className={s.systemBand}>
            <div className={`${s.container} ${s.section}`} data-reveal>
              <span className={s.eyebrow}>02 / ДРУГОЙ ПОДХОД</span>
              <h2>
                Продажа начинается
                <br />
                не с презентации.
                <br />
                <span>А с правильного вопроса.</span>
              </h2>
              <div className={s.systemBottom}>
                <p className={s.lead}>
                  В NWO мы разбираем логику разговора: кому ты продаёшь, что
                  человеку нужно, почему твоё решение имеет смысл и о чём
                  договориться дальше.
                </p>
                <EventButton>Разобраться на эфире</EventButton>
              </div>
              <div className={s.method}>
                <span>
                  <b>01</b>Понять задачу
                </span>
                <ArrowRight aria-hidden />
                <span>
                  <b>02</b>Показать ценность
                </span>
                <ArrowRight aria-hidden />
                <span>
                  <b>03</b>Обсудить решение
                </span>
                <ArrowRight aria-hidden />
                <span>
                  <b>04</b>Согласовать шаг
                </span>
              </div>
            </div>
          </section>
          <section
            className={`${s.container} ${s.section} ${s.walkthrough}`}
            data-reveal
          >
            <div className={s.demoCard}>
              <span className={s.eyebrow}>УЧЕБНЫЙ РАЗБОР / ДО → ПОСЛЕ</span>
              <div className={s.before}>
                <span>ПРЕЗЕНТАЦИЯ БЕЗ КОНТЕКСТА</span>
                <p>
                  «У нас 12 модулей,
                  <br />
                  удобная платформа
                  <br />и сейчас скидка».
                </p>
              </div>
              <div className={s.after}>
                <span>
                  <Check size={15} aria-hidden /> РАЗГОВОР О ЗАДАЧЕ
                </span>
                <p>
                  «На каком этапе
                  <br />
                  ты чаще всего
                  <br />
                  теряешь клиента?»
                </p>
              </div>
              <p className={s.demoFoot}>
                Один продукт. Разная точка входа в диалог.
              </p>
            </div>
            <div>
              <span className={s.eyebrow}>03 / ВМЕСТО СПИСКА СОВЕТОВ</span>
              <h2>
                Пройдём разговор
                <br />
                <span>по шагам.</span>
              </h2>
              <p className={s.lead}>
                От первой реплики до договорённости. Посмотрим, где теряется
                контакт и как вернуть разговор к задаче клиента.
              </p>
              <ul className={s.checkList}>
                <li>
                  <Check aria-hidden />
                  Что спросить до презентации
                </li>
                <li>
                  <Check aria-hidden />
                  Как связать продукт с потребностью
                </li>
                <li>
                  <Check aria-hidden />
                  Что уточнить после «дорого»
                </li>
                <li>
                  <Check aria-hidden />
                  Как закончить конкретным действием
                </li>
              </ul>
              <EventButton>Мне нужен этот разбор</EventButton>
            </div>
          </section>
          <section
            id="about-event"
            className={`${s.container} ${s.eventFacts}`}
            aria-label="Об эфире"
            data-reveal
          >
            <div>
              <span>ЧТО</span>
              <h3>Эфир по продажам</h3>
              <p>
                Структура переговоров, работа с ценой и разбор типичных ответов
                клиента.
              </p>
            </div>
            <div>
              <span>ГДЕ</span>
              <h3>Онлайн</h3>
              <p>
                Запись через Telegram Ярослава. Там же можно уточнить детали
                участия.
              </p>
            </div>
            <div>
              <span>КОГДА</span>
              <h3>Дата уточняется</h3>
              <p>
                Напиши «ЭФИР», чтобы узнать расписание и получить ссылку на
                участие.
              </p>
            </div>
          </section>
          <section id="program" className={`${s.container} ${s.section}`}>
            <div className={s.centerHeading} data-reveal>
              <span className={s.eyebrow}>04 / ПРОГРАММА ЭФИРА</span>
              <h2>
                Весь путь клиента.
                <br />
                <span>Пять точек внимания.</span>
              </h2>
              <p>
                Каждый блок — конкретный этап разговора и действие, которое
                можно попробовать в своей работе.
              </p>
            </div>
            <div className={s.program}>
              {eventProgram.map((item, index) => (
                <article key={item.title} className={s.programRow} data-reveal>
                  <span className={s.programNumber}>0{index + 1}</span>
                  <div>
                    <span className={s.programTag}>{item.tag}</span>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                  </div>
                  <ul>
                    {item.points.map((point) => (
                      <li key={point}>
                        <ArrowUpRight size={15} aria-hidden />
                        {point}
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
            <div className={s.centerAction}>
              <EventButton>Хочу пройти эти пять шагов</EventButton>
            </div>
          </section>
          <section className={s.proofBand}>
            <div
              className={`${s.container} ${s.section} ${s.preview}`}
              data-reveal
            >
              <div>
                <span className={s.eyebrow}>05 / ПОСМОТРИ ПОДХОД ЗАРАНЕЕ</span>
                <h2>
                  Меньше обещаний.
                  <br />
                  <span>Открой сам.</span>
                </h2>
                <p className={s.lead}>
                  В бесплатном разделе уже есть материалы NWO. Начни со «Словаря
                  экспертных продаж» и посмотри, как мы объясняем базу.
                </p>
                <Link href="/free/#first-lesson" className={s.quietLink}>
                  Посмотреть открытый урок{" "}
                  <ArrowUpRight size={19} aria-hidden />
                </Link>
              </div>
              <Link href="/free/#first-lesson" className={s.lessonCard}>
                <div className={s.lessonCardTop}>
                  <span>NWO / OPEN EDITION</span>
                  <ArrowUpRight size={28} aria-hidden />
                </div>
                <span className={s.bookNumber}>А—Я</span>
                <h3>
                  Словарь
                  <br />
                  экспертных
                  <br />
                  продаж
                </h3>
                <span className={s.lessonCardBottom}>
                  ОТКРЫТЫЙ УРОК <span>БЕЗ РЕГИСТРАЦИИ</span>
                </span>
              </Link>
            </div>
          </section>
          <section id="formats" className={`${s.container} ${s.section}`}>
            <div id="pricing" className={s.registration} data-reveal>
              <div className={s.ticketIntro}>
                <span className={s.eyebrow}>06 / ТВОЙ СЛЕДУЮЩИЙ ШАГ</span>
                <h2>
                  Следующий разговор
                  <br />
                  может пойти
                  <br />
                  <span>по-другому.</span>
                </h2>
                <p className={s.lead}>
                  Начни с эфира. Разбери знакомые ситуации и собери для себя
                  понятную структуру продажи.
                </p>
                <div className={s.ticketSerial}>
                  <span>NWO — SALES SESSION</span>
                  <span>OPEN ACCESS ↗</span>
                </div>
              </div>
              <div className={s.ticket}>
                <span className={s.ticketLabel}>
                  <Radio size={16} aria-hidden /> УЧАСТИЕ В ЭФИРЕ
                </span>
                <div className={s.price}>
                  Бесплатно<span>Без оплаты участия</span>
                </div>
                <ul className={s.checkList}>
                  <li>
                    <Check aria-hidden />
                    Пять этапов от контакта до сделки
                  </li>
                  <li>
                    <Check aria-hidden />
                    Логика работы с «дорого» и «подумаю»
                  </li>
                  <li>
                    <Check aria-hidden />
                    Примеры вопросов и формулировок
                  </li>
                  <li>
                    <Check aria-hidden />
                    Открытая база NWO уже на сайте
                  </li>
                </ul>
                <a
                  href={eventContactHref}
                  className={s.cta}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Записаться через Telegram <Send size={20} aria-hidden />
                </a>
                <p className={s.ticketNote}>
                  Откроется чат с Ярославом. Отправь «ЭФИР» — уточни дату и
                  ссылку. Сообщение не отправляется автоматически.
                </p>
              </div>
            </div>
          </section>
          <section
            className={`${s.container} ${s.section} ${s.whyFree}`}
            data-reveal
          >
            <span className={s.eyebrow}>07 / ПОЧЕМУ БЕСПЛАТНО</span>
            <div>
              <h2>
                Сначала познакомиться.
                <br />
                <span>Потом решать.</span>
              </h2>
              <p className={s.lead}>
                Эфир — способ познакомиться с подходом NWO. Для самостоятельного
                углубления есть Black за $17, для личной работы — менторство за
                $170 на 30 дней. Выбрать продолжение можно отдельно.
              </p>
              <div className={s.nextLinks}>
                <Link href="/premium/">
                  Что внутри Black <ArrowUpRight size={17} aria-hidden />
                </Link>
                <Link href="/mentorship/">
                  Как устроено менторство <ArrowUpRight size={17} aria-hidden />
                </Link>
              </div>
            </div>
          </section>
          <section id="host" className={s.hostBand}>
            <div
              className={`${s.container} ${s.section} ${s.host}`}
              data-reveal
            >
              <div className={s.hostPhoto}>
                <img
                  src="/founder.jpg"
                  width="1023"
                  height="1023"
                  alt="Ярослав Киричук — автор NWO"
                  loading="lazy"
                />
                <span>ЯРОСЛАВ КИРИЧУК / NWO</span>
              </div>
              <div>
                <span className={s.eyebrow}>08 / КТО ВЕДЁТ ЭФИР</span>
                <h2>
                  Ярослав
                  <br />
                  <span>Киричук.</span>
                </h2>
                <p className={s.lead}>
                  Автор New Way Out. В материалах NWO делюсь своим опытом
                  продаж: от первых неуверенных звонков до работы с
                  потребностью, ценой и возражениями.
                </p>
                <blockquote>
                  «Поворотный момент случился, когда я понял концепцию
                  ценности».
                </blockquote>
                <Link href="/blog/how-i-made-11k/" className={s.quietLink}>
                  Моя история — в журнале NWO{" "}
                  <ArrowUpRight size={18} aria-hidden />
                </Link>
              </div>
            </div>
          </section>
          <section
            id="faq"
            className={`${s.container} ${s.section} ${s.faq}`}
            data-reveal
          >
            <div>
              <span className={s.eyebrow}>09 / ОСТАЛОСЬ УТОЧНИТЬ</span>
              <h2>
                Перед тем,
                <br />
                как <span>включиться.</span>
              </h2>
            </div>
            <div className={s.faqList}>
              {bootcampFaq.map((item) => (
                <details key={item.question}>
                  <summary>
                    {item.question}
                    <Plus aria-hidden size={20} />
                  </summary>
                  <p>{item.answer}</p>
                </details>
              ))}
            </div>
          </section>
          <section className={s.final}>
            <div className={s.container} data-reveal>
              <span className={s.eyebrow}>NEW WAY OUT / SALES SESSION</span>
              <h2>
                Хватит гадать,
                <br />
                <span>что ответить клиенту.</span>
              </h2>
              <p>Разберись в логике разговора. Начни с эфира NWO.</p>
              <EventButton>Хочу на эфир по продажам</EventButton>
              <span className={s.micro}>
                Бесплатно · Онлайн · Запись через Telegram
              </span>
            </div>
          </section>
        </main>
      </CinematicMotion>
      <SiteFooter />
      <div className={s.mobileBar}>
        <span>
          Эфир NWO<small>Участие бесплатно</small>
        </span>
        <a href="#pricing">
          Хочу на эфир <ArrowUpRight size={17} aria-hidden />
        </a>
      </div>
    </div>
  );
}
