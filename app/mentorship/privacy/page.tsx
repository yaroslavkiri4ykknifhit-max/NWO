import { SiteHeader, SiteFooter } from "@/components/site-shell";
import { MentorshipLegalPage } from "@/components/mentorship/legal-page";
import { pageMetadata } from "@/lib/seo";
export const metadata = {
  ...pageMetadata(
    "Обработка данных при покупке",
    "Какие данные нужны для заявки на менторство NWO и как обрабатывается подтверждение оплаты.",
    "/mentorship/privacy/",
  ),
  robots: { index: false, follow: true },
};
export default function PrivacyPage() {
  return (
    <div className="editorial-site">
      <SiteHeader />
      <main id="main-content">
        <MentorshipLegalPage kind="privacy" />
      </main>
      <SiteFooter />
    </div>
  );
}
