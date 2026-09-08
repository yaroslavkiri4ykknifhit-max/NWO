import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Бесплатное обучение продажам | NWO (НВО)",
  description: "Бесплатная база по продажам от NWO (НВО). Узнай основы, пойми, как человек принимает решение о покупке, и научись уверенно продавать.",
}

export default function FreeCourseLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children
}
