import { JsonLd } from "@/lib/seo";
import { salesFaq } from "@/lib/site-content";

import { LandingPage } from "@/components/landing-page";

export default function Home() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: salesFaq.map((item) => ({
            "@type": "Question",
            name: item.question,
            acceptedAnswer: { "@type": "Answer", text: item.answer },
          })),
        }}
      />
      <LandingPage />
    </>
  );
}
