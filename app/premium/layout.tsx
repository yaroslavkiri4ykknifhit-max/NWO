import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Платное обучение | NWO",
  description: "Закрытая платная программа обучения NWO",
}

export default function PremiumLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children
}
