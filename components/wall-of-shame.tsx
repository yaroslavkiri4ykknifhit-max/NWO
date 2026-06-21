"use client"

import { useState, useEffect, useRef } from "react"
import { 
  ShieldAlert, 
  User, 
  Briefcase, 
  DollarSign, 
  Calendar, 
  ZoomIn, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  ArrowLeft,
  BookOpen
} from "lucide-react"
import { ShameTrade } from "@/lib/sheets-api"
import { cn } from "@/lib/utils"

interface WallOfShameProps {
  trades: ShameTrade[]
  loading?: boolean
}

// Inline styles parser (bold, underline, italic, colors)
function parseInlineStyles(text: string): React.ReactNode[] {
  let parts: React.ReactNode[] = [text];

  const tokenize = (elements: React.ReactNode[]): React.ReactNode[] => {
    let current = elements;

    // Bold text: **text**
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

    // Underline text: __text__
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

    // Italic: *text*
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

    // Custom color tags: <green>, <blue>, <red>, <orange>, <gray>
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

    return current;
  };

  return tokenize(parts);
}

// Markdown-like parser
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
          <ul key={`list-ul-${key}`} className="list-disc pl-6 my-3 space-y-1.5 text-slate-700 font-sans">
            {...currentListItems}
          </ul>
        );
      } else if (currentListType === 'ol') {
        renderedBlocks.push(
          <ol key={`list-ol-${key}`} className="list-decimal pl-6 my-3 space-y-1.5 text-slate-700 font-sans">
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

    // Headers
    if (trimmedLine.startsWith('# ')) {
      flushList(String(i));
      renderedBlocks.push(
        <h3 key={`h3-${i}`} className="text-xl font-bold text-[#b02a2a] mt-5 mb-2.5 tracking-tight font-serif flex items-center gap-2">
          {parseInlineStyles(trimmedLine.substring(2))}
        </h3>
      );
      continue;
    }
    if (trimmedLine.startsWith('## ')) {
      flushList(String(i));
      renderedBlocks.push(
        <h4 key={`h4-${i}`} className="text-lg font-bold text-slate-800 mt-4 mb-2 tracking-tight font-sans">
          {parseInlineStyles(trimmedLine.substring(3))}
        </h4>
      );
      continue;
    }
    if (trimmedLine.startsWith('### ')) {
      flushList(String(i));
      renderedBlocks.push(
        <h5 key={`h5-${i}`} className="text-base font-bold text-slate-800 mt-3 mb-1.5 tracking-tight font-sans">
          {parseInlineStyles(trimmedLine.substring(4))}
        </h5>
      );
      continue;
    }

    // Quotes
    if (trimmedLine.startsWith('> ')) {
      flushList(String(i));
      renderedBlocks.push(
        <blockquote key={`quote-${i}`} className="pl-4 py-2 border-l-4 border-red-400 bg-red-50/50 rounded-r-lg my-3 text-slate-700 italic font-sans leading-relaxed text-sm">
          {parseInlineStyles(trimmedLine.substring(2))}
        </blockquote>
      );
      continue;
    }

    // Lists
    const isBulletList = trimmedLine.startsWith('• ') || trimmedLine.startsWith('- ') || trimmedLine.startsWith('* ') || trimmedLine.startsWith('⁃ ');
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

    // Empty lines
    if (trimmedLine === '') {
      flushList(String(i));
      renderedBlocks.push(<div key={`spacer-${i}`} className="h-2" />);
      continue;
    }

    // Normal paragraph
    flushList(String(i));
    renderedBlocks.push(
      <p key={`p-${i}`} className="my-2 leading-relaxed text-slate-700 font-sans text-[15px]">
        {parseInlineStyles(rawLine)}
      </p>
    );
  }

  flushList('final');
  return renderedBlocks;
}

