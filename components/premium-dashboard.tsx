"use client";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { CourseModule, UserProfile } from "@/lib/sheets-api";

interface PremiumDashboardProps {
  courseName: string;
  modules: CourseModule[];
  completedLessons: string[];
  onStartLearning: () => void;
  onSelectLesson: (moduleId: string, lessonId: string) => void;
  user?: UserProfile | null;
}
export function PremiumDashboard({
  courseName,
  modules,
  completedLessons,
  onStartLearning,
  onSelectLesson,
  user,
}: PremiumDashboardProps) {
  const lessons = modules.flatMap((module) => module.lessons);
  const completedCount = lessons.filter((lesson) =>
    completedLessons.includes(lesson.id),
  ).length;
  const progress = lessons.length
    ? Math.round((completedCount / lessons.length) * 100)
    : 0;
  return (
    <main className="flex-1 overflow-y-auto">
      <div className="course-welcome">
        <span className="site-eyebrow">NWO Black / Личный кабинет</span>
        <h1>
          {user?.display_name
            ? `${user.display_name}, ты внутри.`
            : "Ты внутри NWO Black."}
        </h1>
        <p>
          {courseName}. Изучай материалы по порядку или выбери блок, который
          нужен сейчас. Отмеченные уроки сохраняются в твоём аккаунте.
        </p>
        <button onClick={onStartLearning} className="site-button">
          {completedCount === lessons.length
            ? "Повторить программу"
            : completedCount
              ? "Продолжить обучение"
              : "Начать обучение"}
          <ArrowRight size={18} />
        </button>
        <div className="course-progress-grid">
          <section className="course-progress-card">
            <span>Твой прогресс</span>
            <strong>{progress}%</strong>
            <div
              className="course-progress-bar"
              role="progressbar"
              aria-label="Прогресс NWO Black"
              aria-valuenow={progress}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <span style={{ width: `${progress}%` }} />
            </div>
            <p>
              {completedCount} из {lessons.length} уроков завершено
            </p>
          </section>
          <section className="course-progress-card">
            <span>Твоя программа</span>
            <strong>{modules.length}</strong>
            <p>тематических блоков · {lessons.length} уроков</p>
            <p>Доступ активен</p>
          </section>
        </div>
        <h2 className="text-3xl font-display mb-6">Выбери следующий блок</h2>
        <div className="grid sm:grid-cols-2 gap-5">
          {modules.map((module, i) => {
            const count = module.lessons.filter((lesson) =>
              completedLessons.includes(lesson.id),
            ).length;
            const next =
              module.lessons.find(
                (lesson) => !completedLessons.includes(lesson.id),
              ) || module.lessons[0];
            return (
              <button
                key={module.id}
                disabled={!next}
                onClick={() => next && onSelectLesson(module.id, next.id)}
                className="course-progress-card text-left cursor-pointer hover:border-black transition-colors"
              >
                <span>
                  Блок {String(i + 1).padStart(2, "0")} / {count} из{" "}
                  {module.lessons.length} пройдено
                </span>
                <h3 className="text-2xl font-display my-4">{module.title}</h3>
                <div className="flex items-center justify-between text-sm">
                  <span>
                    {count === module.lessons.length
                      ? "Повторить блок"
                      : "Открыть блок"}
                  </span>
                  {count === module.lessons.length ? (
                    <CheckCircle2 size={17} />
                  ) : (
                    <ArrowRight size={17} />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </main>
  );
}
