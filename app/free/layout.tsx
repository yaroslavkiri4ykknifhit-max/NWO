import { CourseSchema, pageMetadata } from "@/lib/seo";
export const metadata = pageMetadata(
  "Бесплатный курс по продажам с нуля",
  "Бесплатная база продаж NWO: первый контакт, психология клиента и работа с возражениями. Без регистрации и оплаты. Учись в своём темпе.",
  "/free/",
);
export default function FreeCourseLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <CourseSchema
        name="Бесплатная база продаж NWO"
        description="Первый контакт, психология клиента, ценность предложения и работа с сомнениями."
        path="/free/"
        price="0"
      />
      {children}
    </>
  );
}
