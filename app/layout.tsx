import type { Metadata } from "next";
import "./globals.css";
import "./editorial.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://newwayout.online"),
  title: {
    default: "Обучение продажам: бесплатный курс и менторство | NWO",
    template: "%s | NWO",
  },
  description:
    "Практическое обучение продажам от New Way Out: бесплатная база, NWO Black за $17 и личное менторство. Первый контакт, ценность, цена и переговоры.",
  keywords: [
    "НВО обучение продажам",
    "НВО",
    "NWO",
    "New Way Out",
    "new Out",
    "курсы по продажам",
    "обучение продажам",
    "как стать менеджером по продажам",
    "менторство продажи",
    "NWO BLACK",
    "продажи B2B",
    "заработок на продажах",
  ],
  authors: [{ name: "NWO" }],
  creator: "NWO",
  publisher: "NWO",
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "Обучение продажам: бесплатный курс и менторство",
    description:
      "Освой навык, который поможет находить клиентов, показывать ценность и договариваться о деньгах. НВО (New Way Out) — твоя система продаж.",
    url: "https://newwayout.online",
    siteName: "NWO (New Way Out)",
    locale: "ru_RU",
    type: "website",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "NWO - система обучения продажам",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "НВО обучение продажам | NWO",
    description: "Научись продавать себя, продукты и услуги с системой NWO.",
    images: ["/og.png"],
  },
  icons: {
    icon: [
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "EducationalOrganization",
        "@id": "https://newwayout.online/#organization",
        name: "New Way Out (NWO)",
        url: "https://newwayout.online",
        logo: "https://newwayout.online/icon.svg",
        description:
          "Курс и менторство по продажам от NWO (НВО). Научись продавать себя, продукты, услуги и идеи.",
        sameAs: ["https://t.me/c0lddev"],
      },
      {
        "@type": "WebSite",
        "@id": "https://newwayout.online/#website",
        url: "https://newwayout.online",
        name: "NWO (New Way Out)",
        description:
          "НВО обучение продажам. Бесплатные курсы, NWO BLACK и менторство.",
        publisher: {
          "@id": "https://newwayout.online/#organization",
        },
        inLanguage: "ru-RU",
      },
    ],
  };

  return (
    <html lang="ru" className="bg-background">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Manrope:wght@400;500;600;700&family=Inter:wght@400;500;600;700;800&family=Syne:wght@600;700;800&family=UnifrakturMaguntia&display=swap"
          rel="stylesheet"
        />
        <meta httpEquiv="Referrer-Policy" content="no-referrer" />
        <meta
          httpEquiv="Content-Security-Policy"
          content="default-src 'self'; base-uri 'self'; object-src 'none'; form-action 'self'; script-src 'self' 'unsafe-inline' https://telegram.org; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: blob: https:; font-src 'self' data: https://fonts.gstatic.com; media-src 'self' blob: https:; connect-src 'self' https://script.google.com https://script.googleusercontent.com https://*.googleusercontent.com; frame-src https://oauth.telegram.org https://telegram.org https://www.youtube.com https://youtube.com https://player.vimeo.com https://rutube.ru https://drive.google.com; upgrade-insecure-requests"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-sans antialiased bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
