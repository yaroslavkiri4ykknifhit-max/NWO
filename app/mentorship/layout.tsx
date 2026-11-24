import { CourseSchema, pageMetadata } from "@/lib/seo";
export const metadata = pageMetadata(
  "Менторство по продажам с Ярославом Киричуком",
  "30 дней личного менторства по продажам за $70: созвоны, разбор переговоров и обратная связь. Оформи заявку, выбери способ оплаты и отправь чек на проверку.",
  "/mentorship/",
);
export default function MentorshipLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <CourseSchema
        name="Менторство по продажам с Ярославом Киричуком"
        description="30 дней индивидуальной работы: созвоны, разбор переговоров, резюме и подготовка собеседований."
        path="/mentorship/"
        price="70"
      />
      {children}
    </>
  );
}
