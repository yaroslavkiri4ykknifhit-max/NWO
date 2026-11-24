import { SiteHeader, SiteFooter } from "@/components/site-shell";
import { MentorshipLegalPage } from "@/components/mentorship/legal-page";
import { pageMetadata } from "@/lib/seo";
export const metadata = {
  ...pageMetadata(
    "Условия менторства и возврата",
    "Условия покупки менторства NWO, начала работы, отмены и возврата оплаты.",
    "/mentorship/terms/",
  ),
  robots: { index: false, follow: true },
};
export default function TermsPage() {
  return (
    <div className="editorial-site">
      <SiteHeader />
      <main id="main-content">
        <MentorshipLegalPage kind="offer" />
      </main>
      <SiteFooter />
    </div>
  );
}
