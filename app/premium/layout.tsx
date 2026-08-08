import type { Metadata } from "next"

export const metadata: Metadata = {
  metadataBase: new URL("https://newwayout.online"),
  title: "Платное обучение | NWO",
  description: "NWO BLACK — закрытая премиальная система обучения продажам.",
  openGraph: {
    title: "NWO BLACK · Premium Sales System",
    description: "Закрытая премиальная система обучения продажам.",
    url: "/premium/",
    siteName: "NWO BLACK",
    type: "website",
    images: [
      {
        url: "/premium-og.png",
        width: 1731,
        height: 909,
        alt: "NWO BLACK — Premium Sales System",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "NWO BLACK · Premium Sales System",
    description: "Закрытая премиальная система обучения продажам.",
    images: ["/premium-og.png"],
  },
}

export default function PremiumLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children
}
