import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Демонстрация анимации",
  robots: { index: false, follow: false },
};
export default function LoaderDemoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
