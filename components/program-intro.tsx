"use client";
import Link from "next/link";
import { ArrowUpRight, ArrowRight, Loader2 } from "lucide-react";
import {
  CourseFolio,
  SiteFooter,
  SiteHeader,
  contactHref,
} from "@/components/site-shell";
import { CinematicMotion } from "@/components/cinematic-motion";

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
      <CinematicMotion>
        <main id="main-content">
          <section className="site-container program-intro">
            <div className="hero-edition">
              <Link href="/#formats">Обучение /</Link>
              <span>{black ? "NWO BLACK" : "ОТКРЫТАЯ БАЗА"}</span>
            </div>
            <div className="hero-grid">
              <div className="hero-copy">
                <span className="site-eyebrow">
                  {black
                    ? "Самостоятельно. В своём темпе."
                    : "Бесплатный курс по продажам"}
                </span>
                <h1>
                  {black ? (
                    <>
                      Разговор.
                      <br />
                      Ценность.
                      <br />
                      <em>Сделка.</em>
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
                    ? "Углублённые материалы о переговорах, работе с ценой и сомнениями клиента."
                    : "Пойми задачу клиента, подготовь первый контакт и попробуй подход в своём следующем диалоге."}
                </p>
                <div className="intro-meta">
                  <span>{black ? "$17 / доступ" : "$0 / без регистрации"}</span>
                  <span>Свой темп</span>
                  <span>Сохранение прогресса</span>
                </div>
                <div className="site-actions">
                  {black ? (
                    <a
                      className="site-button"
                      href={contactHref}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Получить доступ <ArrowUpRight size={18} />
                    </a>
                  ) : (
                    <button
                      className="site-button"
                      onClick={onStart}
                      disabled={busy}
                    >
                      {busy ? "Открываем…" : "Перейти к урокам"}
                      <ArrowRight size={18} />
                    </button>
                  )}
                  {black && (
                    <button
                      id="login"
                      className="site-button site-button-outline"
                      onClick={onStart}
                    >
                      Уже купил — войти <ArrowRight size={17} />
                    </button>
                  )}
                </div>
                <p className="site-microcopy">
                  {black
                    ? "Оплата через Telegram. Вход по email и инвайт-коду."
                    : "Без карты и регистрации. Прогресс хранится в этом браузере."}
                </p>
              </div>
              <CourseFolio black={black} />
            </div>
          </section>
          <section className="site-container compact-syllabus" data-reveal>
            <span className="site-eyebrow">Что разберём</span>
            <div className="syllabus-list">
              {(black
                ? [
                    ["Переговоры", "Выстраивать диалог от вопроса к решению."],
                    [
                      "Цена и ценность",
                      "Объяснять предложение и работать с сомнениями.",
                    ],
                    ["Следующий шаг", "Договариваться о конкретном действии."],
                  ]
                : [
                    [
                      "Понять клиента",
                      "Мотивы, ожидания и правильные вопросы.",
                    ],
                    ["Начать разговор", "Первый контакт и уверенная подача."],
                    [
                      "Предложить решение",
                      "Ценность, возражения и следующий шаг.",
                    ],
                  ]
              ).map(([title, text], i) => (
                <article key={title}>
                  <span>0{i + 1}</span>
                  <h2>{title}</h2>
                  <p>{text}</p>
                </article>
              ))}
            </div>
          </section>
        </main>
      </CinematicMotion>
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
      <span className="site-wordmark">
        NWO<span>NEW WAY OUT</span>
      </span>
      <Loader2 size={24} className="animate-spin" />
      <p>{label}</p>
      <Link href="/">На главную</Link>
    </div>
  );
}
