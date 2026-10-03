import type { Metadata } from "next";
export const siteUrl = "https://newwayout.online";
export function pageMetadata(
  title: string,
  description: string,
  path: string,
): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url: path,
      type: "website",
      siteName: "New Way Out",
      locale: "ru_RU",
      images: [
        {
          url: "/og.png",
          width: 1200,
          height: 630,
          alt: "New Way Out — обучение продажам",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/og.png"],
    },
  };
}
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
export function CourseSchema({
  name,
  description,
  path,
  price,
}: {
  name: string;
  description: string;
  path: string;
  price: string;
}) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Course",
        name,
        description,
        url: `${siteUrl}${path}`,
        inLanguage: "ru",
        provider: { "@id": `${siteUrl}/#organization` },
        offers: {
          "@type": "Offer",
          price,
          priceCurrency: "USD",
          url: `${siteUrl}${path}`,
        },
      }}
    />
  );
}
