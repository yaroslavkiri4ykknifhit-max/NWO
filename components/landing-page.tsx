import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  Check,
  CircleHelp,
  Crown,
  Globe,
  Handshake,
  MapPin,
  MessageSquareText,
  Play,
  Quote,
  Target,
  UserRoundSearch,
  X,
} from "lucide-react";
import {
  bootcampFaq,
  eventContactHref,
  eventProgram,
} from "@/lib/bootcamp-content";
import s from "./bootcamp.module.css";

function Cta({
  children = "ЗАПИСАТЬСЯ НА ЭФИР",
  href = "#pricing",
  gold = false,
}: {
  children?: React.ReactNode;
  href?: string;
  gold?: boolean;
}) {
  const external = href.startsWith("https:");
  return (
    <a
      className={`${s.cta} ${gold ? s.goldCta : ""}`}
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
    >
      <span>{children}</span>
    </a>
  );
}
function Mark() {
  return (
    <Link className={s.logo} href="/" aria-label="New Way Out — главная">
      <span className={s.logoIcon}>N</span>
      <span>
        NEW WAY OUT<strong>SALES BOOTCAMP</strong>
      </span>
    </Link>
  );
}
function Mockup({ index = 0 }: { index?: number }) {
  const labels = [
    "Первый контакт",
    "Вопросы клиенту",
    "Ценность продукта",
    "Работа с ценой",
    "Следующий шаг",
  ];
  return (
    <div className={s.mockup} aria-label={`Материалы NWO: ${labels[index]}`}>
      <div className={s.monitor}>
        <div className={s.monitorScreen}>
          <div className={s.mockNav}>
            NWO <span>SALES SYSTEM / 0{index + 1}</span>
          </div>
          <h4>{labels[index]}</h4>
          <div className={s.mockColumns}>
            {["Контакт", "Задача", "Решение", "Действие"].map((x, i) => (
              <div key={x}>
                <b>0{i + 1}</b>
                <strong>{x}</strong>
                <i />
                <i />
                <i />
                <span>Шаг за шагом</span>
              </div>
            ))}
          </div>
        </div>
        <div className={s.monitorStand} />
      </div>
      <div className={s.mockBook}>
        <span>NWO / ПРАКТИКА</span>
        <strong>{index % 2 ? "Скрипт\nразговора" : "Чек-лист\nпродаж"}</strong>
        <i />
      </div>
      <div className={s.mockLaptop}>
        <div className={s.laptopScreen}>
          <span>СТРУКТУРА ДИАЛОГА</span>
          <div className={s.mockChat}>Что сейчас не получается?</div>
          <div className={s.mockChat}>Какой результат нужен?</div>
          <b>ПОНЯТЬ → ПРЕДЛОЖИТЬ</b>
        </div>
        <div className={s.laptopBase} />
      </div>
      <div className={s.mockPhone}>
        <span>NWO</span>
        <Target size={28} />
        <strong>
          Веди
          <br />
          разговор
        </strong>
        <i />
        <i />
        <b>К следующему шагу</b>
      </div>
    </div>
  );
}
const examples = [
  [
    "Клиент",
    "А почему так дорого?",
    "Менеджер",
    "С чем сравниваете и что для вас важно в решении?",
  ],
  [
    "Клиент",
    "Скиньте информацию.",
    "Менеджер",
    "Чтобы отправить подходящее: какую задачу хотите решить?",
  ],
  [
    "Клиент",
    "Мне надо подумать.",
    "Менеджер",
    "Что именно осталось неясным? Давайте разберём.",
  ],
  [
    "Клиент",
    "Мы уже с кем-то работаем.",
    "Менеджер",
    "Что в текущем решении устраивает, а что хотелось бы улучшить?",
  ],
];
function Example({ item }: { item: string[] }) {
  return (
    <div className={s.example}>
      <span>УЧЕБНЫЙ ПРИМЕР / NWO</span>
      <p>
        <small>{item[0]}</small>
        {item[1]}
      </p>
      <p>
        <small>{item[2]}</small>
        {item[3]}
      </p>
    </div>
  );
}
const included = [
  "Пять этапов разговора с клиентом",
  "Выявление задачи и потребности",
  "Презентация ценности продукта",
  "Разбор «дорого» и «я подумаю»",
  "Согласование следующего шага",
  "Открытая база NWO без регистрации",
];
const extras = [
  "Доступ к полному курсу NWO Black",
  "Углубление в переговоры",
  "Инструменты работы с ценой",
  "Техники закрытия сделок",
  "Личный кабинет по email",
  "Сохранение прогресса обучения",
];

