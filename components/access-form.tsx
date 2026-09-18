"use client"

import { useState, useEffect, useRef } from "react"
import { ArrowLeft, ShieldAlert, ShieldCheck, HelpCircle, Info, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { loginWithTelegram, bindTelegramToCode, TelegramUser } from "@/lib/sheets-api"
import { GothicHandwrittenLoader } from "@/components/gothic-handwritten-loader"
import Link from "next/link"

declare global {
  interface Window {
    onTelegramAuth?: (user: TelegramUser) => void
  }
}

interface AccessFormProps {
  onAccessGranted: () => void
  variant?: "default" | "premium"
}

interface TelegramLoginProps {
  botName: string
  onAuth: (user: TelegramUser) => void
  onInitiateLogin: () => void
}

function TelegramWidget({ botName, onAuth, onInitiateLogin }: TelegramLoginProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current || !botName) return

    // Callback при подтверждении в официальном модальном окне Telegram
    window.onTelegramAuth = (user: TelegramUser) => {
      onInitiateLogin()
      onAuth(user)
    }

    // Проверка параметров при возврате через редирект
    const telegramFields = [
      "id",
      "first_name",
      "last_name",
      "username",
      "photo_url",
      "auth_date",
      "hash",
    ]
    const url = new URL(window.location.href)
    const id = Number(url.searchParams.get("id"))
    const authDate = Number(url.searchParams.get("auth_date"))
    const hash = url.searchParams.get("hash") || ""
    const firstName = url.searchParams.get("first_name") || ""

    if (
      Number.isSafeInteger(id) &&
      id > 0 &&
      Number.isSafeInteger(authDate) &&
      authDate > 0 &&
      /^[a-f0-9]{64}$/i.test(hash) &&
      firstName
    ) {
      onInitiateLogin()

      const user: TelegramUser = {
        id,
        first_name: firstName,
        auth_date: authDate,
        hash,
      }

      const lastName = url.searchParams.get("last_name")
      const username = url.searchParams.get("username")
      const photoUrl = url.searchParams.get("photo_url")
      if (lastName) user.last_name = lastName
      if (username) user.username = username
      if (photoUrl) user.photo_url = photoUrl

      telegramFields.forEach((field) => url.searchParams.delete(field))
      window.history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`)
      onAuth(user)
      return
    }

    // Очищаем контейнер перед монтированием скрипта
    containerRef.current.innerHTML = ""

    const script = document.createElement("script")
    script.src = "https://telegram.org/js/telegram-widget.js?22"
    script.async = true
    script.setAttribute("data-telegram-login", botName)
    script.setAttribute("data-size", "large")
    script.setAttribute("data-radius", "0")
    script.setAttribute("data-lang", "ru")
    script.setAttribute("data-onauth", "onTelegramAuth(user)")
    script.setAttribute("data-request-access", "write")
    script.setAttribute("data-userpic", "true")

    containerRef.current.appendChild(script)

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = ""
      }
      delete window.onTelegramAuth
    }
  }, [botName, onAuth, onInitiateLogin])

  if (!botName) return null

  return (
    <div 
      ref={containerRef} 
      className="flex justify-center items-center min-h-[44px] transition-all"
    />
  )
}

export function AccessForm({ onAccessGranted, variant = "default" }: AccessFormProps) {
  const [view, setView] = useState<"initial" | "tg_binding">("initial")
  const [code, setCode] = useState("")
  const [error, setError] = useState("")
  const [isLocalhost, setIsLocalhost] = useState(false)
  
  // Мгновенно включаем лоадер с рукописной анимацией, если пользователь вернулся после авторизации в Telegram
  const [isLoading, setIsLoading] = useState(() => {
    if (typeof window !== "undefined") {
      return Boolean(new URLSearchParams(window.location.search).get("hash"))
    }
    return false
  })
  
  const [telegramUser, setTelegramUser] = useState<TelegramUser | null>(null)

  const botName = process.env.NEXT_PUBLIC_TELEGRAM_BOT_NAME || ""
  const isPremium = variant === "premium"

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsLocalhost(
        window.location.hostname === "localhost" || 
        window.location.hostname === "127.0.0.1"
      )
    }
  }, [])

  const handleTelegramAuth = async (user: TelegramUser) => {
    setError("")
    setIsLoading(true)

    try {
      const response = await loginWithTelegram(user)

      if (response.valid) {
        // Пользователь уже зарегистрирован и имеет активный доступ
        setTimeout(() => {
          setIsLoading(false)
          onAccessGranted()
        }, 1200)
      } else if (response.needsCode) {
        // Telegram подтвержден, но инвайт-код еще не привязан к аккаунту
        setTelegramUser(user)
        setView("tg_binding")
        setIsLoading(false)
      } else {
        setError(response.error || "Ошибка авторизации через Telegram")
        setIsLoading(false)
      }
    } catch {
      setError("Ошибка соединения с сервером. Попробуйте еще раз.")
      setIsLoading(false)
    }
  }

  const handleDevQuickLogin = () => {
    setIsLoading(true)
    const mockUser: TelegramUser = {
      id: 777000,
      first_name: "Ярослав",
      username: "c0lddev",
      auth_date: Math.floor(Date.now() / 1000),
      hash: "0000000000000000000000000000000000000000000000000000000000000000",
    }
    setTimeout(async () => {
      await handleTelegramAuth(mockUser)
    }, 400)
  }

  const handleBindTelegram = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!code.trim() || !telegramUser) return

    setError("")
    setIsLoading(true)

    try {
      const response = await bindTelegramToCode(code.trim(), telegramUser)

      if (response.valid) {
        setTimeout(() => {
          setIsLoading(false)
          onAccessGranted()
        }, 1200)
      } else {
        setError(response.error || "Неверный инвайт-код доступа")
        setIsLoading(false)
      }
    } catch {
      setError("Ошибка проверки кода. Попробуйте еще раз.")
      setIsLoading(false)
    }
  }

  const handleBackToInitial = () => {
    setView("initial")
    setCode("")
    setError("")
    setTelegramUser(null)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 bg-white font-ui text-[#121212] relative">
      {/* Если идет авторизация — показываем плавную анимацию, будто ручкой выводится New Way Out */}
      {isLoading && (
        <GothicHandwrittenLoader />
      )}

      <div className="w-full max-w-md border-2 border-black p-6 sm:p-10 bg-[#fafaf9] shadow-sm">
        
        {/* Masthead Header inside card */}
        <div className="text-center border-b border-gray-300 pb-6 mb-6">
          <Link href="/" className="inline-block hover:opacity-80 transition-opacity">
            <span 
              className="text-3xl sm:text-4xl text-black block tracking-tight select-none"
              style={{ fontFamily: "'UnifrakturMaguntia', serif" }}
            >
              New Way Out
            </span>
          </Link>
          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-gray-500 block mt-1">
            {isPremium ? "NWO BLACK · Закрытый доступ" : "Читательский билет · Авторизация"}
          </span>
        </div>

        {view === "initial" ? (
          <div>
            <div className="text-center mb-6">
              <h1 className="text-2xl sm:text-3xl font-display font-bold text-black mb-2">
                {isPremium ? "Вход в NWO BLACK" : "Авторизация в системе"}
              </h1>
              <p className="text-xs text-gray-600 font-ui leading-relaxed">
                {isPremium 
                  ? "Для открытия премиальных материалов и закрытой базы подтвердите ваш Telegram-аккаунт."
                  : "Войдите через Telegram для сохранения вашего прогресса уроков и синхронизации."}
              </p>
            </div>

            {/* Telegram Safety Banner */}
            <div className="border border-gray-300 bg-white p-4 mb-6 flex gap-3 items-start">
              <ShieldCheck className="w-5 h-5 text-black shrink-0 mt-0.5" />
              <div className="text-left">
                <p className="text-xs font-bold text-black uppercase tracking-wider">
                  Вход строго через Telegram
                </p>
                <p className="text-[11px] text-gray-600 mt-0.5 leading-snug">
                  Для доступа к материалам необходим подтвержденный Telegram-аккаунт. Инвайт-код привязывается к профилю.
                </p>
              </div>
            </div>

            {/* Официальный Telegram Widget блок */}
            <div className="border border-black bg-white p-6 text-center shadow-xs space-y-4">
              <p className="text-xs font-bold uppercase tracking-widest text-black">
                Официальный вход через Telegram
              </p>

              {botName ? (
                <div className="py-2 flex justify-center items-center min-h-[48px]">
                  <TelegramWidget 
                    botName={botName} 
                    onAuth={handleTelegramAuth} 
                    onInitiateLogin={() => setIsLoading(true)}
                  />
                </div>
              ) : (
                <div className="text-xs text-red-700 bg-red-50 p-3 border border-red-200 font-bold">
                  Имя Telegram-бота не задано в окружении.
                </div>
              )}

              <p className="text-[11px] text-gray-500 leading-snug">
                Нажмите на синюю кнопку Telegram выше. Откроется окно входа, где вы вводите номер телефона и подтверждаете подключение к сайту в Telegram.
              </p>
            </div>

            {error && (
              <p className="mt-4 text-xs font-bold text-red-700 text-center flex items-center justify-center gap-1.5 border border-red-200 bg-red-50 p-3">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                {error}
              </p>
            )}

            {/* Подсказка для локальной разработки / localhost */}
            {isLocalhost && (
              <div className="mt-4 p-4 border border-neutral-300 bg-neutral-100 text-left">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-black flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Режим разработки (localhost)
                  </span>
                </div>
                <p className="text-[10px] text-gray-600 mb-2 leading-snug">
                  На localhost официальный виджет Telegram блокируется серверами Telegram по домену. Нажмите кнопку для тестового входа:
                </p>
                <Button
                  type="button"
                  onClick={handleDevQuickLogin}
                  className="w-full h-9 bg-black text-white hover:bg-neutral-800 text-[11px] font-bold uppercase tracking-wider rounded-none cursor-pointer"
                >
                  Тестовый вход через Telegram (Ярослав) →
                </Button>
              </div>
            )}

            <div className="mt-8 pt-6 border-t border-gray-200 flex items-start gap-3 text-left">
              <HelpCircle className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
              <div className="text-[11px] text-gray-600 leading-normal">
                Возникли сложности с доступом? Напишите напрямую основателю в Telegram:{" "}
                <a
                  href="https://t.me/c0lddev"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-black underline underline-offset-2"
                >
                  @c0lddev
                </a>
              </div>
            </div>

            <div className="mt-6 text-center">
              <Link 
                href="/"
                className="text-xs font-semibold text-gray-500 hover:text-black flex items-center justify-center gap-1 transition-colors"
              >
                <ArrowLeft size={12} /> Вернуться на главную страницу
              </Link>
            </div>
          </div>
        ) : (
          <div>
            <div className="text-center mb-6">
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-black mb-2">
                Привязка инвайт-кода
              </h2>
              <p className="text-xs text-gray-600 leading-relaxed">
                Введите инвайт-код, чтобы навсегда закрепить доступ за вашим Telegram-аккаунтом.
              </p>
            </div>

            {/* Карточка подтвержденного Telegram профиля */}
            <div className="border border-black bg-white p-3.5 flex gap-3 items-center mb-6 text-left shadow-xs">
              {telegramUser?.photo_url ? (
                <img
                  src={telegramUser.photo_url}
                  alt={telegramUser.first_name}
                  className="w-9 h-9 rounded-none border border-gray-300 object-cover shrink-0"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-9 h-9 border border-gray-300 bg-gray-100 flex items-center justify-center shrink-0">
                  <User className="w-4 h-4 text-black" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-black leading-tight truncate">
                  @{telegramUser?.username || telegramUser?.first_name}
                </p>
                <p className="text-[10px] uppercase font-bold text-emerald-700 tracking-wider flex items-center gap-1 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                  Telegram подтвержден
                </p>
              </div>
            </div>

            <form onSubmit={handleBindTelegram} className="space-y-4">
              <div>
                <Input
                  type="text"
                  placeholder="ВВЕДИТЕ ИНВАЙТ-КОД"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="h-12 bg-white border border-black text-center text-base tracking-widest uppercase font-mono font-bold focus:ring-0 focus:border-black rounded-none text-black"
                  disabled={isLoading}
                  autoFocus
                />
                {error && (
                  <p className="text-xs font-bold text-red-700 text-center flex items-center justify-center gap-1.5 mt-2 border border-red-200 bg-red-50 p-2">
                    <ShieldAlert className="w-4 h-4 shrink-0" />
                    {error}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-black text-white hover:bg-gray-800 transition-colors font-bold text-xs uppercase tracking-widest rounded-none cursor-pointer"
                disabled={!code.trim() || isLoading}
              >
                {isLoading ? "Активация..." : "Активировать доступ"}
              </Button>

              <button
                type="button"
                onClick={handleBackToInitial}
                className="w-full py-2 text-xs font-semibold text-gray-600 hover:text-black transition-colors flex items-center justify-center gap-1 cursor-pointer"
                disabled={isLoading}
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Сменить Telegram-аккаунт
              </button>
            </form>

            <div className="mt-6 p-3 border border-gray-200 bg-white flex gap-2.5 items-start text-left">
              <Info className="w-3.5 h-3.5 text-gray-500 shrink-0 mt-0.5" />
              <p className="text-[11px] text-gray-500 leading-snug">
                Инвайт-код навсегда закрепляется за вашим Telegram-аккаунтом. В будущем для входа достаточно будет нажать «Войти через Telegram» без повторного ввода кода.
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
