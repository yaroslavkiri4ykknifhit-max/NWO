"use client";

import { useState, useEffect, useRef, useEffectEvent } from "react";
import { ChevronDown, PlayCircle, CheckCircle2, Lock, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface Lesson {
  id: string;
  title: string;
  completed: boolean;
  locked?: boolean;
}
interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
}
interface LessonSidebarProps {
  modules: Module[];
  currentLessonId: string;
  onSelectLesson: (moduleId: string, lessonId: string) => void;
  isOpen: boolean;
  onClose: () => void;
  variant?: "default" | "premium";
}
export function LessonSidebar({
  modules,
  currentLessonId,
  onSelectLesson,
  isOpen,
  onClose,
  variant = "default",
}: LessonSidebarProps) {
  const [expanded, setExpanded] = useState<string[]>([modules[0]?.id || ""]);
  const outlineRef = useRef<HTMLElement>(null);
  useEffect(() => {
    const selected = modules.find((module) =>
      module.lessons.some((lesson) => lesson.id === currentLessonId),
    );
    if (selected)
      setExpanded((prev) =>
        prev.includes(selected.id) ? prev : [...prev, selected.id],
      );
  }, [currentLessonId, modules]);
  const closeOutline = useEffectEvent(() => onClose());
  useEffect(() => {
    if (!isOpen || window.innerWidth >= 1024) return;
    const toggle = document.querySelector<HTMLButtonElement>(
      '[aria-controls="course-outline"]',
    );
    outlineRef.current?.querySelector<HTMLButtonElement>("button")?.focus();
    const keydown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeOutline();
      if (event.key === "Tab") {
        const controls = [
          ...(outlineRef.current?.querySelectorAll<HTMLElement>(
            "button:not(:disabled), a[href]",
          ) || []),
        ];
        const first = controls[0],
          last = controls[controls.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }
    };
    window.addEventListener("keydown", keydown);
    return () => {
      window.removeEventListener("keydown", keydown);
      toggle?.focus();
    };
  }, [isOpen]);
  if (!isOpen) return null;
  const total = modules.reduce((sum, module) => sum + module.lessons.length, 0);
  return (
    <>
      <button
        tabIndex={-1}
        aria-label="Закрыть оглавление"
        onClick={onClose}
        className="course-outline-backdrop"
      />
      <aside
        id="course-outline"
        ref={outlineRef}
        className="course-outline"
        aria-label="Оглавление курса"
      >
        <div className="course-outline-heading">
          <div>
            <span className="site-eyebrow">Оглавление / {total} уроков</span>
            <h2>{variant === "premium" ? "NWO Black" : "Бесплатная база"}</h2>
          </div>
          <button
            className="outline-close"
            onClick={onClose}
            aria-label="Закрыть оглавление"
          >
            <X size={20} />
          </button>
        </div>
        <nav aria-label="Уроки курса">
          {modules.map((module, index) => (
            <div className="outline-module" key={module.id}>
              <button
                className="outline-module-toggle"
                aria-expanded={expanded.includes(module.id)}
                onClick={() =>
                  setExpanded((prev) =>
                    prev.includes(module.id)
                      ? prev.filter((id) => id !== module.id)
                      : [...prev, module.id],
                  )
                }
              >
                <span className="outline-number">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span>{module.title}</span>
                <ChevronDown
                  size={16}
                  className={cn(expanded.includes(module.id) && "rotate-180")}
                />
              </button>
              {expanded.includes(module.id) && (
                <div>
                  {module.lessons.map((lesson) => (
                    <button
                      className={`outline-lesson ${currentLessonId === lesson.id ? "outline-lesson-active" : ""}`}
                      aria-current={
                        currentLessonId === lesson.id ? "step" : undefined
                      }
                      disabled={lesson.locked}
                      key={lesson.id}
                      onClick={() => {
                        onSelectLesson(module.id, lesson.id);
                        if (window.innerWidth < 1024) onClose();
                      }}
                    >
                      {lesson.locked ? (
                        <Lock size={16} />
                      ) : lesson.completed ? (
                        <CheckCircle2 size={16} />
                      ) : (
                        <PlayCircle size={16} />
                      )}
                      <span>{lesson.title}</span>
                      {lesson.completed && (
                        <span className="sr-only"> — завершён</span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
        <a
          className="outline-support"
          href="https://t.me/c0lddev"
          target="_blank"
          rel="noopener noreferrer"
        >
          Нужна помощь? Написать Ярославу
        </a>
      </aside>
    </>
  );
}
