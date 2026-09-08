import type { Metadata } from "next"

export const metadata: Metadata = {
  metadataBase: new URL("https://newwayout.online"),
  title: "Платное обучение продажам NWO BLACK | НВО",
  description: "NWO BLACK — закрытая премиальная система обучения продажам (НВО). Полный курс, как научиться продавать себя и продукты, договариваться и уверенно называть цену.",
  openGraph: {
    title: "Платное обучение продажам NWO BLACK | НВО",
    description: "Закрытая премиальная система обучения продажам от NWO (New Way Out).",
    url: "/premium/",
    siteName: "NWO BLACK",
    type: "website",
    images: [
      {
        url: "/premium-og.png",
        width: 1731,
        height: 909,
        alt: "NWO BLACK - Premium Sales System",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Платное обучение продажам NWO BLACK | НВО",
    description: "Закрытая премиальная система обучения продажам от NWO.",
    images: ["/premium-og.png"],
  },
}

export default function PremiumLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children
}
