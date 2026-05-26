"use client"

import { Play, CheckCircle2, ChevronRight, Clock, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"

interface LessonViewerProps {
  title: string
  moduleName: string
  textContent: string
  videoUrl?: string
  onComplete: () => void
  isCompleted: boolean
  onNext: () => void
  hasNext: boolean
}

export function LessonViewer({
  title,
  moduleName,
  textContent,
  videoUrl,
  onComplete,
  isCompleted,
  onNext,
  hasNext,
}: LessonViewerProps) {
  // Очищаем ссылку от пробелов
  const cleanVideoUrl = videoUrl?.trim() || ""
  
  // Урок считается видео-уроком только если ссылка заполнена и не равна прочерку "-"
  const hasVideo = cleanVideoUrl !== "" && cleanVideoUrl !== "-"

  // Проверяем, является ли ссылка прямым файлом видео или прямым стримом с Google Диска
  const isDirectVideo = hasVideo && (
    cleanVideoUrl.toLowerCase().endsWith(".mp4") ||
    cleanVideoUrl.toLowerCase().endsWith(".webm") ||
    cleanVideoUrl.toLowerCase().endsWith(".mov") ||
    cleanVideoUrl.toLowerCase().includes(".mp4?") ||
    cleanVideoUrl.toLowerCase().includes(".webm?") ||
    cleanVideoUrl.toLowerCase().includes("/raw") ||
    // Поддержка прямых ссылок на скачивание с Google Диска для нативного плеера!
    cleanVideoUrl.toLowerCase().includes("drive.google.com/uc?") ||
    cleanVideoUrl.toLowerCase().includes("docs.google.com/uc?") ||
    cleanVideoUrl.toLowerCase().includes("export=download")
  )

  return (
    <main className="flex-1 overflow-y-auto bg-background">
      <div className="max-w-4xl mx-auto p-8">
        {/* Header */}
        <div className="mb-8">
          <p className="text-accent text-sm font-medium mb-2">{moduleName}</p>
          <h1 className="text-3xl font-semibold text-foreground mb-4 text-balance">
            {title}
          </h1>

          <div className="flex items-center gap-6 mt-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-accent" />
              Текстовые материалы доступны ниже
            </span>
          </div>
        </div>

        {/* Video Player (Отображается только если видео задано) */}
        {hasVideo && (
          <div className="aspect-video bg-black rounded-2xl mb-8 overflow-hidden border border-border/40 shadow-2xl shadow-accent/5">
            {isDirectVideo ? (
              /* Нативный HTML5 плеер для прямых ссылок (.mp4 / uc?export=download) с защитой от скачивания */
              <video
                src={cleanVideoUrl}
                controls
                playsInline
                controlsList="nodownload" // Блокирует кнопку скачивания в браузере для защиты курса
                className="w-full h-full object-contain bg-black"
              />
            ) : (
              /* Iframe для YouTube, Vimeo, Rutube или Google Drive (в формате /preview) */
              <iframe
                src={cleanVideoUrl}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            )}
          </div>
        )}

        {/* Content */}
        {textContent && (
          <div className="space-y-4 mb-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <h2 className="text-xl font-semibold text-foreground">Материалы урока</h2>
            <div className="p-6 bg-card/45 rounded-2xl border border-border/40 backdrop-blur-sm text-foreground leading-relaxed whitespace-pre-line text-base">
              {textContent}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-6 border-t border-border/40">
          <Button
            variant={isCompleted ? "secondary" : "default"}
            onClick={onComplete}
            className="gap-2 cursor-pointer rounded-xl h-11 px-5"
          >
            {isCompleted ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-accent" />
                Урок завершён
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                Отметить как завершённый
              </>
            )}
          </Button>

          {hasNext && (
            <Button 
              variant="outline" 
              onClick={onNext} 
              className="gap-2 cursor-pointer rounded-xl h-11 px-5 hover:bg-secondary/40"
            >
              Следующий урок
              <ChevronRight className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </main>
  )
}
