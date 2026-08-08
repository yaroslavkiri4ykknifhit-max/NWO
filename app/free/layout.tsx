import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Бесплатный курс | NWO",
  description: "Бесплатная база по продажам без регистрации, кодов доступа и Telegram.",
}

export default function FreeCourseLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children
}
