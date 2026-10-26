import { JsonLd, pageMetadata } from "@/lib/seo";
import { bootcampFaq } from "@/lib/bootcamp-content";

import { LandingPage } from "@/components/landing-page";

export const metadata = pageMetadata(
  "Эфир по продажам — от первого контакта до сделки",
  "Открытый онлайн-эфир NWO с Ярославом Киричуком: потребность, ценность, цена, возражения и следующий шаг. Бесплатное участие, запись через Telegram.",
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
