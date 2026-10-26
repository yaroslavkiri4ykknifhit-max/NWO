"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Menu, X } from "lucide-react";

export const contactHref = "https://t.me/c0lddev";
const courseNavigation = [
  { href: "/#formats", label: "Обучение" },
  { href: "/mentorship/", label: "Менторство" },
  { href: "/blog/", label: "Журнал" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const isEvent = pathname === "/";
  const navigation = isEvent
    ? [
        { href: "/#program", label: "Программа эфира" },
        { href: "/#host", label: "Кто ведёт" },
        { href: "/#faq", label: "Вопросы" },
      ]
    : [{ href: "/#program", label: "Эфир" }, ...courseNavigation];
  const toggle = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    setOpen(false);
  }, [pathname]);
  useEffect(() => {
    if (!open) return;
    const dismiss = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        toggle.current?.focus();
      }
    };
    window.addEventListener("keydown", dismiss);
    return () => window.removeEventListener("keydown", dismiss);
  }, [open]);
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
            NWO<span>NEW WAY OUT</span>
          </Link>
          <nav className="site-desktop-nav" aria-label="Основная навигация">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={pathname === item.href ? "page" : undefined}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="nav-end">
            <Link
              className="site-nav-cta"
              href={isEvent ? "/#pricing" : "/premium/#login"}
            >
              {isEvent ? "Хочу на эфир" : "Войти в Black"}{" "}
              <ArrowUpRight size={15} />
            </Link>
            <button
              ref={toggle}
              className="site-menu-toggle"
              aria-label={open ? "Закрыть меню" : "Открыть меню"}
              aria-expanded={open}
              aria-controls="site-mobile-menu"
              onClick={() => setOpen(!open)}
            >
              {open ? <X /> : <Menu />}
            </button>
          </div>
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
                <ArrowUpRight size={17} />
              </Link>
            ))}
            <Link href="/free/" onClick={() => setOpen(false)}>
              Бесплатный курс <ArrowUpRight size={17} />
            </Link>
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
        <div className="footer-top">
          <Link className="site-wordmark" href="/">
            NWO<span>NEW WAY OUT</span>
          </Link>
          <p>Навык, который остаётся с тобой.</p>
          <a
            className="site-text-link"
            href={contactHref}
            target="_blank"
            rel="noopener noreferrer"
          >
            Написать Ярославу <ArrowUpRight size={17} />
          </a>
        </div>
        <div className="site-footer-bottom">
          <span>© {new Date().getFullYear()} New Way Out</span>
          <nav aria-label="Все разделы">
            <Link href="/free/">Бесплатный курс</Link>
            <Link href="/premium/">Black</Link>
            <Link href="/mentorship/">Менторство</Link>
            <Link href="/blog/">Журнал</Link>
          </nav>
          <span>Практика продаж</span>
        </div>
      </div>
    </footer>
  );
}

export function CourseFolio({ black = false }: { black?: boolean }) {
  return (
    <div
      className={`art-panel ${black ? "art-panel-black" : ""}`}
      aria-hidden="true"
    >
      <img src="/art/impasto-blue.webp" alt="" width="1672" height="941" />
      <div className="art-panel-caption">
        <span>NWO / {black ? "BLACK EDITION" : "OPEN EDITION"}</span>
        <strong>
          Искусство
          <br />
          <em>диалога.</em>
        </strong>
        <span>ПРАКТИКА ПРОДАЖ</span>
      </div>
    </div>
  );
}
