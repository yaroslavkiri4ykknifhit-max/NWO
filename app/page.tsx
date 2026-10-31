import { JsonLd, pageMetadata } from "@/lib/seo";
import { bootcampFaq } from "@/lib/bootcamp-content";

import { LandingPage } from "@/components/landing-page";

export const metadata = pageMetadata(
  "Обучение продажам — навык, а не случайность",
  "NWO с Ярославом Киричуком: продажи, переговоры и коммуникация. Бесплатная база, NWO Black, менторство и открытый эфир. Присоединяйся к Telegram-каналу.",
  "/",
);

export default function Home() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: bootcampFaq.map((item) => ({
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
