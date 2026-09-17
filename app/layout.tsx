import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://newwayout.online'),
  title: {
    default: 'НВО обучение продажам | Курсы и менторство от NWO',
    template: '%s | NWO (New Way Out)'
  },
  description: 'НВО (New Way Out) — мощное обучение продажам с нуля. Научись продавать себя, продукты и услуги. Бесплатная база, NWO BLACK и личное менторство до результата.',
  keywords: ['НВО обучение продажам', 'НВО', 'NWO', 'New Way Out', 'new Out', 'курсы по продажам', 'обучение продажам', 'как стать менеджером по продажам', 'менторство продажи', 'NWO BLACK', 'продажи B2B', 'заработок на продажах'],
  authors: [{ name: 'NWO' }],
  creator: 'NWO',
  publisher: 'NWO',
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: 'НВО обучение продажам | Курсы и менторство от NWO',
    description: 'Освой навык, который поможет находить клиентов, показывать ценность и договариваться о деньгах. НВО (New Way Out) — твоя система продаж.',
    url: 'https://newwayout.online',
    siteName: 'NWO (New Way Out)',
    locale: 'ru_RU',
    type: 'website',
    images: [{ url: '/og.png', width: 1200, height: 630, alt: 'NWO - система обучения продажам' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'НВО обучение продажам | NWO',
    description: 'Научись продавать себя, продукты и услуги с системой NWO.',
    images: ['/og.png'],
  },
  icons: {
    icon: [
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/icon.svg',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "EducationalOrganization",
        "@id": "https://newwayout.online/#organization",
        "name": "NWO (New Way Out) - НВО обучение продажам",
        "url": "https://newwayout.online",
        "logo": "https://newwayout.online/icon.svg",
        "description": "Курс и менторство по продажам от NWO (НВО). Научись продавать себя, продукты, услуги и идеи.",
        "sameAs": [
          "https://t.me/c0lddev"
        ]
      },
      {
        "@type": "WebSite",
        "@id": "https://newwayout.online/#website",
        "url": "https://newwayout.online",
        "name": "NWO (New Way Out)",
        "description": "НВО обучение продажам. Бесплатные курсы, NWO BLACK и менторство.",
        "publisher": {
          "@id": "https://newwayout.online/#organization"
        },
        "inLanguage": "ru-RU"
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "Что такое НВО (NWO)?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "НВО (New Way Out) — это практическая система обучения продажам. Мы учим доносить ценность, работать с возражениями и экологично закрывать сделки, чтобы вы могли уверенно продавать свои услуги, продукты или идеи на высокие чеки."
            }
          },
          {
            "@type": "Question",
            "name": "Кому подойдет этот курс по продажам?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Обучение продажам NWO идеально подходит новичкам, фрилансерам, предпринимателям и всем, кто хочет стать высокооплачиваемым менеджером по продажам. Навыки применимы как в B2B, так и в B2C."
            }
          },
          {
            "@type": "Question",
            "name": "Как стать менеджером по продажам с нуля?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "В рамках нашего Менторства мы проводим обучение с абсолютного нуля, ставим навык на реальных звонках и гарантируем трудоустройство с выходом на доход от 700$ + процент от сделок."
            }
          },
          {
            "@type": "Question",
            "name": "Чем NWO BLACK отличается от бесплатной базы?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "NWO FREE даёт фундамент и понимание психологии клиента. NWO BLACK — это полная закрытая система, где разбираются конкретные скрипты, сложные переговоры, ответы на «дорого» и доведение до оплаты."
            }
          }
        ]
      }
    ,
      {
        "@type": "Course",
        "@id": "https://newwayout.online/#course",
        "name": "Практический курс по активным продажам NWO",
        "description": "Мощная система обучения продажам с нуля. Научись уверенно продавать, работать с возражениями и закрывать сделки на высокие чеки.",
        "provider": {
          "@id": "https://newwayout.online/#organization"
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "5.0",
          "ratingCount": "34",
          "reviewCount": "34"
        }
      }
    ]
  };

  return (
    <html lang="ru" className="bg-background">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=UnifrakturMaguntia&display=swap" rel="stylesheet" />
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
  )
}
