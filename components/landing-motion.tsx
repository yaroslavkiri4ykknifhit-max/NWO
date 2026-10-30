"use client";
import { useEffect, useRef, type ReactNode } from "react";

/** Native vertical scrolling. Animation never intercepts wheel, touch or keyboard. */
export function LandingMotion({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = root.current;
    if (!element) return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const desktop = window.matchMedia("(min-width: 768px)");
    let teardown = () => {};
    const setup = () => {
      teardown();
      // Mobile uses CSS entrance effects only; no per-scroll geometry work.
      if (preference.matches || !desktop.matches) return;
      const opening = element.querySelector<HTMLElement>(".opening-scene");
      const ink = element.querySelector<HTMLElement>("[data-ink]");
      const steps = Array.from(
        element.querySelectorAll<HTMLElement>("[data-step]"),
      );
      let frame = 0;
      const clamp = (n: number) => Math.max(0, Math.min(n, 1));
      const paint = () => {
        frame = 0;
        if (opening) {
          const rect = opening.getBoundingClientRect();
          const progress = clamp(
            -rect.top / Math.max(1, rect.height - innerHeight),
          );
          opening.style.setProperty("--scene-progress", String(progress));
        }
        if (ink) {
          const rect = ink.getBoundingClientRect();
          ink.style.setProperty(
            "--ink-progress",
            `${clamp((innerHeight * 0.9 - rect.top) / (rect.height + innerHeight * 0.2)) * 140}%`,
          );
        }
        steps.forEach((step) => {
          const rect = step.getBoundingClientRect();
          if (rect.bottom > 0 && rect.top < innerHeight)
            step.style.setProperty(
              "--step-lift",
              `${Math.max(0, (rect.top - innerHeight * 0.65) * 0.12)}px`,
            );
        });
      };
      const scroll = () => {
        if (!frame) frame = requestAnimationFrame(paint);
      };
      paint();
      window.addEventListener("scroll", scroll, { passive: true });
      window.addEventListener("resize", scroll);
      teardown = () => {
        window.removeEventListener("scroll", scroll);
        window.removeEventListener("resize", scroll);
        cancelAnimationFrame(frame);
        opening?.style.removeProperty("--scene-progress");
        ink?.style.removeProperty("--ink-progress");
        steps.forEach((step) => step.style.removeProperty("--step-lift"));
      };
    };
    setup();
    preference.addEventListener("change", setup);
    desktop.addEventListener("change", setup);
    return () => {
      teardown();
      preference.removeEventListener("change", setup);
      desktop.removeEventListener("change", setup);
    };
  }, []);
  return <div ref={root}>{children}</div>;
}
