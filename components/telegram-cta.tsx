"use client";

import { ArrowUpRight } from "lucide-react";
import { useEffect, useState } from "react";
import { siteConfig } from "@/lib/site-config";
import { trackEvent } from "@/lib/analytics";

type Placement = "hero" | "sticky" | "midpage" | "footer" | "header";

export function TelegramCTA({
  placement,
  className = "",
  children = "Перейти в Telegram",
}: {
  placement: Placement;
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <a
      href={siteConfig.telegramChannelUrl}
      className={`telegram-cta ${className}`}
      data-telegram-primary={
        placement === "header" || placement === "sticky" ? undefined : placement
      }
      data-placement={placement}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() =>
        trackEvent(`telegram_click_${placement}`, { destination: "channel" })
      }
    >
      <span>{children}</span>
      <ArrowUpRight aria-hidden="true" size={22} />
    </a>
  );
}

/** Appears after the hero, and yields to an inline channel CTA or open menu. */
export function StickyTelegramCTA() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const hero = document.getElementById("hero");
    if (!hero || !("IntersectionObserver" in window)) return;
    const inView = new Set<Element>();
    let heroPassed = false;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.target === hero) {
            heroPassed = entry.boundingClientRect.bottom <= 80;
          } else if (entry.isIntersecting) inView.add(entry.target);
          else inView.delete(entry.target);
        }
        setVisible(heroPassed && inView.size === 0);
      },
      { rootMargin: "-80px 0px 0px 0px", threshold: 0 },
    );
    observer.observe(hero);
    document
      .querySelectorAll("[data-telegram-primary]")
      .forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);
  return visible ? (
    <aside className="sticky-telegram" aria-label="Telegram-канал NWO">
      <TelegramCTA placement="sticky" />
    </aside>
  ) : null;
}