export function LandingPage() {
  return (
    <div className={s.site}>
      <a className={s.skip} href="#main-content">
        Перейти к содержимому
      </a>
      <header className={s.header}>
        <Mark />
        <div>
          УЧАСТИЕ В ЭФИРЕ: <span>БЕСПЛАТНО</span>
        </div>
      </header>
      <main id="main-content">
        <section className={`${s.hero} ${s.gridBackground}`}>
          <div className={s.dateBadge}>ОНЛАЙН-ЭФИР С ЯРОСЛАВОМ КИРИЧУКОМ</div>
          <h1>
            Этот <span className={s.red}>эфир по продажам</span> покажет,
            <br className={s.desktopBreak} /> как уверенно продавать{" "}
            <span className={s.yellow}>даже без опыта</span>
            <br className={s.desktopBreak} /> и вести разговор с клиентом
            <br className={s.desktopBreak} />{" "}
            <span className={s.yellow}>от первого контакта до сделки</span>
          </h1>
          <p className={s.heroSubtitle}>
            Разберись, что говорить клиенту, как показывать ценность
            <br className={s.desktopBreak} /> и отвечать на возражения без
            давления и бесконечных скидок.
          </p>
          <Link
            className={s.heroMedia}
            href="/free/#first-lesson"
            aria-label="Открыть бесплатный урок NWO"
          >
            <img
              src="/founder.jpg"
              alt="Ярослав Киричук — автор NWO"
              width="1023"
              height="1023"
              fetchPriority="high"
            />
            <span className={s.mediaOverlay}>
              <strong>Познакомься с подходом NWO</strong>
              <Play size={52} fill="currentColor" aria-hidden />
              <b>Открыть бесплатный урок</b>
            </span>
            <span className={s.mediaCaption}>
              ПРОДАЖИ НАЧИНАЮТСЯ С ПОНИМАНИЯ
            </span>
          </Link>
          <div className={s.eventName}>
            <strong>New Way Out — эфир по продажам</strong>
            <em>
              Присоединяйся к <span>открытому</span> онлайн-разбору
            </em>
          </div>
          <Cta />
          <div className={s.heroChecks}>
            <span>
              <Check />
              Участие бесплатно
            </span>
            <span>
              <Check />
              Можно без опыта
            </span>
          </div>
        </section>
        <div className={s.ribbon}>
          <div>
            {[0, 1, 2].map((i) => (
              <span key={i}>
                ШАГ ЗА ШАГОМ <i /> БЕЗ ОПЫТА <i /> ОТ КОНТАКТА ДО СДЕЛКИ <i />
              </span>
            ))}
          </div>
        </div>

        <section className={`${s.wide} ${s.panel} ${s.problem}`}>
          <div>
            <h2>
              Сколько ещё разговоров закончатся словами{" "}
              <span className={s.yellow}>«я подумаю»</span> вместо понятного
              следующего шага?
            </h2>
            <div className={s.prose}>
              <p>Давай честно. Ты наверняка узнаешь хотя бы одну ситуацию.</p>
              <p>
                → <b className={s.red}>Ты много рассказываешь о продукте,</b> а
                клиент всё равно не понимает, зачем ему покупать.
              </p>
              <p>
                → <b className={s.yellow}>Слышишь «дорого»</b> и сразу начинаешь
                оправдываться или предлагать скидку.
              </p>
              <p>
                → <b className={s.yellow}>Отправляешь презентацию</b> после
                «скиньте информацию». И диалог заканчивается тишиной.
              </p>
              <p>
                → <b className={s.yellow}>Боишься назвать цену</b> и заранее
                ждёшь отказа.
              </p>
              <p>
                → <b className={s.yellow}>Не знаешь, что спросить,</b> чтобы
                понять реальную потребность человека.
              </p>
              <p>
                → <b className={s.yellow}>Думаешь, что не умеешь продавать,</b>{" "}
                хотя тебе просто не хватает структуры разговора.
              </p>
              <p>
                <b>Это навык. Его можно разобрать и тренировать.</b>
              </p>
              <p>Именно с этого мы начнём на эфире.</p>
            </div>
          </div>
          <img
            className={s.problemPhoto}
            src="/founder.jpg"
            width="1023"
            height="1023"
            alt="Ярослав Киричук, New Way Out"
            loading="lazy"
          />
        </section>

        <section className={s.quoteSection}>
          <div className={s.quotePanel}>
            <Quote className={s.quoteIcon} fill="currentColor" />
            <h2>
              Что такое <span className={s.yellow}>продажи по системе</span> на
              самом деле?
            </h2>
            <div className={s.prose}>
              <p>
                Вместо того чтобы искать волшебную фразу или заучивать скрипт
                наизусть…
              </p>
              <p>
                Разберись, как устроено решение клиента и чем твой продукт может
                ему помочь.
              </p>
              <p>
                В основе любого разговора — <b>одна задача:</b>
              </p>
              <p>
                <b className={s.yellow}>
                  Понять человека и показать подходящее решение.
                </b>
              </p>
              <p>Когда понимаешь логику продажи, ты можешь:</p>
              <ul>
                <li>Начать разговор с понятной цели</li>
                <li>Выяснить потребность до презентации</li>
                <li>Объяснить ценность, а не перечислять функции</li>
                <li>Обсуждать цену без оправданий</li>
                <li>Завершать диалог конкретной договорённостью</li>
              </ul>
            </div>
            <Cta />
          </div>
        </section>

        <section className={`${s.wide} ${s.panel} ${s.walkthrough}`}>
          <div className={s.walkTop}>
            <div className={s.walkVisual}>
              <Mockup index={1} />
            </div>
            <div>
              <h2>
                Посмотри, как меняется разговор, когда у него появляется{" "}
                <span className={s.yellow}>структура</span>
              </h2>
              <div className={s.prose}>
                <p>Начинаем с самой основы:</p>
                <p>❌ Без заученных реплик на все случаи жизни</p>
                <p>❌ Без давления и спора с клиентом</p>
                <p>❌ Без скидки в ответ на любой вопрос</p>
                <p>
                  Разбираем <b>каждый этап</b>: контакт, потребность, ценность,
                  возражение и следующий шаг.
                </p>
                <p>Чтобы ты понимал не только что сказать, но и зачем.</p>
              </div>
              <h3 className={s.yellow}>На эфире разберём:</h3>
            </div>
          </div>
          <div className={s.walkPoints}>
            {[
              [Target, "Первый контакт и вопросы клиенту"],
              [
                MessageSquareText,
                "Формулировки, которые помогают вести диалог",
              ],
              [Handshake, "Переход от потребности к предложению"],
              [UserRoundSearch, "Логику работы с возражениями"],
              [Globe, "Следующий шаг и возвращение к разговору"],
            ].map(([Icon, text]) => {
              const I = Icon as typeof Target;
              return (
                <div key={text as string}>
                  <I />
                  <span>{text as string}</span>
                </div>
              );
            })}
            <Cta />
          </div>
        </section>

        <section className={`${s.facts} ${s.gridBackground}`}>
          <h2>Об эфире</h2>
          <div className={s.factGrid}>
            <article className={s.glass}>
              <h3>
                <CircleHelp />
                ЧТО
              </h3>
              <p>
                Открытый эфир по продажам: от первого сообщения до
                договорённости. Пять этапов диалога и разбор знакомых
                возражений.
              </p>
            </article>
            <article className={s.glass}>
              <h3>
                <MapPin />
                ГДЕ
              </h3>
              <p>
                Полностью онлайн. Запись через Telegram Ярослава. Там можно
                уточнить площадку и получить ссылку на участие.
              </p>
            </article>
            <article className={s.glass}>
              <h3>
                <CalendarDays />
                КОГДА
              </h3>
              <p>
                Дата и время уточняются.
                <br />
                <br />
                Напиши «ЭФИР» в Telegram, чтобы узнать расписание и детали
                участия.
              </p>
            </article>
          </div>
        </section>

        <section id="program" className={`${s.program} ${s.gridBackground}`}>
          <h2 className={s.bigHeading}>Что ты разберёшь на эфире</h2>
          <div className={s.programRows}>
            {eventProgram.map((item, index) => (
              <article
                key={item.title}
                className={`${s.programRow} ${index % 2 ? s.reverse : ""}`}
              >
                <div className={s.programCopy}>
                  <span className={s.programNumber}>0{index + 1}</span>
                  <h3>
                    Блок {index + 1}: {item.title}
                  </h3>
                  <p>{item.description}</p>
                  <ul>
                    {item.points.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                </div>
                <Mockup index={index} />
              </article>
            ))}
          </div>
          <Cta />
        </section>

        <section className={s.examples}>
          <h2 className={s.bigHeading}>
            Узнаёшь такие
            <br />
            диалоги с клиентами?
          </h2>
          <p className={s.centerSubtitle}>Учебные примеры из материалов NWO</p>
          <div className={s.marquee}>
            <div>
              {[0, 1].map((n) => (
                <div className={s.exampleSet} key={n} aria-hidden={n === 1}>
                  <img
                    src="/shame_deal_1.png"
                    alt="Учебный пример: скидка до выявления потребности"
                    width="250"
                    height="250"
                    loading="lazy"
                  />
                  {examples.map((item, i) => (
                    <Example key={i} item={item} />
                  ))}
                  <img
                    src="/shame_deal_2.png"
                    alt="Учебный пример: спор с клиентом о цене"
                    width="250"
                    height="250"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </div>
          <div className={`${s.marquee} ${s.opposite}`}>
            <div>
              {[0, 1].map((n) => (
                <div className={s.exampleSet} key={n} aria-hidden={n === 1}>
                  {[...examples].reverse().map((item, i) => (
                    <Example key={i} item={item} />
                  ))}
                  <img
                    src="/shame_deal_2.png"
                    alt="Учебный пример возражения о цене"
                    width="250"
                    height="250"
                    loading="lazy"
                  />
                  <img
                    src="/shame_deal_1.png"
                    alt="Учебный пример преждевременной скидки"
                    width="250"
                    height="250"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className={s.proof}>
          <h2>
            Открой материалы и посмотри,
            <br /> <span className={s.yellow}>как устроен подход NWO</span>
          </h2>
          <p className={s.centerSubtitle}>
            До эфира можно познакомиться с базой и историей автора.
            <br />
            Открытые материалы уже доступны на сайте.
          </p>
          <div className={s.proofGrid}>
            {[
              {
                title: "Словарь экспертных продаж",
                sub: "Открытый урок NWO",
                href: "/free/#first-lesson",
                type: 0,
              },
              {
                title: "Как я пришёл в продажи",
                sub: "История Ярослава Киричука",
                href: "/blog/how-i-made-11k/",
                type: 1,
              },
              {
                title: "Почему структура важнее импровизации",
                sub: "Статья о работе с клиентами",
                href: "/blog/why-managers-burn-out/",
                type: 2,
              },
            ].map((item) => (
              <Link href={item.href} className={s.proofCard} key={item.title}>
                <div
                  className={`${s.proofThumb} ${item.type === 1 ? s.photoThumb : ""}`}
                >
                  {item.type === 1 ? (
                    <img
                      src="/founder.jpg"
                      alt="Ярослав Киричук"
                      width="1023"
                      height="1023"
                      loading="lazy"
                    />
                  ) : (
                    <>
                      <span>NWO / МАТЕРИАЛЫ</span>
                      <strong>
                        {item.type === 0
                          ? "ПОНЯТЬ.\nОБЪЯСНИТЬ.\nПРОДАТЬ."
                          : "МЕНЬШЕ ХАОСА.\nБОЛЬШЕ\nСТРУКТУРЫ."}
                      </strong>
                    </>
                  )}
                  <span className={s.openCircle}>
                    <ArrowRight />
                  </span>
                </div>
                <h4>{item.title}</h4>
                <p>{item.sub}</p>
              </Link>
            ))}
          </div>
        </section>

        <section id="formats">
          <div id="pricing" className={s.pricing}>
            <h2>Вот что ты получишь, когда присоединишься:</h2>
            <p className={s.centerSubtitle}>
              <em>
                Начни с эфира. Выбери углубление, если захочешь идти дальше.
              </em>
            </p>
            <div className={s.priceGrid}>
              {[false, true].map((black) => (
                <article
                  className={`${s.priceCard} ${black ? s.vipCard : ""}`}
                  key={String(black)}
                >
                  <div className={s.price}>{black ? "$17" : "$0"}</div>
                  <h3>{black ? "NWO Black" : "Открытый эфир"}</h3>
                  <ul>
                    {included.map((x) => (
                      <li key={x}>
                        <Check />
                        {x}
                      </li>
                    ))}
                    {extras.map((x) => (
                      <li key={x} className={black ? s.vipBenefit : s.excluded}>
                        {black ? <Crown /> : <X />}
                        {x}
                      </li>
                    ))}
                  </ul>
                  <Cta
                    href={black ? "/premium/" : eventContactHref}
                    gold={black}
                  >
                    {black ? "ОТКРЫТЬ NWO BLACK" : "ЗАПИСАТЬСЯ ЧЕРЕЗ TELEGRAM"}
                  </Cta>
                  <p className={s.priceNote}>
                    {black
                      ? "Отдельный платный курс. Доступ по инвайт-коду."
                      : "Напиши Ярославу «ЭФИР» и уточни дату участия."}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className={s.bonuses}>
          <h2>
            СОБЕРИ СВОЮ СИСТЕМУ ПРОДАЖ:
            <br />
            <span className={s.yellow}>
              ОТ ВОПРОСА КЛИЕНТУ ДО СЛЕДУЮЩЕГО ШАГА
            </span>
          </h2>
          <div className={s.bonusGrid}>
            {[
              ["01", "БАЗА ПРОДАЖ", "Понимание потребности и ценности"],
              [
                "02",
                "СТРУКТУРА ДИАЛОГА",
                "Вопросы, предложение и работа с ценой",
              ],
              ["03", "ПЛАН ДЕЙСТВИЙ", "Что попробовать в следующем разговоре"],
            ].map(([n, title, sub]) => (
              <div key={n}>
                <div className={s.bonusArt}>
                  <div className={s.bonusBook}>
                    <span>NEW WAY OUT</span>
                    <b>{n}</b>
                    <strong>{title}</strong>
                    <i />
                  </div>
                </div>
                <h3>{title}</h3>
                <p>{sub}</p>
              </div>
            ))}
          </div>
        </section>

        <section className={s.guarantee}>
          <h2>
            Сначала оцени подход NWO <span className={s.yellow}>сам</span>
          </h2>
          <div className={s.prose}>
            <p>Тебе не нужно покупать курс, чтобы начать.</p>
            <p>
              Эфир бесплатный. Открытая база на сайте доступна без регистрации и
              банковской карты.
            </p>
            <p>
              Посмотри, как мы объясняем продажи. Сопоставь со своими
              разговорами и попробуй подход на практике.
            </p>
            <p>
              Если захочешь углубиться — есть NWO Black.
              <br />
              Если нужна личная работа — менторство с Ярославом.
            </p>
            <p>Продолжение выбираешь сам.</p>
          </div>
          <Cta />
        </section>

        <section className={`${s.wide} ${s.panel} ${s.whyFree}`}>
          <div>
            <h2>«Почему эфир бесплатный?»</h2>
            <div className={s.prose}>
              <p>Нормальный вопрос.</p>
              <p>
                Моя задача — познакомить тебя с NWO и показать, как я разбираю
                продажи.
              </p>
              <p>
                Не просто сказать «задавай вопросы», а показать, что именно
                спросить, зачем это нужно и как использовать ответ клиента.
              </p>
              <p>
                Кто-то начнёт с открытой базы и будет применять её
                самостоятельно.
              </p>
              <p>
                Кто-то выберет Black и пойдёт глубже в переговоры и работу с
                ценой.
              </p>
              <p>
                Кому-то нужна персональная обратная связь — для этого есть
                менторство.
              </p>
              <p>
                <b>
                  Но первый шаг — разобраться в подходе. Для этого и нужен эфир.
                </b>
              </p>
            </div>
          </div>
          <div className={s.whyArt}>
            <Mockup index={4} />
          </div>
        </section>

        <section className={s.attend}>
          <h2>
            Не откладывай ещё один
            <br />
            <span className={s.yellow}>разговор с клиентом на удачу</span>
          </h2>
          <p className={s.centerSubtitle}>Вот как присоединиться:</p>
          <div className={s.attendGrid}>
            <div>
              <span>📅</span>
              <p>
                Уточни дату и время эфира
                <br />у Ярослава в Telegram
              </p>
            </div>
            <div>
              <span>💬</span>
              <p>
                Отправь сообщение «ЭФИР»
                <br />и узнай детали участия
              </p>
            </div>
            <div>
              <span>🎯</span>
              <p>
                Подготовь ситуацию из продаж,
                <br />
                которую хочешь разобрать
              </p>
            </div>
          </div>
          <p className={s.attendCopy}>
            Хороший разговор начинается с понимания. Приходи, чтобы разобраться
            в логике продажи и собрать свои следующие действия. А до эфира
            открой бесплатные материалы — начать можно уже сейчас.
          </p>
          <Cta />
        </section>

        <section id="host" className={s.host}>
          <div className={s.hostTop}>
            <h2 className={s.bigHeading}>Кто ведёт эфир</h2>
            <div className={s.hostPortrait}>
              <img
                src="/founder.jpg"
                alt="Ярослав Киричук — автор New Way Out"
                width="1023"
                height="1023"
                loading="lazy"
              />
              <strong>Ярослав Киричук</strong>
              <span>Автор NWO / New Way Out</span>
            </div>
          </div>
          <div className={s.hostStory}>
            <p>
              Когда я начинал, мои первые звонки были неуверенными. Я забывал
              слова, а цену называл извиняющимся тоном.
            </p>
            <p>Поворотным моментом стало понимание одной вещи:</p>
            <p>
              <b className={s.yellow}>
                Клиенту важен не список характеристик. Ему нужно решение своей
                задачи.
              </b>
            </p>
            <p>
              Я стал меньше рассказывать о продукте и больше спрашивать. Что
              сейчас не получается? Что уже пробовали? Что важно при выборе?
            </p>
            <p>
              Этот опыт я собрал в NWO: открытую базу, Black и личное
              менторство.
            </p>
            <p>
              На эфире разберём эту логику по шагам — от первого контакта до
              следующего действия.
            </p>
            <Link href="/blog/how-i-made-11k/">
              Моя история — в журнале NWO →
            </Link>
          </div>
        </section>

        <section id="faq" className={s.faq}>
          <h2>Частые вопросы</h2>
          <div className={s.faqList}>
            {bootcampFaq.map((item) => (
              <details key={item.question}>
                <summary>
                  {item.question}
                  <span>+</span>
                </summary>
                <p>{item.answer}</p>
              </details>
            ))}
          </div>
          <Cta />
        </section>
      </main>
      <footer className={s.footer}>
        <p>
          <b>О РЕЗУЛЬТАТАХ ОБУЧЕНИЯ:</b>
        </p>
        <p>
          Материалы NWO посвящены навыкам продаж и коммуникации. Учебные примеры
          показывают варианты диалога и не являются отзывами или обещанием
          результата. Эффект от применения зависит от продукта, рынка, опыта и
          действий участника.
        </p>
        <p>
          Обучение не гарантирует доход, трудоустройство или определённое
          количество сделок. Black и менторство — отдельные форматы; покупать их
          для участия в бесплатном эфире не нужно. Дату, время и наличие записи
          уточняй у Ярослава.
        </p>
        <nav>
          <Link href="/free/">Бесплатный курс</Link>
          <Link href="/premium/">NWO Black</Link>
          <Link href="/mentorship/">Менторство</Link>
          <a
            href="https://t.me/c0lddev"
            target="_blank"
            rel="noopener noreferrer"
          >
            Связаться с автором
          </a>
        </nav>
        <p className={s.copyright}>
          © {new Date().getFullYear()}. New Way Out. Все права защищены.
        </p>
      </footer>
    </div>
  );
}
