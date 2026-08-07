import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Академия | Закрытый доступ',
  description: 'Закрытая образовательная платформа',
  generator: 'v0.app',
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
