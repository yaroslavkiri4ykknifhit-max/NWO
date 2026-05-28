"use client"

import { useRef, useEffect } from "react"
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

// Функция для парсинга текста и рендеринга Markdown-изображений
// Поддерживает форматы: ![описание](ссылка), ![](ссылка) и !(ссылка)
// Добавлена поддержка \s* на случай случайных переносов строк между ! и (
// Функция для парсинга инлайн-стилей (жирный, курсив, подчеркивание и цвета)
function parseInlineStyles(text: string): React.ReactNode[] {
  let parts: React.ReactNode[] = [text];

  const tokenize = (elements: React.ReactNode[]): React.ReactNode[] => {
    let current = elements;

    // Жирный текст: **текст**
    current = current.flatMap((part, i) => {
      if (typeof part !== 'string') return part;
      const regex = /\*\*([^*]+)\*\*/g;
      const subparts = [];
      let lastIndex = 0;
      let match;
      while ((match = regex.exec(part)) !== null) {
        if (match.index > lastIndex) {
          subparts.push(part.substring(lastIndex, match.index));
        }
        subparts.push(<strong key={`bold-${i}-${match.index}`} className="font-bold text-foreground">{match[1]}</strong>);
        lastIndex = regex.lastIndex;
      }
      if (lastIndex < part.length) {
        subparts.push(part.substring(lastIndex));
      }
      return subparts;
    });

    // Подчеркнутый текст: __текст__
    current = current.flatMap((part, i) => {
      if (typeof part !== 'string') return part;
      const regex = /__([^_]+)__/g;
      const subparts = [];
      let lastIndex = 0;
      let match;
      while ((match = regex.exec(part)) !== null) {
        if (match.index > lastIndex) {
          subparts.push(part.substring(lastIndex, match.index));
        }
        subparts.push(<u key={`u-${i}-${match.index}`} className="underline">{match[1]}</u>);
        lastIndex = regex.lastIndex;
      }
      if (lastIndex < part.length) {
        subparts.push(part.substring(lastIndex));
      }
      return subparts;
    });

    // Курсив: *текст*
    current = current.flatMap((part, i) => {
      if (typeof part !== 'string') return part;
      const regex = /\*([^*]+)\*/g;
      const subparts = [];
      let lastIndex = 0;
      let match;
      while ((match = regex.exec(part)) !== null) {
        if (match.index > lastIndex) {
          subparts.push(part.substring(lastIndex, match.index));
        }
        subparts.push(<em key={`em-${i}-${match.index}`} className="italic">{match[1]}</em>);
        lastIndex = regex.lastIndex;
      }
      if (lastIndex < part.length) {
        subparts.push(part.substring(lastIndex));
      }
      return subparts;
    });

    // Готовые цветные теги: <green>, <blue>, <red>, <orange>, <gray>
    const colors = [
      { tag: 'green', className: 'text-[#2b9348] font-semibold' },
      { tag: 'blue', className: 'text-blue-500 font-semibold' },
      { tag: 'red', className: 'text-red-500 font-semibold' },
      { tag: 'orange', className: 'text-orange-500 font-semibold' },
      { tag: 'gray', className: 'text-slate-400 font-medium' }
    ];

    colors.forEach(({ tag, className }) => {
      current = current.flatMap((part, i) => {
        if (typeof part !== 'string') return part;
        const regex = new RegExp(`<${tag}>([^<]+)</${tag}>`, 'g');
        const subparts = [];
        let lastIndex = 0;
        let match;
        while ((match = regex.exec(part)) !== null) {
          if (match.index > lastIndex) {
            subparts.push(part.substring(lastIndex, match.index));
          }
          subparts.push(<span key={`col-${tag}-${i}-${match.index}`} className={className}>{match[1]}</span>);
          lastIndex = regex.lastIndex;
        }
        if (lastIndex < part.length) {
          subparts.push(part.substring(lastIndex));
        }
        return subparts;
      });
    });

    // Кастомные цвета: <color=#HEX>текст</color> или <color=red>текст</color>
    current = current.flatMap((part, i) => {
      if (typeof part !== 'string') return part;
      const regex = /<color=([^>]+)>([^<]+)<\/color>/g;
      const subparts = [];
      let lastIndex = 0;
      let match;
      while ((match = regex.exec(part)) !== null) {
        if (match.index > lastIndex) {
          subparts.push(part.substring(lastIndex, match.index));
        }
        const colorVal = match[1];
        subparts.push(<span key={`col-custom-${i}-${match.index}`} style={{ color: colorVal }} className="font-semibold">{match[2]}</span>);
        lastIndex = regex.lastIndex;
      }
      if (lastIndex < part.length) {
        subparts.push(part.substring(lastIndex));
      }
      return subparts;
    });

    return current;
  };

  return tokenize(parts);
}

