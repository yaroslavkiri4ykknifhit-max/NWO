import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://newwayout.online'),
  title: 'NWO — система обучения продажам',
  description: 'Открытая база продаж и закрытая продвинутая программа NWO BLACK.',
  openGraph: {
    title: 'NWO — продажи это система',
    description: 'Начни с бесплатной базы. Переходи в NWO BLACK, когда будешь готов идти глубже.',
    url: 'https://newwayout.online',
    siteName: 'NWO',
    locale: 'ru_RU',
    type: 'website',
    images: [{ url: '/og.png', width: 1200, height: 630, alt: 'NWO — система обучения продажам' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NWO — продажи это система',
    description: 'Открытая база продаж и закрытая продвинутая программа NWO BLACK.',
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
  return (
    <html lang="ru" className="bg-background">
      <head>
        <meta httpEquiv="Referrer-Policy" content="no-referrer" />
        <meta
          httpEquiv="Content-Security-Policy"
          content="default-src 'self'; base-uri 'self'; object-src 'none'; form-action 'self'; script-src 'self' 'unsafe-inline' https://telegram.org; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https:; font-src 'self' data:; media-src 'self' blob: https:; connect-src 'self' https://script.google.com https://script.googleusercontent.com https://*.googleusercontent.com; frame-src https://oauth.telegram.org https://telegram.org https://www.youtube.com https://youtube.com https://player.vimeo.com https://rutube.ru https://drive.google.com; upgrade-insecure-requests"
        />
      </head>
      <body className="font-sans antialiased bg-background text-foreground">
        {children}
      </body>
    </html>
  )
}
