"use client";
import { useEffect, useRef, type ReactNode } from "react";
import { trackEvent } from "@/lib/analytics";

/** Native vertical scrolling; static content and immediate CTAs even without JS. */
export function LandingMotion({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = root.current;
    if (!element || !("IntersectionObserver" in window)) return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const animations: Animation[] = [];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          if (entry.target.id)
            trackEvent(
              entry.target.id === "hero" ? "hero_view" : "section_view",
              { section: entry.target.id },
            );
          if (!preference.matches && entry.target.hasAttribute("data-reveal")) {
            animations.push(
              entry.target.animate(
                [
                  { transform: "translateY(22px)" },
                  { transform: "translateY(0)" },
                ],
                {
                  duration: window.innerWidth < 768 ? 350 : 800,
                  easing: "cubic-bezier(.16,1,.3,1)",
                },
              ),
            );
          }
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.08 },
    );
    element
      .querySelectorAll("section[id], [data-reveal]")
      .forEach((node) => observer.observe(node));
    const stopMotion = () => {
      if (preference.matches)
        animations.forEach((animation) => animation.cancel());
    };
    preference.addEventListener("change", stopMotion);
    const programClick = (event: MouseEvent) => {
      const link = (event.target as Element).closest<HTMLAnchorElement>(
        "[data-program-link]",
      );
      if (link)
        trackEvent("program_click", {
          program: link.dataset.programLink || "",
        });
    };
    element.addEventListener("click", programClick);
    return () => {
      observer.disconnect();
      animations.forEach((animation) => animation.cancel());
      preference.removeEventListener("change", stopMotion);
      element.removeEventListener("click", programClick);
    };
  }, []);
  return <div ref={root}>{children}</div>;
}
