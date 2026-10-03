"use client";

import { ProgramIntro, CourseLoading } from "@/components/program-intro";

import { useCallback, useEffect, useState } from "react";
import {
  ArrowLeft,
  Crown,
  LockKeyhole,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { AccessForm } from "@/components/access-form";
import { CourseHeader } from "@/components/course-header";
import { LessonSidebar } from "@/components/lesson-sidebar";
import { LessonViewer } from "@/components/lesson-viewer";
import { PremiumDashboard } from "@/components/premium-dashboard";
import Link from "next/link";
import {
  CourseData,
  UserProfile,
  fetchPaidCourseData,
  getPaidAuthSession,
  logout,
  savePaidProgress,
} from "@/lib/sheets-api";

type PaidAccessState = "checking" | "login" | "unpaid" | "granted";

export default function PremiumPage() {
  const [showLogin, setShowLogin] = useState(false);
  const [savingProgress, setSavingProgress] = useState(false);
  const [progressError, setProgressError] = useState("");
  const [accessState, setAccessState] = useState<PaidAccessState>("checking");
  const [user, setUser] = useState<UserProfile | null>(null);
  const [courseData, setCourseData] = useState<CourseData | null>(null);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentModuleId, setCurrentModuleId] = useState("");
  const [currentLessonId, setCurrentLessonId] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsSidebarOpen(window.innerWidth >= 1024);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const refreshAccess = useCallback(async () => {
    setAccessState("checking");
    const session = await getPaidAuthSession();
    setUser(session.user);
    setCompletedLessons(session.completedLessons);

    if (!session.authenticated) {
      setAccessState("login");
    } else if (!session.paidAccess) {
      setAccessState("unpaid");
    } else {
      setAccessState("granted");
    }
  }, []);

  useEffect(() => {
    void refreshAccess();
  }, [refreshAccess]);

  const loadCourseData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchPaidCourseData();
      setCourseData(result.course);
      setCompletedLessons(result.completedLessons);
      setCurrentModuleId("");
      setCurrentLessonId("");
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Не удалось загрузить платные материалы",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (accessState === "granted") void loadCourseData();
  }, [accessState, loadCourseData]);

  const handleLogout = async () => {
    await logout();
    setUser(null);
    setCourseData(null);
    setCompletedLessons([]);
    setAccessState("login");
  };

  if ((accessState === "checking" || accessState === "login") && !showLogin) {
    return (
      <ProgramIntro variant="premium" onStart={() => setShowLogin(true)} />
    );
  }

  if (accessState === "checking") {
    return <CourseLoading label="Проверяем доступ" />;
  }

  if (accessState === "login") {
    return (
      <AccessForm
        onAccessGranted={refreshAccess}
        onBack={() => setShowLogin(false)}
        variant="premium"
      />
    );
  }

  if (accessState === "unpaid") {
    const displayName = user?.display_name || user?.email || "пользователь";

    return (
      <main className="access-surface flex items-center justify-center p-4 sm:p-6 font-ui text-[#121212]">
        <section className="access-card w-full max-w-lg border-2 border-black p-8 sm:p-12 text-center bg-[#fafaf9] shadow-sm">
          <div className="mb-6">
            <span
              className="text-3xl sm:text-4xl text-black block tracking-tight select-none"
              style={{ fontFamily: "'UnifrakturMaguntia', serif" }}
            >
              New Way Out
            </span>
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-gray-500 block mt-1">
              NWO Black · Личный кабинет
            </span>
          </div>

          <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center border border-black bg-black text-white">
            <LockKeyhole className="w-6 h-6" />
          </div>

          <h1 className="text-3xl sm:text-4xl font-display font-bold text-black mb-4">
            Доступ пока не подключён
          </h1>

          <p className="text-sm text-gray-700 leading-relaxed font-ui mb-8 max-w-md mx-auto">
            Email <strong>{displayName}</strong> подтверждён, но членство в
            закрытом клубе NWO BLACK ещё не активировано. Вы можете продолжать
            учиться в бесплатной базе или написать Ярославу для подключения
            доступа.
          </p>

          <p className="text-sm text-gray-600 mb-6">
            Уже оплатил? Напиши Ярославу — он проверит твой доступ.
          </p>
          <div className="space-y-3 max-w-xs mx-auto">
            <a
              href="https://t.me/c0lddev"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 bg-black text-white py-3.5 px-6 font-bold text-xs uppercase tracking-widest hover:bg-gray-800 transition-colors"
            >
              <span>Получить доступ ($17)</span>
              <ChevronRight className="w-4 h-4" />
            </a>

            <Link
              href="/free"
              className="w-full inline-flex items-center justify-center gap-2 border border-gray-300 bg-white py-3 px-6 font-semibold text-xs text-gray-800 hover:border-black transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Бесплатная база NWO
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              className="w-full py-2 text-xs font-semibold text-gray-500 hover:text-black transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              Войти с другого аккаунта
            </button>
          </div>
        </section>
      </main>
    );
  }

  if (loading) {
    return <CourseLoading />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-4 text-center bg-white text-black font-ui">
        <div className="w-14 h-14 border border-black bg-[#fafaf9] flex items-center justify-center text-xl">
          ⚠️
        </div>
        <h2 className="text-2xl font-display font-bold text-black">
          Не удалось загрузить NWO BLACK
        </h2>
        <p className="max-w-md text-xs text-gray-600">{error}</p>
        <div className="flex flex-wrap justify-center gap-3 mt-4">
          <button
            onClick={loadCourseData}
            className="border border-black bg-black text-white px-5 py-2.5 text-xs font-bold uppercase tracking-wider hover:bg-gray-800 cursor-pointer"
          >
            Повторить
          </button>
          <Link
            href="/free"
            className="border border-gray-300 bg-white px-5 py-2.5 text-xs font-semibold text-gray-800 hover:border-black"
          >
            В бесплатный курс
          </Link>
        </div>
      </div>
    );
  }

  if (!courseData || courseData.modules.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-4 text-center bg-white text-black font-ui">
        <div className="w-16 h-16 border border-black bg-black text-white flex items-center justify-center">
          <Crown className="w-8 h-8" />
        </div>
        <h2 className="text-3xl font-display font-bold text-black">
          NWO BLACK подключён
        </h2>
        <p className="max-w-md text-xs text-gray-600">
          Доступ активен, но материалы пока не загрузились. Напиши Ярославу в
          Telegram — он поможет с курсом.
        </p>
        <Link
          href="/"
          className="mt-2 border border-black bg-black text-white px-6 py-3 text-xs font-bold uppercase tracking-wider hover:bg-gray-800"
        >
          Вернуться на главную
        </Link>
      </div>
    );
  }

  const modulesWithCompletion = courseData.modules.map((module) => ({
    ...module,
    lessons: module.lessons.map((lesson) => ({
      ...lesson,
      completed: completedLessons.includes(lesson.id),
    })),
  }));

  const currentModule = courseData.modules.find(
    (module) => module.id === currentModuleId,
  );
  const currentLesson = currentModule?.lessons.find(
    (lesson) => lesson.id === currentLessonId,
  );
  const allLessons = courseData.modules.flatMap((module) => module.lessons);
  const currentIndex = allLessons.findIndex(
    (lesson) => lesson.id === currentLessonId,
  );
  const hasNext = currentIndex >= 0 && currentIndex < allLessons.length - 1;

  const handleSelectLesson = (moduleId: string, lessonId: string) => {
    setCurrentModuleId(moduleId);
    setCurrentLessonId(lessonId);
  };

  const handleCompleteLesson = async () => {
    if (savingProgress || completedLessons.includes(currentLessonId)) return;
    const updated = [...completedLessons, currentLessonId];
    setSavingProgress(true);
    setProgressError("");
    try {
      await savePaidProgress(updated);
      setCompletedLessons(updated);
    } catch {
      setProgressError(
        "Не удалось сохранить прогресс. Нажми «Завершить урок» ещё раз.",
      );
    } finally {
      setSavingProgress(false);
    }
  };

  const handleNextLesson = () => {
    if (!hasNext) return;
    const nextLesson = allLessons[currentIndex + 1];
    const nextModule = courseData.modules.find((module) =>
      module.lessons.some((lesson) => lesson.id === nextLesson.id),
    );
    if (nextModule) handleSelectLesson(nextModule.id, nextLesson.id);
  };

  const handleStartLearning = () => {
    const nextLesson =
      allLessons.find((lesson) => !completedLessons.includes(lesson.id)) ||
      allLessons[0];
    const nextModule = courseData.modules.find((module) =>
      module.lessons.some((lesson) => lesson.id === nextLesson?.id),
    );
    if (nextModule && nextLesson)
      handleSelectLesson(nextModule.id, nextLesson.id);
  };

  return (
    <div className="learning-shell flex flex-col overflow-hidden text-black font-ui">
      <CourseHeader
        courseName={courseData.name}
        user={user}
        onToggleSidebar={() => setIsSidebarOpen((open) => !open)}
        isSidebarOpen={isSidebarOpen}
        onLogout={handleLogout}
        variant="premium"
        backHref="/"
        backLabel="На главную"
        onClickLogo={() => {
          setCurrentModuleId("");
          setCurrentLessonId("");
        }}
      />
      {progressError && (
        <p role="alert" className="px-4 py-2 text-sm bg-red-50 text-red-800">
          {progressError}
        </p>
      )}
      <div className="flex flex-1 overflow-hidden relative">
        <LessonSidebar
          modules={modulesWithCompletion}
          currentLessonId={currentLessonId}
          onSelectLesson={handleSelectLesson}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          variant="premium"
        />
        {currentLesson && currentModule ? (
          <LessonViewer
            title={currentLesson.title}
            moduleName={currentModule.title}
            textContent={currentLesson.textContent}
            videoUrl={currentLesson.videoUrl}
            onComplete={handleCompleteLesson}
            isCompleted={completedLessons.includes(currentLessonId)}
            onNext={handleNextLesson}
            hasNext={hasNext}
            variant="premium"
            saving={savingProgress}
          />
        ) : (
          <PremiumDashboard
            courseName={courseData.name}
            modules={courseData.modules}
            completedLessons={completedLessons}
            onStartLearning={handleStartLearning}
            onSelectLesson={handleSelectLesson}
            user={user}
          />
        )}
      </div>
    </div>
  );
}
