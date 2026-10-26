import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { BrandPlaceholder } from "@/components/brand";
import { SiteHeader, SiteFooter } from "@/components/site-shell";
export default function NotFound() {
  return (
    <div className="editorial-site">
      <SiteHeader />
      <main id="main-content" className="site-container not-found-content">
        <div>
          <span className="site-eyebrow">NEW WAY OUT / НОВЫЙ МАРШРУТ</span>
          <h1>404</h1>
          <h2>Здесь пока нет страницы.</h2>
          <p>
            Вернись на главную или продолжи знакомство с NWO в бесплатном курсе.
          </p>
          <div className="site-actions">
            <Link className="site-button" href="/">
              На главную <ArrowUpRight size={18} />
            </Link>
            <Link className="site-button site-button-outline" href="/free/">
              Бесплатный курс
            </Link>
          </div>
        </div>
        <BrandPlaceholder variant="story" />
      </main>
      <SiteFooter />
    </div>
  );
}
