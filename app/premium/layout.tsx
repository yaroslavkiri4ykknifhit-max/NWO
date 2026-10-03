import { CourseSchema, pageMetadata } from "@/lib/seo";
export const metadata = pageMetadata(
  "NWO Black — обучение переговорам и продажам",
  "NWO Black за $17: углублённые материалы о переговорах, цене и возражениях. Узнай условия, получи доступ или войди в кабинет ученика.",
  "/premium/",
);
export default function PremiumLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <CourseSchema
        name="NWO Black"
        description="Углублённое обучение переговорам: работа с ценой, сомнениями и инструментами закрытия сделок."
        path="/premium/"
        price="17"
      />
      {children}
    </>
  );
}
