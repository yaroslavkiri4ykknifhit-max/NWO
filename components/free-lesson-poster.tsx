import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

function PosterHand({ side }: { side: "left" | "right" }) {
  const filterId = `nwo-hand-cutout-${side}`;
  return (
    <span
      className={`lesson-poster-hand lesson-poster-hand-${side}`}
      aria-hidden="true"
    >
      <svg viewBox="0 0 367.5 435" width="367.5" height="435" focusable="false">
        <defs>
          <filter id={filterId} colorInterpolationFilters="sRGB">
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 .81  0 0 0 0 .875  0 0 0 0 .929  -.2126 -.7152 -.0722 0 1"
            />
          </filter>
        </defs>
        <image
          href="/art/lesson-hands.png"
          x={side === "left" ? 0 : -367.5}
          y="0"
          width="735"
          height="435"
          filter={`url(#${filterId})`}
        />
      </svg>
    </span>
  );
}

/** Decorative hands frame the link. They never intercept clicks or touch the portrait. */
export function FreeLessonPoster() {
  return (
    <div className="lesson-poster">
      <div className="lesson-poster-edition" aria-hidden="true">
        <span>NWO / OPEN EDITION</span>
        <span>ТВОЙ ПЕРВЫЙ ШАГ</span>
      </div>
      <div className="lesson-poster-portrait" aria-hidden="true">
        <img
          src="/art/lesson-portrait.png"
          alt=""
          width="718"
          height="885"
          loading="lazy"
        />
      </div>
      <Link
        className="lesson-poster-link"
        href="/free/#first-lesson"
        aria-label="Открыть первый бесплатный урок"
      >
        <PosterHand side="left" />
        <PosterHand side="right" />
        <span className="lesson-poster-button-copy">
          <span>БЕСПЛАТНЫЙ КУРС ПО ПРОДАЖАМ</span>
          <strong>Открыть первый урок</strong>
          <span>Без регистрации. Без оплаты.</span>
        </span>
        <span className="lesson-poster-button-arrow" aria-hidden="true">
          <ArrowUpRight />
        </span>
      </Link>
      <p className="lesson-poster-caption">Один клик — и ты в уроке.</p>
    </div>
  );
}