// Улучшенная функция для рендеринга текста, списков, цитат, заголовков и картинок из Google Таблиц
function renderFormattedContent(text: string) {
  if (!text) return null;

  const lines = text.split('\n');
  const renderedBlocks: React.ReactNode[] = [];
  let currentListItems: React.ReactNode[] = [];
  let currentListType: 'ul' | 'ol' | null = null;

  const flushList = (key: string) => {
    if (currentListItems.length > 0) {
      if (currentListType === 'ul') {
        renderedBlocks.push(
          <ul key={`list-ul-${key}`} className="list-disc pl-6 my-4 space-y-2 text-slate-700 font-sans">
            {...currentListItems}
          </ul>
        );
      } else if (currentListType === 'ol') {
        renderedBlocks.push(
          <ol key={`list-ol-${key}`} className="list-decimal pl-6 my-4 space-y-2 text-slate-700 font-sans">
            {...currentListItems}
          </ol>
        );
      }
      currentListItems = [];
      currentListType = null;
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const trimmedLine = rawLine.trim();

    // Картинки: ![описание](ссылка)
    const imgRegex = /!(?:\[([^\]]*)\])?\s*\((https?:\/\/[^\s)]+)\)/g;
    const imgMatch = imgRegex.exec(trimmedLine);
    if (imgMatch) {
      flushList(String(i));
      const alt = imgMatch[1] || "";
      const url = imgMatch[2];
      renderedBlocks.push(
        <div key={`img-block-${i}`} className="block my-6 max-w-xl mx-auto text-center">
          <img
            src={url}
            alt={alt || "Изображение"}
            className="rounded-2xl border border-border/40 max-w-full h-auto mx-auto shadow-md hover:scale-[1.01] transition-transform duration-300"
            loading="lazy"
          />
          {alt && (
            <span className="block text-center text-xs text-muted-foreground mt-2 italic">
              {alt}
            </span>
          )}
        </div>
      );
      continue;
    }

    // Заголовки
    if (trimmedLine.startsWith('# ')) {
      flushList(String(i));
      renderedBlocks.push(
        <h3 key={`h3-${i}`} className="text-2xl font-bold text-foreground mt-6 mb-3 tracking-tight font-sans">
          {parseInlineStyles(trimmedLine.substring(2))}
        </h3>
      );
      continue;
    }
    if (trimmedLine.startsWith('## ')) {
      flushList(String(i));
      renderedBlocks.push(
        <h4 key={`h4-${i}`} className="text-xl font-bold text-foreground mt-5 mb-2.5 tracking-tight font-sans">
          {parseInlineStyles(trimmedLine.substring(3))}
        </h4>
      );
      continue;
    }
    if (trimmedLine.startsWith('### ')) {
      flushList(String(i));
      renderedBlocks.push(
        <h5 key={`h5-${i}`} className="text-lg font-bold text-foreground mt-4 mb-2 tracking-tight font-sans">
          {parseInlineStyles(trimmedLine.substring(4))}
        </h5>
      );
      continue;
    }

    // Выделенный блок/цитата: > текст
    if (trimmedLine.startsWith('> ')) {
      flushList(String(i));
      renderedBlocks.push(
        <blockquote key={`quote-${i}`} className="pl-4 py-2.5 border-l-4 border-[#2b9348] bg-[#f5f9f4]/60 rounded-r-xl my-4 text-slate-700 italic font-sans leading-relaxed">
          {parseInlineStyles(trimmedLine.substring(2))}
        </blockquote>
      );
      continue;
    }

    // Маркированные списки: •, -, *, ⁃
    const isBulletList = trimmedLine.startsWith('• ') || trimmedLine.startsWith('- ') || trimmedLine.startsWith('* ') || trimmedLine.startsWith('⁃ ');
    // Нумерованные списки: "1. "
    const isNumberedList = /^\d+\.\s+/.test(trimmedLine);

    if (isBulletList) {
      if (currentListType !== 'ul') {
        flushList(String(i));
        currentListType = 'ul';
      }
      const content = trimmedLine.replace(/^(•|-|\*|⁃)\s+/, '');
      currentListItems.push(
        <li key={`li-${i}`} className="leading-relaxed">
          {parseInlineStyles(content)}
        </li>
      );
      continue;
    }

    if (isNumberedList) {
      if (currentListType !== 'ol') {
        flushList(String(i));
        currentListType = 'ol';
      }
      const content = trimmedLine.replace(/^\d+\.\s+/, '');
      currentListItems.push(
        <li key={`li-${i}`} className="leading-relaxed">
          {parseInlineStyles(content)}
        </li>
      );
      continue;
    }

    // Пустая строка
    if (trimmedLine === '') {
      flushList(String(i));
      renderedBlocks.push(<div key={`spacer-${i}`} className="h-3" />);
      continue;
    }

    // Обычный абзац текста
    flushList(String(i));
    renderedBlocks.push(
      <p key={`p-${i}`} className="my-3.5 leading-relaxed text-slate-700 font-sans">
        {parseInlineStyles(rawLine)}
      </p>
    );
  }

  // Сбрасываем последний список, если остался
  flushList('final');

  return renderedBlocks;
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
  const scrollContainerRef = useRef<HTMLElement>(null)

  // При изменении урока (когда меняется title) скроллим контейнер вверх
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0
    }
  }, [title])

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
    <main ref={scrollContainerRef} className="flex-1 overflow-y-auto bg-background">
      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <p className="text-accent text-sm font-medium mb-2">{moduleName}</p>
          <h1 className="text-2xl sm:text-3xl font-semibold text-foreground mb-4 text-balance">
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
          <div className="aspect-video bg-black rounded-2xl mb-6 sm:mb-8 overflow-hidden border border-border/40 shadow-2xl shadow-accent/5">
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
          <div className="space-y-4 mb-6 sm:mb-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <h2 className="text-xl font-semibold text-foreground font-sans">Материалы урока</h2>
            <div className="p-4 sm:p-6 bg-card/45 rounded-2xl border border-border/40 backdrop-blur-sm text-foreground leading-relaxed text-base">
              {renderFormattedContent(textContent)}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between pt-6 border-t border-border/40">
          <Button
            variant={isCompleted ? "secondary" : "default"}
            onClick={onComplete}
            className="gap-2 cursor-pointer rounded-xl h-11 px-5 w-full sm:w-auto justify-center"
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
              className="gap-2 cursor-pointer rounded-xl h-11 px-5 hover:bg-secondary/40 w-full sm:w-auto justify-center"
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