export function WallOfShame({ trades, loading = false }: WallOfShameProps) {
  const [selectedTradeId, setSelectedTradeId] = useState<string>("")
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0)
  const [zoomImage, setZoomImage] = useState<string | null>(null)
  const [showMobileDetail, setShowMobileDetail] = useState<boolean>(false)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (trades.length > 0 && !selectedTradeId) {
      setSelectedTradeId(trades[0].id)
    }
  }, [trades, selectedTradeId])

  // Reset scroll and image carousel when changing trade
  useEffect(() => {
    setActiveImageIndex(0)
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0
    }
  }, [selectedTradeId])

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#faf8f3] min-h-full">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-slate-500 text-sm font-neucha">Загрузка разборов сделок...</p>
        </div>
      </div>
    )
  }

  if (trades.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-[#faf8f3] min-h-full p-8 text-center max-w-xl mx-auto">
        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 text-3xl mb-4">
          📭
        </div>
        <h2 className="text-xl font-bold text-slate-800 font-serif mb-2">Разборов пока нет</h2>
        <p className="text-slate-500 text-sm font-neucha tracking-wide">
          В Google Таблице на листе «ShameTrades» пока нет активных записей. Добавьте разборы плохих сделок менеджеров, чтобы они отображались здесь.
        </p>
      </div>
    )
  }

  const currentTrade = trades.find(t => t.id === selectedTradeId) || trades[0]

  const handleSelectTrade = (id: string) => {
    setSelectedTradeId(id)
    setShowMobileDetail(true)
  }

  return (
    <main className="flex-1 flex flex-col bg-[#faf8f3] min-h-full font-sans text-slate-800 relative overflow-hidden">
      
      {/* Red sketchy decorative lines representing a warning/caution vibe */}
      <div className="absolute top-6 right-16 text-red-500/10 select-none pointer-events-none hidden lg:block">
        <svg className="w-24 h-24" fill="none" viewBox="0 0 100 100" stroke="currentColor" strokeWidth="1.5">
          <path d="M 10 10 L 90 90 M 90 10 L 10 90" strokeDasharray="3 3" />
          <circle cx="50" cy="50" r="40" />
        </svg>
      </div>

      {/* Header section with hand-drawn borders */}
      <div className="p-4 sm:p-6 border-b border-slate-200 bg-white shadow-sm shrink-0">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1">
            <div className="relative inline-flex items-center gap-1.5 px-4 py-1.5 text-red-600 bg-red-50 border border-red-200 rounded-full text-xs font-semibold tracking-wide uppercase">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Стена позора</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-serif">
              Разбор ошибок продаж
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm font-neucha tracking-wide">
              Разбираем провальные диалоги и звонки. Каждая ошибка здесь — это сэкономленные деньги в будущих сделках.
            </p>
          </div>
        </div>
      </div>

      {/* Main layout container split in two columns */}
      <div className="flex-1 flex overflow-hidden max-w-7xl w-full mx-auto relative">
        
        {/* Left column: List of deals (Always visible on desktop, hidden on mobile when showing details) */}
        <div className={cn(
          "w-full md:w-80 lg:w-96 border-r border-slate-200/80 bg-white flex flex-col shrink-0 transition-transform duration-300 md:translate-x-0",
          showMobileDetail ? "absolute inset-0 z-10 translate-x-full md:relative md:translate-x-0" : "relative translate-x-0"
        )}>
          <div className="p-3 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider font-neucha">
              Список анти-кейсов ({trades.length})
            </span>
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-2">
            {trades.map((trade) => {
              const isActive = trade.id === selectedTradeId;
              return (
                <button
                  key={trade.id}
                  onClick={() => handleSelectTrade(trade.id)}
                  className={cn(
                    "w-full p-4 rounded-2xl border text-left transition-all duration-200 hover:-translate-y-0.5 relative overflow-hidden flex flex-col justify-between group",
                    isActive
                      ? "border-red-300 bg-red-50/30 shadow-md shadow-red-900/5"
                      : "border-slate-200/60 bg-white hover:border-slate-300 hover:shadow-md hover:shadow-slate-100"
                  )}
                >
                  {/* Decorative pointer/border on the left side */}
                  <div className={cn(
                    "absolute left-0 top-0 bottom-0 w-1.5 transition-colors",
                    isActive ? "bg-red-500" : "bg-transparent group-hover:bg-slate-200"
                  )} />

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[11px] text-slate-400 font-semibold font-neucha">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-300" />
                        {trade.date}
                      </span>
                      {trade.dealAmount && (
                        <span className="px-2 py-0.5 bg-slate-100 rounded text-slate-600 font-sans">
                          {trade.dealAmount}
                        </span>
                      )}
                    </div>
                    
                    <h3 className={cn(
                      "font-bold text-[15px] font-serif leading-snug tracking-tight",
                      isActive ? "text-red-950" : "text-slate-800"
                    )}>
                      {trade.title}
                    </h3>

                    <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-100/70 text-[11px] text-slate-500">
                      <div className="flex items-center gap-1 truncate">
                        <User className="w-3 h-3 text-slate-400" />
                        <span className="truncate">{trade.manager || "Без автора"}</span>
                      </div>
                      <div className="flex items-center gap-1 truncate justify-end">
                        <Briefcase className="w-3 h-3 text-slate-400" />
                        <span className="truncate">{trade.client || "Клиент"}</span>
                      </div>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Right column: Selected Trade Details */}
        <div 
          ref={scrollContainerRef}
          className={cn(
            "flex-1 overflow-y-auto bg-[#faf8f3] p-4 sm:p-6 lg:p-8 flex flex-col transition-transform duration-300 md:translate-x-0",
            showMobileDetail ? "relative translate-x-0" : "absolute inset-0 md:relative translate-x-full md:translate-x-0"
          )}
        >
          {/* Mobile Back Button */}
          {showMobileDetail && (
            <button
              onClick={() => setShowMobileDetail(false)}
              className="md:hidden inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 bg-white border border-slate-200 px-3.5 py-2 rounded-xl mb-4 shadow-sm self-start"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Ко всем разборам</span>
            </button>
          )}

          {currentTrade ? (
            <div className="space-y-6 max-w-4xl mx-auto w-full">
              
              {/* Main Info Card */}
              <div className="bg-white border border-slate-200/60 rounded-3xl p-5 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-3 gap-3">
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-serif leading-tight">
                    {currentTrade.title}
                  </h2>
                </div>

                {/* Deal Details Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-neucha block">Менеджер</span>
                    <div className="flex items-center gap-2 text-sm text-slate-700 font-medium">
                      <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center">
                        <User className="w-3.5 h-3.5 text-slate-500" />
                      </div>
                      <span>{currentTrade.manager}</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-neucha block">Клиент / Компания</span>
                    <div className="flex items-center gap-2 text-sm text-slate-700 font-medium">
                      <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center">
                        <Briefcase className="w-3.5 h-3.5 text-slate-500" />
                      </div>
                      <span>{currentTrade.client}</span>
                    </div>
                  </div>

                  {currentTrade.dealAmount && (
                    <div className="space-y-1">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-neucha block">Сумма сделки</span>
                      <div className="flex items-center gap-2 text-sm text-red-600 font-bold font-sans">
                        <div className="w-6 h-6 rounded-full bg-red-50 flex items-center justify-center text-red-500">
                          <DollarSign className="w-3.5 h-3.5" />
                        </div>
                        <span>{currentTrade.dealAmount}</span>
                      </div>
                    </div>
                  )}

                  <div className="space-y-1">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-neucha block">Дата разбора</span>
                    <div className="flex items-center gap-2 text-sm text-slate-700 font-medium">
                      <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center">
                        <Calendar className="w-3.5 h-3.5 text-slate-500" />
                      </div>
                      <span>{currentTrade.date}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Screenshots Gallery Section */}
              {currentTrade.screenshots && currentTrade.screenshots.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-lg font-bold text-slate-800 font-serif flex items-center gap-2">
                    <BookOpen className="w-4.5 h-4.5 text-red-500" />
                    <span>Скриншоты переписки / CRM</span>
                  </h3>
                  
                  {/* Slider layout */}
                  <div className="relative group/gallery bg-white border border-slate-200/60 rounded-3xl p-4 shadow-sm flex flex-col items-center">
                    
                    {/* Image Viewer with Zoom Action */}
                    <div className="relative aspect-auto max-h-[480px] w-full rounded-2xl overflow-hidden bg-slate-950/5 flex items-center justify-center border border-slate-100">
                      <img
                        src={currentTrade.screenshots[activeImageIndex]}
                        alt={`Screenshot ${activeImageIndex + 1}`}
                        className="max-h-[480px] w-auto h-auto object-contain cursor-zoom-in"
                        onClick={() => setZoomImage(currentTrade.screenshots[activeImageIndex])}
                      />
                      
                      {/* Zoom hint overlay */}
                      <button 
                        onClick={() => setZoomImage(currentTrade.screenshots[activeImageIndex])}
                        className="absolute right-3 bottom-3 p-2 bg-white/90 hover:bg-white text-slate-800 rounded-xl shadow-lg border border-slate-200/50 backdrop-blur-sm transition-all duration-200 flex items-center gap-1.5 text-xs font-bold font-neucha cursor-pointer"
                      >
                        <ZoomIn className="w-3.5 h-3.5 text-red-500" />
                        <span>Увеличить</span>
                      </button>
                    </div>

                    {/* Gallery Navigation Controls (only if more than 1 image) */}
                    {currentTrade.screenshots.length > 1 && (
                      <div className="flex items-center justify-between w-full mt-3 px-1">
                        <button
                          onClick={() => setActiveImageIndex(prev => (prev === 0 ? currentTrade.screenshots.length - 1 : prev - 1))}
                          className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition-colors cursor-pointer"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                        
                        <span className="text-xs font-semibold text-slate-400 font-neucha">
                          {activeImageIndex + 1} из {currentTrade.screenshots.length}
                        </span>

                        <button
                          onClick={() => setActiveImageIndex(prev => (prev === currentTrade.screenshots.length - 1 ? 0 : prev + 1))}
                          className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition-colors cursor-pointer"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    )}

                    {/* Thumbnail items */}
                    {currentTrade.screenshots.length > 1 && (
                      <div className="flex gap-2.5 overflow-x-auto w-full mt-3 justify-center py-1">
                        {currentTrade.screenshots.map((img, idx) => (
                          <button
                            key={idx}
                            onClick={() => setActiveImageIndex(idx)}
                            className={cn(
                              "w-12 h-12 rounded-lg overflow-hidden border-2 shrink-0 transition-all cursor-pointer",
                              idx === activeImageIndex ? "border-red-500 scale-105" : "border-slate-200/70 hover:border-slate-300"
                            )}
                          >
                            <img src={img} alt="" className="w-full h-full object-cover" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Detailed Breakdown - Notebook Theme */}
              {currentTrade.textContent && (
                <div className="space-y-3">
                  <h3 className="text-lg font-bold text-slate-800 font-serif flex items-center gap-2">
                    <ShieldAlert className="w-4.5 h-4.5 text-red-500" />
                    <span>Разбор сделки</span>
                  </h3>
                  
                  {/* Notebook paper container */}
                  <div className="relative rounded-3xl border border-[#ebd8b6] bg-[#fdfbf2] shadow-md overflow-hidden p-6 sm:p-8">
                    
                    {/* Red notebook margin lines */}
                    <div className="absolute top-0 bottom-0 left-[35px] sm:left-[45px] w-[1px] bg-red-300" />
                    
                    {/* Handwritten paper texture content overlay */}
                    <div className="relative pl-8 sm:pl-12 font-neucha text-slate-700 text-lg sm:text-xl leading-8 tracking-wide font-medium space-y-4">
                      {renderFormattedContent(currentTrade.textContent)}
                    </div>
                  </div>
                </div>
              )}

            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-slate-400 font-neucha text-lg">Выберите кейс для просмотра</p>
            </div>
          )}
        </div>
      </div>

      {/* Lightbox / Zoom-in Fullscreen Dialog */}
      {zoomImage && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 flex flex-col justify-center items-center p-4 backdrop-blur-md transition-opacity duration-300 animate-in fade-in"
          onClick={() => setZoomImage(null)}
        >
          {/* Close button */}
          <button 
            className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors cursor-pointer"
            onClick={() => setZoomImage(null)}
          >
            <X className="w-6 h-6" />
          </button>
          
          <div className="max-w-[95vw] max-h-[85vh] relative flex items-center justify-center">
            <img 
              src={zoomImage} 
              alt="Zoomed" 
              className="max-w-full max-h-[85vh] object-contain rounded-lg border border-white/10 shadow-2xl select-none"
              onClick={(e) => e.stopPropagation()} // Prevent closing when clicking the image
            />
          </div>
          
          <p className="text-slate-400/90 text-sm font-neucha mt-4 max-w-md text-center">
            Нажмите в любое свободное место, чтобы закрыть окно
          </p>
        </div>
      )}
    </main>
  )
}
