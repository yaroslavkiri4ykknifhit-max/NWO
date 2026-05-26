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
              <BookOpen className="w-4 h-4" />
              Текстовые материалы доступны ниже
            </span>
          </div>
        </div>

        {/* Video Player */}
        {videoUrl ? (
          <div className="aspect-video bg-card rounded-xl mb-8 overflow-hidden border border-border shadow-lg">
            <iframe
              src={videoUrl}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        ) : (
          <div className="aspect-video bg-card rounded-xl mb-8 flex items-center justify-center border border-border group cursor-pointer hover:border-accent/50 transition-colors">
            <div className="flex flex-col items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                <Play className="w-10 h-10 text-accent ml-1" />
              </div>
              <span className="text-muted-foreground text-sm">
                Видео отсутствует
              </span>
            </div>
          </div>
        )}

        {/* Content */}
        {textContent && (
          <div className="space-y-4 mb-8">
            <h2 className="text-xl font-semibold text-foreground">Материалы урока</h2>
            <div className="p-6 bg-card rounded-xl border border-border text-foreground leading-relaxed whitespace-pre-line text-base">
              {textContent}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-6 border-t border-border">
          <Button
            variant={isCompleted ? "secondary" : "default"}
            onClick={onComplete}
            className="gap-2"
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
            <Button variant="outline" onClick={onNext} className="gap-2">
              Следующий урок
              <ChevronRight className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </main>
  )
}
