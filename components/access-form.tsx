"use client"

import { useState, useEffect, useRef } from "react"
import { Lock, ArrowRight, User, ArrowLeft, ShieldAlert, ShieldCheck, HelpCircle, ExternalLink, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { validateAccessCode, loginWithTelegram, bindTelegramToCode, TelegramUser } from "@/lib/sheets-api"

// Иконка Telegram для Lucide-подобного использования
const TelegramIcon = () => (
  <svg
    className="w-5 h-5"
    fill="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.19-.04-.27-.02-.12.02-1.96 1.24-5.54 3.65-.52.36-.97.53-1.34.52-.42-.01-1.22-.24-1.82-.44-.73-.24-1.32-.37-1.27-.78.02-.21.32-.43.89-.65 3.48-1.52 5.81-2.52 6.98-3.01 3.33-1.39 4.02-1.63 4.47-1.64.1 0 .32.02.46.14.12.1.15.29.17.41-.02.1.03-.02 0 .02z" />
  </svg>
)

interface AccessFormProps {
  onAccessGranted: () => void
}

// Компонент динамической кнопки авторизации через Telegram
interface TelegramLoginProps {
  botName: string
  onAuth: (user: TelegramUser) => void
}

function TelegramWidget({ botName, onAuth }: TelegramLoginProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current || !botName) return

    const callbackName = `onTelegramAuth_${Math.floor(Math.random() * 1000000)}`
    ;(window as any)[callbackName] = (user: TelegramUser) => {
      onAuth(user)
      delete (window as any)[callbackName]
    }

    const script = document.createElement("script")
    script.src = "https://telegram.org/js/telegram-widget.js?22"
    script.async = true
    script.setAttribute("data-telegram-login", botName)
    script.setAttribute("data-size", "large")
    script.setAttribute("data-radius", "8")
    script.setAttribute("data-onauth", `${callbackName}(user)`)
    script.setAttribute("data-request-access", "write")
    script.setAttribute("data-userpic", "true")

    containerRef.current.appendChild(script)

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = ""
      }
      delete (window as any)[callbackName]
    }
  }, [botName, onAuth])

  if (!botName) return null

  return <div ref={containerRef} className="flex justify-center min-h-[40px] transition-all duration-200" />
}

