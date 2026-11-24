import { SiteHeader, SiteFooter } from "@/components/site-shell";
import { MentorshipCheckout } from "@/components/mentorship/checkout";
import { pageMetadata } from "@/lib/seo";
export const metadata = pageMetadata(
  "Купить менторство NWO — $70",
  "30 дней личного менторства с Ярославом Киричуком. Заявка, условия возврата, выбор оплаты и отправка чека.",
  "/mentorship/buy/",
);
export default function BuyMentorshipPage() {
  return (
    <div className="editorial-site">
      <SiteHeader />
      <main id="main-content">
        <MentorshipCheckout />
      </main>
      <SiteFooter />
    </div>
  );
}
