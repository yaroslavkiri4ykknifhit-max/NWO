"use client"

import { useState, useEffect, useRef } from "react"
import { ArrowLeft, ShieldAlert, ShieldCheck, HelpCircle, Info, User, Phone, CheckCircle2, X } from "lucide-react"
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

// Фирменная векторная иконка Telegram для кнопки авторизации
function TelegramAirplaneIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.19-.04-.27-.02-.12.02-1.96 1.24-5.54 3.65-.52.36-.97.53-1.34.52-.42-.01-1.22-.24-1.82-.44-.73-.24-1.32-.37-1.27-.78.02-.21.32-.43.89-.65 3.48-1.52 5.81-2.52 6.98-3.01 3.33-1.39 4.02-1.63 4.47-1.64.1 0 .32.02.46.14.12.1.15.29.17.41-.02.1.03-.02 0 .02z" />
    </svg>
  )
}

interface TelegramLoginProps {
  botName: string
  onAuth: (user: TelegramUser) => void
  onInitiateLogin: () => void
  isLocalhost: boolean
  onOpenDevModal: () => void
}

function TelegramWidget({
  botName,
  onAuth,
  onInitiateLogin,
  isLocalhost,
  onOpenDevModal,
}: TelegramLoginProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [iframeLoaded, setIframeLoaded] = useState(false)

  // Храним функции в ref, чтобы не пересоздавать и не очищать контейнер при ререндерах
  const onAuthRef = useRef(onAuth)
  onAuthRef.current = onAuth
  const onInitiateLoginRef = useRef(onInitiateLogin)
  onInitiateLoginRef.current = onInitiateLogin

  useEffect(() => {
    // 1. Проверка параметров Telegram при редиректе (если возвращаются GET-параметры)
    if (typeof window !== "undefined") {
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
        onInitiateLoginRef.current()

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

        const telegramFields = [
          "id",
          "first_name",
          "last_name",
          "username",
          "photo_url",
          "auth_date",
          "hash",
        ]
        telegramFields.forEach((field) => url.searchParams.delete(field))
        window.history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`)
        onAuthRef.current(user)
        return
      }
    }

    // 2. Слушатель window.onmessage для всплывающего окна oauth.telegram.org
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== "https://oauth.telegram.org") return
      try {
        let payload: any = event.data
        if (typeof payload === "string") {
          try {
            payload = JSON.parse(payload)
          } catch {
            return
          }
        }
        if (payload && (payload.event === "auth_result" || payload.result)) {
          const user = (payload.result || payload) as TelegramUser
          if (user && (user.id || user.username)) {
            onInitiateLoginRef.current()
            onAuthRef.current(user)
          }
        }
      } catch (err) {
        console.error("Telegram postMessage parse error:", err)
      }
    }

    window.addEventListener("message", handleMessage)

    // 3. Callback при подтверждении в официальном виджете Telegram
    window.onTelegramAuth = (user: TelegramUser) => {
      onInitiateLoginRef.current()
      onAuthRef.current(user)
    }

    // 4. Подключение официального фрейма Telegram Widget (только один раз, без мерцания)
    if (containerRef.current && botName && !isLocalhost) {
      if (!containerRef.current.querySelector("iframe")) {
        const origin = window.location.origin
        const returnTo = `${origin}${window.location.pathname}`

        const iframe = document.createElement("iframe")
        iframe.id = `telegram-login-${botName}`
        iframe.src = `https://oauth.telegram.org/embed/${botName}?origin=${encodeURIComponent(
          origin
        )}&return_to=${encodeURIComponent(
          returnTo
        )}&size=large&userpic=true&request_access=write&lang=ru`
        iframe.width = "238"
        iframe.height = "40"
        iframe.frameBorder = "0"
        iframe.scrolling = "no"
        iframe.style.border = "none"
        iframe.style.overflow = "hidden"
        iframe.style.colorScheme = "light"

        iframe.onload = () => {
          setIframeLoaded(true)
        }

        containerRef.current.innerHTML = ""
        containerRef.current.appendChild(iframe)
      }
    }

    return () => {
      window.removeEventListener("message", handleMessage)
      delete window.onTelegramAuth
    }
  }, [botName, isLocalhost])

  const handleBlueButtonClick = () => {
    if (isLocalhost) {
      onOpenDevModal()
      return
    }

    // В продакшене: если виджет загружен, фокусим его
    const iframe = containerRef.current?.querySelector("iframe")
    if (iframe) {
      iframe.focus()
    }
  }

  return (
    <div className="relative inline-flex items-center justify-center min-h-[44px]">
      {/* 1. Настоящая официальная синяя кнопка Telegram — ВСЕГДА на месте и никогда не пропадает */}
      <button
        type="button"
        onClick={handleBlueButtonClick}
        className="h-[42px] px-6 bg-[#54a9eb] hover:bg-[#4ba3e3] active:bg-[#3e96d6] text-white font-medium text-[14px] flex items-center justify-center gap-2.5 rounded-[8px] shadow-sm hover:shadow transition-all cursor-pointer select-none border-none tracking-normal"
      >
        <TelegramAirplaneIcon className="w-[20px] h-[20px] fill-current text-white shrink-0" />
        <span className="font-sans font-semibold">Войти через Telegram</span>
      </button>

      {/* 2. Официальный iframe Telegram Widget — когда готов, плавно накладывается на синюю кнопку */}
      {!isLocalhost && botName && (
        <div
          ref={containerRef}
          className={`absolute inset-0 flex justify-center items-center transition-opacity duration-200 ${
            iframeLoaded ? "opacity-100 z-10" : "opacity-0 pointer-events-none"
          }`}
        />
      )}
    </div>
  )
}

export function AccessForm({ onAccessGranted, variant = "default" }: AccessFormProps) {
  const [view, setView] = useState<"initial" | "tg_binding">("initial")
  const [code, setCode] = useState("")
  const [error, setError] = useState("")
  const [isLocalhost, setIsLocalhost] = useState(false)
  const [showDevModal, setShowDevModal] = useState(false)
  const [devUsername, setDevUsername] = useState("c0lddev")
  const [devPhone, setDevPhone] = useState("+7 (999) 000-00-00")
  
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

  const handleConfirmDevLogin = () => {
    setShowDevModal(false)
    setIsLoading(true)

    const cleanUsername = devUsername.replace(/^@/, "").trim() || "c0lddev"
    const mockUser: TelegramUser = {
      id: 777000,
      first_name: "Ярослав",
      username: cleanUsername,
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

      {/* Модальное окно Telegram для локального тестирования (localhost) */}
      {showDevModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white border-2 border-black w-full max-w-sm p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-gray-200 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#54a9eb] flex items-center justify-center text-white shrink-0 shadow-xs">
                  <TelegramAirplaneIcon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-black">Вход через Telegram</h3>
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider">Подтверждение аккаунта</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowDevModal(false)}
                className="text-gray-400 hover:text-black p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 bg-neutral-100 border border-neutral-200 text-[11px] text-neutral-800 leading-snug">
              <span className="font-bold text-black block mb-1">Режим разработки (localhost):</span>
              Telegram запрашивает номер телефона и отправляет подтверждение в приложение Telegram.
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 mb-1">
                  Номер телефона:
                </label>
                <Input
                  type="text"
                  value={devPhone}
                  onChange={(e) => setDevPhone(e.target.value)}
                  className="h-10 text-xs font-mono rounded-none border border-black focus:ring-0 focus:border-black"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 mb-1">
                  Telegram Username:
                </label>
                <Input
                  type="text"
                  value={devUsername}
                  onChange={(e) => setDevUsername(e.target.value)}
                  placeholder="@c0lddev"
                  className="h-10 text-xs font-mono rounded-none border border-black focus:ring-0 focus:border-black"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2 pt-1">
              <Button
                type="button"
                onClick={handleConfirmDevLogin}
                className="h-11 bg-[#54a9eb] hover:bg-[#4ba3e3] text-white font-bold text-xs uppercase tracking-widest rounded-none cursor-pointer flex items-center justify-center gap-2"
              >
                <TelegramAirplaneIcon className="w-4 h-4" />
                <span>Подтвердить вход</span>
              </Button>
              <button
                type="button"
                onClick={() => setShowDevModal(false)}
                className="text-xs text-gray-500 hover:text-black py-1 cursor-pointer"
              >
                Отмена
              </button>
            </div>
          </div>
        </div>
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

              {/* Синяя кнопка Telegram — ВСЕГДА на месте и сразу отображается */}
              <div className="py-2 flex justify-center items-center min-h-[48px]">
                <TelegramWidget 
                  botName={botName} 
                  onAuth={handleTelegramAuth} 
                  onInitiateLogin={() => setIsLoading(true)}
                  isLocalhost={isLocalhost}
                  onOpenDevModal={() => setShowDevModal(true)}
                />
              </div>

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
