"use client";
import { useEffect, useRef, type ReactNode } from "react";

/** Content remains visible without JS; motion is progressive enhancement. */
export function CinematicMotion({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = root.current;
    if (!element) return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let cleanup = () => {};
    const setup = () => {
      cleanup();
      if (preference.matches) return;
      const animations: Animation[] = [];
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const animation = entry.target.animate(
              [
                { opacity: 0, transform: "translateY(28px)" },
                { opacity: 1, transform: "translateY(0)" },
              ],
              { duration: 850, easing: "cubic-bezier(.2,.65,.2,1)" },
            );
            animations.push(animation);
            observer.unobserve(entry.target);
          });
        },
        { threshold: 0.12 },
      );
      element
        .querySelectorAll("[data-reveal]")
        .forEach((node) => observer.observe(node));
      const hero = element.querySelector<HTMLElement>("[data-parallax]");
      let frame = 0;
      const paint = () => {
        frame = 0;
        if (hero)
          hero.style.setProperty(
            "--drift",
            `${Math.min(window.scrollY * 0.16, 140)}px`,
          );
      };
      const scroll = () => {
        if (!frame) frame = requestAnimationFrame(paint);
      };
      paint();
      window.addEventListener("scroll", scroll, { passive: true });
      cleanup = () => {
        observer.disconnect();
        window.removeEventListener("scroll", scroll);
        cancelAnimationFrame(frame);
        animations.forEach((animation) => animation.cancel());
        hero?.style.removeProperty("--drift");
      };
    };
    setup();
    preference.addEventListener("change", setup);
    return () => {
      cleanup();
      preference.removeEventListener("change", setup);
    };
  }, []);
  return <div ref={root}>{children}</div>;
}
