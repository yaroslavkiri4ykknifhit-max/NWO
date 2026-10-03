import { CourseSchema, pageMetadata } from "@/lib/seo";
export const metadata = pageMetadata(
  "Менторство по продажам с Ярославом Киричуком",
  "30 дней личного менторства по продажам за $170: созвоны, разбор переговоров и обратная связь. Обсуди свою задачу напрямую с Ярославом.",
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
        price="170"
      />
      {children}
    </>
  );
}
