"use client";

import { ArrowRight, ArrowUpRight } from "lucide-react";
import { UserProfile } from "@/lib/sheets-api";
import Link from "next/link";

interface DashboardProps {
  courseName: string;
  modulesCount: number;
  lessonsCount: number;
  completedCount: number;
  onStartLearning: () => void;
  user?: UserProfile | null;
  premiumHref?: string;
}

export function Dashboard({
  courseName,
  modulesCount,
  lessonsCount,
  completedCount,
  onStartLearning,
  premiumHref,
}: DashboardProps) {
  const progress = lessonsCount
    ? Math.min(100, Math.round((completedCount / lessonsCount) * 100))
    : 0;
  return (
    <main className="flex-1 overflow-y-auto">
      <div className="course-welcome">
        <span className="site-eyebrow">NWO Free / Твой кабинет</span>
        <h1>
          {completedCount
            ? "Продолжим с того, что важно."
            : "Твой первый шаг уже здесь."}
        </h1>
        <p>
          {courseName}. Выбирай урок в оглавлении или начни по порядку. После
          изучения отмечай урок завершённым — прогресс сохранится в этом
          браузере.
        </p>
        <button onClick={onStartLearning} className="site-button">
          {completedCount >= lessonsCount
            ? "Повторить с начала"
            : completedCount
              ? "Продолжить обучение"
              : "Открыть первый урок"}
          <ArrowRight size={18} />
        </button>
        <div className="course-progress-grid">
          <section className="course-progress-card">
            <span>Твой прогресс</span>
            <strong>{progress}%</strong>
            <div
              className="course-progress-bar"
              role="progressbar"
              aria-label="Прогресс курса"
              aria-valuenow={progress}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <span style={{ width: `${progress}%` }} />
            </div>
            <p>
              {completedCount} из {lessonsCount} уроков завершено
            </p>
          </section>
          <section className="course-progress-card">
            <span>Программа</span>
            <strong>{lessonsCount}</strong>
            <p>уроков в {modulesCount} тематических блоках</p>
            <p>Свой темп. Без дедлайнов.</p>
          </section>
        </div>
        {premiumHref && (
          <section className="course-upgrade">
            <div>
              <h2>База — только начало.</h2>
              <p>
                В NWO Black — больше материалов о переговорах, цене и работе с
                сомнениями. Посмотри программу и условия доступа.
              </p>
            </div>
            <Link href={premiumHref} className="site-button">
              NWO Black · $17
              <ArrowUpRight size={17} />
            </Link>
          </section>
        )}
      </div>
    </main>
  );
}
