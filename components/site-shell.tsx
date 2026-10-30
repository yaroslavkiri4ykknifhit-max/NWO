"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { BrandMark, BrandPlaceholder } from "@/components/brand";

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
        { href: "/#formats", label: "Обучение" },
        { href: "/blog/", label: "Журнал" },
      ]
    : [{ href: "/#program", label: "Эфир" }, ...courseNavigation];
  const mobileNavigation = [
    ...navigation,
    { href: "/mentorship/", label: "Менторство" },
    { href: "/free/", label: "Бесплатный курс" },
    { href: "/premium/#login", label: "Войти в Black" },
  ].filter(
    (item, index, items) =>
      items.findIndex((candidate) => candidate.href === item.href) === index,
  );
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
          <BrandMark />
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
            {mobileNavigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
              >
                {item.label}
                <ArrowUpRight size={17} />
              </Link>
            ))}
          </nav>
        )}
      </header>
      {open && (
        <button
          type="button"
          className="site-menu-backdrop"
          tabIndex={-1}
          aria-hidden="true"
          onClick={() => setOpen(false)}
        />
      )}
    </>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-container">
        <div className="footer-top">
          <BrandMark />
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
        <p className="footer-conditions">
          Материалы NWO посвящены навыкам продаж и коммуникации. Учебные примеры
          не являются обещанием результата. Эффект зависит от продукта, рынка,
          опыта и практики. Обучение не гарантирует доход, трудоустройство или
          определённое количество сделок.
        </p>
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
    <div className="art-panel">
      <BrandPlaceholder variant="course" black={black} />
    </div>
  );
}
