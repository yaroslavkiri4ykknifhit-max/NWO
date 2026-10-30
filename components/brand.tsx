import Link from "next/link";

export function BrandIdentity() {
  return (
    <>
      <span className="brand-mark-icon" aria-hidden="true">
        NWO
      </span>
      <span className="brand-mark-name">
        NEW WAY OUT<strong>Практика продаж</strong>
      </span>
    </>
  );
}

export function BrandMark({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      className={`brand-mark ${className}`}
      aria-label="New Way Out — главная"
    >
      <BrandIdentity />
    </Link>
  );
}

export function BrandPlaceholder({
  variant = "session",
  className = "",
  black = false,
}: {
  variant?: "session" | "portrait" | "course" | "story";
  className?: string;
  black?: boolean;
}) {
  return (
    <div
      className={`brand-art brand-art--${variant} ${black ? "brand-art--black" : ""} ${className}`}
      aria-hidden="true"
    >
      <div className="brand-art-grid" />
      <span className="brand-art-orbit brand-art-orbit-one" />
      <span className="brand-art-orbit brand-art-orbit-two" />
      <div className="brand-art-top">
        <span>NEW WAY OUT</span>
        <span>
          {black ? "BLACK EDITION" : "SALES SYSTEM"} <i />
        </span>
      </div>
      <div className="brand-art-center">
        <span className="brand-art-glyph">N</span>
        <strong>
          NWO<span>®</span>
        </strong>
        <p>
          {variant === "portrait"
            ? "ПРОДАЖИ. ОПЫТ. ПРАКТИКА."
            : variant === "story"
              ? "СВОЙ ПУТЬ В ПРОДАЖАХ"
              : black
                ? "ГЛУБЖЕ В ПЕРЕГОВОРЫ"
                : "ОТ КОНТАКТА ДО СДЕЛКИ"}
        </p>
      </div>
      <div className="brand-art-bars">
        <i />
        <i />
        <i />
        <i />
        <i />
      </div>
      <div className="brand-art-bottom">
        <span>{black ? "NWO BLACK" : "ПРАКТИКА ПРОДАЖ"}</span>
        <span>↗</span>
      </div>
    </div>
  );
}
