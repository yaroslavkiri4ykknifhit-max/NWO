"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";

export const contactHref = "https://t.me/c0lddev";
const navigation = [
  { href: "/free/", label: "Бесплатный курс" },
  { href: "/premium/", label: "NWO Black" },
  { href: "/mentorship/", label: "Менторство" },
  { href: "/blog/", label: "Журнал" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <a className="skip-link" href="#main-content">
        Перейти к содержимому
      </a>
      <header className="site-header">
        <div className="site-container site-nav">
          <Link
            href="/"
            className="site-wordmark"
            aria-label="New Way Out — главная"
          >
            New Way Out<span>Школа практических продаж</span>
          </Link>
          <nav className="site-desktop-nav" aria-label="Основная навигация">
            {navigation.map((item) => (
              <Link key={item.href} href={item.href}>
                {item.label}
              </Link>
            ))}
          </nav>
          <Link className="site-nav-cta" href="/free/">
            Начать бесплатно <ArrowUpRight size={15} />
          </Link>
          <button
            className="site-menu-toggle"
            aria-label={open ? "Закрыть меню" : "Открыть меню"}
            aria-expanded={open}
            aria-controls="site-mobile-menu"
            onClick={() => setOpen(!open)}
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
        {open && (
          <nav
            id="site-mobile-menu"
            className="site-mobile-nav"
            aria-label="Меню на телефоне"
          >
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
              >
                {item.label}
                <ArrowUpRight size={16} />
              </Link>
            ))}
            <a href={contactHref} target="_blank" rel="noopener noreferrer">
              Задать вопрос в Telegram <ArrowUpRight size={16} />
            </a>
          </nav>
        )}
      </header>
    </>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-container">
        <div className="site-footer-grid">
          <div>
            <Link className="site-wordmark" href="/">
              New Way Out
            </Link>
            <p>
              Умение продавать начинается
              <br />с умения понимать человека.
            </p>
          </div>
          <nav aria-label="Разделы сайта">
            {navigation.map((item) => (
              <Link key={item.href} href={item.href}>
                {item.label}
              </Link>
            ))}
          </nav>
          <div>
            <span className="site-eyebrow">На связи</span>
            <a
              className="site-text-link"
              href={contactHref}
              target="_blank"
              rel="noopener noreferrer"
            >
              @c0lddev <ArrowUpRight size={16} />
            </a>
            <p>
              Вопросы об обучении,
              <br />
              оплате и доступе.
            </p>
          </div>
        </div>
        <div className="site-footer-bottom">
          <span>© {new Date().getFullYear()} New Way Out</span>
          <span>Практика. Обратная связь. Следующий шаг.</span>
        </div>
      </div>
    </footer>
  );
}

export function CourseFolio({ black = false }: { black?: boolean }) {
  return (
    <div
      className={`folio-scene ${black ? "folio-scene-black" : ""}`}
      aria-hidden="true"
    >
      <div className="folio-orbit" />
      <div className="folio-shadow" />
      <div className="course-folio">
        <div className="folio-top">
          <span>NWO / FIELD NOTES</span>
          <span>01—06</span>
        </div>
        <div className="folio-title">
          The art
          <br />
          of the
          <br />
          <em>conversation.</em>
        </div>
        <div className="folio-mark">
          N<span>W</span>O
        </div>
        <div className="folio-bottom">
          <span>{black ? "BLACK EDITION" : "NEW WAY OUT"}</span>
          <span>Практика продаж</span>
        </div>
      </div>
      <div className="folio-note">
        <span className="site-eyebrow">Первое правило</span>
        <p>
          Сначала понять.
          <br />
          <em>Потом предложить.</em>
        </p>
        <span className="folio-note-line" />
      </div>
      <span className="folio-caption">Навык, который остаётся с тобой.</span>
    </div>
  );
}