export function AccessForm({ onAccessGranted }: AccessFormProps) {
  const [view, setView] = useState<"initial" | "tg_binding">("initial")
  const [code, setCode] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [telegramUser, setTelegramUser] = useState<TelegramUser | null>(null)

  const botName = process.env.NEXT_PUBLIC_TELEGRAM_BOT_NAME || ""

  // Обработка стандартного входа по коду
  const handleSubmitCodeOnly = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    const trimmedCode = code.trim()
    if (trimmedCode.length < 8) {
      setError("Код должен быть не менее 8 символов")
      setIsLoading(false)
      return
    }

    const isValid = await validateAccessCode(trimmedCode)

    if (isValid) {
      localStorage.setItem("nwo_access_code", trimmedCode)
      onAccessGranted()
    } else {
      setError("Неверный код доступа")
    }
    setIsLoading(false)
  }

  // Обработка входа через Telegram
  const handleTelegramAuth = async (user: TelegramUser) => {
    setError("")
    setIsLoading(true)

    const response = await loginWithTelegram(user)

    if (response.valid && response.code) {
      // Пользователь уже привязан к коду
      localStorage.setItem("nwo_access_code", response.code)
      localStorage.setItem("nwo_telegram_user", JSON.stringify(user))
      
      // Синхронизируем сохраненный в Google Sheets прогресс с локальным устройством
      if (response.completed_lessons !== undefined) {
        const completedList = response.completed_lessons.split(',').filter(Boolean)
        localStorage.setItem("nwo_completed_lessons", JSON.stringify(completedList))
      }

      onAccessGranted()
    } else if (response.error === "not_bound") {
      // Пользователь валиден, но код еще не привязан
      setTelegramUser(user)
      setView("tg_binding")
    } else {
      setError(response.error || "Ошибка авторизации через Telegram")
    }
    setIsLoading(false)
  }

  // Обработка привязки Telegram-аккаунта к инвайт-коду
  const handleBindTelegram = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!telegramUser) return
    
    setError("")
    setIsLoading(true)

    const trimmedCode = code.trim()
    if (trimmedCode.length < 8) {
      setError("Код должен быть не менее 8 символов")
      setIsLoading(false)
      return
    }

    const response = await bindTelegramToCode(trimmedCode, telegramUser)

    if (response.valid) {
      // Успешно привязано! Сохраняем сессию
      localStorage.setItem("nwo_access_code", trimmedCode)
      localStorage.setItem("nwo_telegram_user", JSON.stringify(telegramUser))
      onAccessGranted()
    } else {
      setError(response.error || "Не удалось привязать код")
    }
    setIsLoading(false)
  }

  const handleBackToInitial = () => {
    setView("initial")
    setCode("")
    setError("")
    setTelegramUser(null)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-radial from-slate-50 via-slate-100 to-slate-200/50 p-4 sm:p-6 transition-all duration-300">
      <div className="w-full max-w-[440px] bg-white border border-slate-100/80 rounded-[32px] p-8 sm:p-10 shadow-2xl transition-all duration-300 relative overflow-hidden flex flex-col">
        
        {view === "initial" ? (
          <div className="animate-in fade-in zoom-in-95 duration-300">
            {/* Concentric Circles & 3D Lock Illustration */}
            <div className="relative w-40 h-40 flex items-center justify-center mb-6 mx-auto">
              {/* Outer pulsing circle */}
              <div className="absolute inset-0 rounded-full border border-blue-100/50 animate-pulse scale-[1.05]" />
              {/* Middle circle */}
              <div className="absolute w-32 h-32 rounded-full border border-blue-200/40" />
              {/* Inner circle */}
              <div className="absolute w-24 h-24 rounded-full border border-blue-300/30" />
              
              {/* White 3D lock container */}
              <div className="relative bg-white rounded-2xl w-16 h-16 flex items-center justify-center shadow-lg border border-slate-100/80">
                <Lock className="w-8 h-8 text-blue-500 fill-blue-500/10" />
              </div>

              {/* Blue shield checkmark overlay */}
              <div className="absolute top-7 right-7 bg-blue-500 text-white rounded-full p-0.5 shadow-md flex items-center justify-center w-5 h-5 border-2 border-white">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>

            {/* Header Title */}
            <div className="text-center mb-6">
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2 font-sans leading-none">
                Закрытый доступ
              </h1>
              <p className="text-slate-500 text-sm font-medium">
                Безопасный вход через Telegram
              </p>
            </div>

            {/* Safety Banner */}
            <div className="w-full bg-blue-50/50 border border-blue-100/60 rounded-2xl p-4 flex gap-3 items-start mb-6 text-left">
              <ShieldCheck className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-semibold text-blue-900 leading-tight">
                  Ваш аккаунт и данные надежно защищены
                </p>
                <p className="text-[11px] sm:text-xs text-blue-700/80 mt-1 leading-snug">
                  Доступ предоставляется только участникам сообщества NWO
                </p>
              </div>
            </div>

            {/* Telegram Login Widget & Status */}
            {botName ? (
              <div className="space-y-4 w-full">
                <div className="flex justify-center w-full min-h-[44px]">
                  <TelegramWidget botName={botName} onAuth={handleTelegramAuth} />
                </div>
                
                {error && (
                  <p className="text-sm text-destructive text-center flex items-center justify-center gap-1.5 animate-bounce">
                    <ShieldAlert className="w-4 h-4" />
                    {error}
                  </p>
                )}

                <div className="text-[11px] text-muted-foreground/80 flex items-center justify-center gap-1.5 text-center leading-none mt-2">
                  <Lock className="w-3.5 h-3.5 text-muted-foreground/60 shrink-0" />
                  <span>Мы не получаем доступ к вашим данным в Telegram</span>
                </div>
              </div>
            ) : (
              <div className="text-center text-sm text-destructive p-4 bg-destructive/10 rounded-xl">
                Ошибка конфигурации: Имя Telegram-бота не найдено.
              </div>
            )}

            {/* Divider "или" */}
            <div className="relative w-full flex items-center justify-center my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-slate-200/70" />
              </div>
              <span className="relative px-3 bg-white text-xs text-muted-foreground/75 uppercase tracking-wider font-semibold">
                или
              </span>
            </div>

            {/* "Нет Telegram?" Section */}
            <div className="w-full flex items-start gap-3.5 p-1 text-left">
              <HelpCircle className="text-muted-foreground/50 w-8 h-8 shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-bold text-slate-800 leading-snug">
                  Нет Telegram?
                </p>
                <p className="text-[11px] sm:text-xs text-muted-foreground leading-normal mt-0.5">
                  Установите Telegram и попробуйте снова.
                </p>
                <a
                  href="https://telegram.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] sm:text-xs font-semibold text-blue-500 hover:text-blue-600 transition-colors mt-1.5 cursor-pointer"
                >
                  <span>Скачать Telegram</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
            {/* Concentric Circles & Key Illustration for Binding Step */}
            <div className="relative w-40 h-40 flex items-center justify-center mb-6 mx-auto">
              <div className="absolute inset-0 rounded-full border border-accent/10 animate-pulse scale-[1.05]" />
              <div className="absolute w-32 h-32 rounded-full border border-accent/15" />
              <div className="absolute w-24 h-24 rounded-full border border-accent/20" />
              
              <div className="relative bg-white rounded-2xl w-16 h-16 flex items-center justify-center shadow-lg border border-slate-100/80">
                <ShieldCheck className="w-8 h-8 text-accent fill-accent/10" />
              </div>
            </div>

            {/* Header Title */}
            <div className="text-center mb-6">
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2 font-sans leading-none">
                Активация доступа
              </h2>
              <p className="text-slate-500 text-sm font-medium">
                Введите инвайт-код для завершения входа
              </p>
            </div>

            {/* User Info Banner */}
            <div className="w-full bg-accent/5 border border-accent/10 rounded-2xl p-4 flex gap-3 items-center mb-6 text-left">
              {telegramUser?.photo_url ? (
                <img
                  src={telegramUser.photo_url}
                  alt={telegramUser.first_name}
                  className="w-10 h-10 rounded-full border border-accent/30 object-cover shrink-0"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                  <User className="w-5 h-5 text-accent" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-semibold text-slate-800 leading-tight">
                  Вы вошли как @{telegramUser?.username || telegramUser?.first_name}
                </p>
                <p className="text-[11px] sm:text-xs text-muted-foreground mt-0.5 leading-snug">
                  Осталось ввести инвайт-код для первой привязки
                </p>
              </div>
            </div>

            {/* Invite Code Form */}
            <form onSubmit={handleBindTelegram} className="space-y-4">
              <div className="space-y-2">
                <Input
                  type="text"
                  placeholder="Введите ваш инвайт-код"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="h-12 bg-slate-50 border-slate-200 text-center text-lg tracking-widest uppercase placeholder:normal-case placeholder:tracking-normal font-mono font-semibold focus:ring-accent/50 focus:border-accent rounded-xl text-slate-800"
                  disabled={isLoading}
                />
                {error && (
                  <p className="text-sm text-destructive text-center flex items-center justify-center gap-1.5 mt-2 animate-bounce">
                    <ShieldAlert className="w-4 h-4" />
                    {error}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-accent text-accent-foreground hover:bg-accent/90 transition-all duration-300 font-semibold active:scale-[0.98] cursor-pointer rounded-xl"
                disabled={!code.trim() || isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-accent-foreground/30 border-t-accent-foreground rounded-full animate-spin" />
                    Привязка...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2 w-full">
                    Активировать и войти
                    <ArrowRight className="w-4 h-4" />
                  </span>
                )}
              </Button>

              <button
                type="button"
                onClick={handleBackToInitial}
                className="w-full h-10 mt-2 bg-transparent text-muted-foreground hover:text-foreground hover:bg-secondary/40 rounded-xl transition-all duration-200 text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer"
                disabled={isLoading}
              >
                <ArrowLeft className="w-4 h-4" />
                Назад к выбору входа
              </button>
            </form>

            <div className="mt-6 p-4 rounded-2xl bg-accent/5 border border-accent/10/70 flex gap-3 items-start text-left">
              <Info className="w-4 h-4 text-accent shrink-0 mt-0.5" />
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                После успешной привязки инвайт-код навсегда закрепится за вашим Telegram. На других устройствах вы сможете входить мгновенно в один клик.
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
