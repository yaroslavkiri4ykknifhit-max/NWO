"use client"

import { useState, useEffect, useRef } from "react"
import { Lock, ArrowRight, User, ArrowLeft, ShieldAlert } from "lucide-react"
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
    <div className="min-h-screen flex items-center justify-center bg-radial from-background via-background/95 to-secondary/30 p-4">
      <div className="w-full max-w-md bg-card/30 border border-border/40 backdrop-blur-xl rounded-2xl p-8 shadow-2xl transition-all duration-300 hover:shadow-accent/5">
        
        {view === "initial" ? (
          <div>
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/10 border border-accent/20 mb-5 relative group transition-all duration-300 hover:bg-accent/20">
                <TelegramIcon />
              </div>
              <h1 className="text-3xl font-semibold text-foreground tracking-tight mb-2">
                Вход на платформу
              </h1>
              <p className="text-muted-foreground text-sm max-w-xs mx-auto">
                Для защиты вашего прогресса и аккаунта сначала авторизуйтесь через Telegram
              </p>
            </div>

            {botName ? (
              <div className="space-y-6">
                <div className="space-y-3">
                  <TelegramWidget botName={botName} onAuth={handleTelegramAuth} />
                  {error && (
                    <p className="text-sm text-destructive text-center flex items-center justify-center gap-1.5 mt-2 animate-bounce">
                      <ShieldAlert className="w-4 h-4" />
                      {error}
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center text-sm text-destructive p-4 bg-destructive/10 rounded-xl">
                Ошибка конфигурации: Имя Telegram-бота не найдено.
              </div>
            )}

            <div className="mt-8 p-4 rounded-xl bg-secondary/35 border border-border/30">
              <p className="text-xs text-muted-foreground text-center leading-relaxed">
                ℹ️ После авторизации в Telegram вам будет предложено ввести инвайт-код доступа для первой активации профиля.
              </p>
            </div>

            <p className="mt-8 text-center text-xs text-muted-foreground">
              Доступ предоставляется строго участникам сообщества NWO
            </p>
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/10 border border-accent/20 mb-5">
                <TelegramIcon />
              </div>
              <h2 className="text-2xl font-semibold text-foreground tracking-tight mb-2">
                Привязка Telegram
              </h2>
              <p className="text-muted-foreground text-sm max-w-xs mx-auto">
                Вы успешно вошли как <strong className="text-foreground">@{telegramUser?.username || telegramUser?.first_name}</strong>. Введите ваш инвайт-код для привязки.
              </p>
            </div>

            <form onSubmit={handleBindTelegram} className="space-y-4">
              <div className="space-y-2">
                <Input
                  type="text"
                  placeholder="Введите инвайт-код"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="h-12 bg-input/40 border-border/50 text-center text-lg tracking-widest uppercase placeholder:normal-case placeholder:tracking-normal focus:ring-accent/50 focus:border-accent"
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
                className="w-full h-12 bg-accent text-accent-foreground hover:bg-accent/90 transition-all duration-300 font-medium active:scale-[0.98] cursor-pointer"
                disabled={!code.trim() || isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-accent-foreground/30 border-t-accent-foreground rounded-full animate-spin" />
                    Привязка...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Активировать и войти
                    <ArrowRight className="w-4 h-4" />
                  </span>
                )}
              </Button>

              <button
                type="button"
                onClick={handleBackToInitial}
                className="w-full h-10 mt-2 bg-transparent text-muted-foreground hover:text-foreground hover:bg-secondary/20 rounded-lg transition-all duration-200 text-sm font-medium flex items-center justify-center gap-2 cursor-pointer"
                disabled={isLoading}
              >
                <ArrowLeft className="w-4 h-4" />
                Назад к выбору входа
              </button>
            </form>

            <div className="mt-6 p-4 rounded-xl bg-accent/5 border border-accent/10">
              <p className="text-xs text-muted-foreground text-center leading-relaxed">
                ℹ️ После привязки этот инвайт-код будет закреплен за вашим аккаунтом Telegram. На других устройствах вы сможете входить мгновенно через этот Telegram без ввода кода.
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
