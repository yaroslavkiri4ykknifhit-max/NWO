"use client"

import { useState, useEffect, useRef } from "react"
import { ArrowLeft, ShieldCheck, HelpCircle, Info, Mail, Fingerprint, KeyRound } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  requestEmailOTP,
  verifyEmailOTP,
  bindEmailToCode,
  loginWithPasskey,
  registerPasskey,
  isPasskeySupported,
  isPlatformAuthenticatorAvailable,
} from "@/lib/sheets-api"
import { GothicHandwrittenLoader } from "@/components/gothic-handwritten-loader"
import Link from "next/link"

interface AccessFormProps {
  onAccessGranted: () => void
  variant?: "default" | "premium"
}

type FormView = "initial" | "email_input" | "otp_verify" | "invite_bind" | "passkey_offer"

export function AccessForm({ onAccessGranted, variant = "default" }: AccessFormProps) {
  const [view, setView] = useState<FormView>("initial")
  const [email, setEmail] = useState("")
  const [otpCode, setOtpCode] = useState("")
  const [inviteCode, setInviteCode] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [otpSent, setOtpSent] = useState(false)
  const [otpCountdown, setOtpCountdown] = useState(0)
  const [passkeyAvailable, setPasskeyAvailable] = useState(false)
  const [isLocalhost, setIsLocalhost] = useState(false)

  const isPremium = variant === "premium"
  const otpInputRef = useRef<HTMLInputElement>(null)

  // Проверяем доступность passkey
  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsLocalhost(
        window.location.hostname === "localhost" ||
        window.location.hostname === "127.0.0.1"
      )
    }

    if (isPasskeySupported()) {
      isPlatformAuthenticatorAvailable().then(setPasskeyAvailable)
    }
  }, [])

  // Таймер обратного отсчёта для повторной отправки OTP
  useEffect(() => {
    if (otpCountdown <= 0) return
    const timer = setTimeout(() => setOtpCountdown((c) => c - 1), 1000)
    return () => clearTimeout(timer)
  }, [otpCountdown])

  // ── Passkey login ─────────────────────────────────────────────────

  const handlePasskeyLogin = async () => {
    setError("")
    setIsLoading(true)

    try {
      const result = await loginWithPasskey()
      if (result.valid) {
        setTimeout(() => {
          setIsLoading(false)
          onAccessGranted()
        }, 1200)
      } else {
        setError(result.error || "Passkey не найден")
        setIsLoading(false)
      }
    } catch {
      setError("Ошибка входа через Passkey")
      setIsLoading(false)
    }
  }

  // ── Email OTP ─────────────────────────────────────────────────────

  const handleSendOTP = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!email.trim()) return

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email.trim())) {
      setError("Введите корректный email адрес")
      return
    }

    setError("")
    setIsLoading(true)

    try {
      const result = await requestEmailOTP(email.trim())
      if (result.sent) {
        setOtpSent(true)
        setOtpCountdown(60)
        setView("otp_verify")
        setIsLoading(false)
        // Автофокус на поле ввода OTP
        setTimeout(() => otpInputRef.current?.focus(), 100)
      } else {
        setError(result.error || "Не удалось отправить код")
        setIsLoading(false)
      }
    } catch {
      setError("Ошибка отправки кода")
      setIsLoading(false)
    }
  }

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!otpCode.trim() || otpCode.trim().length !== 6) return

    setError("")
    setIsLoading(true)

    try {
      const result = await verifyEmailOTP(email.trim(), otpCode.trim())

      if (result.valid) {
        // Вход успешен — предлагаем сохранить passkey
        if (passkeyAvailable) {
          setIsLoading(false)
          setView("passkey_offer")
        } else {
          setTimeout(() => {
            setIsLoading(false)
            onAccessGranted()
          }, 1200)
        }
      } else if (result.needsCode) {
        // Email подтверждён, но нужен инвайт-код
        setView("invite_bind")
        setIsLoading(false)
      } else {
        setError(result.error || "Неверный код")
        setIsLoading(false)
      }
    } catch {
      setError("Ошибка проверки кода")
      setIsLoading(false)
    }
  }

  // ── Invite code bind ──────────────────────────────────────────────

  const handleBindInvite = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inviteCode.trim()) return

    setError("")
    setIsLoading(true)

    try {
      const result = await bindEmailToCode(email.trim(), inviteCode.trim())

      if (result.valid) {
        // Привязка успешна — предлагаем passkey
        if (passkeyAvailable) {
          setIsLoading(false)
          setView("passkey_offer")
        } else {
          setTimeout(() => {
            setIsLoading(false)
            onAccessGranted()
          }, 1200)
        }
      } else {
        setError(result.error || "Неверный инвайт-код")
        setIsLoading(false)
      }
    } catch {
      setError("Ошибка активации кода")
      setIsLoading(false)
    }
  }

  // ── Passkey registration offer ────────────────────────────────────

  const handleRegisterPasskey = async () => {
    setIsLoading(true)
    try {
      const success = await registerPasskey(email.trim(), email.split("@")[0])
      // Независимо от результата — пускаем дальше
      if (!success) {
        console.warn("Passkey registration skipped or failed")
      }
    } catch {
      console.warn("Passkey registration error")
    }
    setIsLoading(false)
    onAccessGranted()
  }

  const handleSkipPasskey = () => {
    onAccessGranted()
  }

  // ── Navigation ────────────────────────────────────────────────────

  const handleBackToInitial = () => {
    setView("initial")
    setEmail("")
    setOtpCode("")
    setInviteCode("")
    setError("")
    setOtpSent(false)
  }

  const handleBackToEmail = () => {
    setView("email_input")
    setOtpCode("")
    setError("")
  }

  // ── Render ────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 bg-white font-ui text-[#121212] relative">
      {/* Лоадер с рукописной анимацией */}
      {isLoading && view !== "passkey_offer" && (
        <GothicHandwrittenLoader />
      )}

      <div className="w-full max-w-md border-2 border-black p-6 sm:p-10 bg-[#fafaf9] shadow-sm">

        {/* Masthead */}
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

        {/* ═══════════════════════════════════════════════════════════
            VIEW: initial — Passkey + Email кнопки
        ═══════════════════════════════════════════════════════════ */}
        {view === "initial" && (
          <div>
            <div className="text-center mb-6">
              <h1 className="text-2xl sm:text-3xl font-display font-bold text-black mb-2">
                {isPremium ? "Вход в NWO BLACK" : "Авторизация в системе"}
              </h1>
              <p className="text-xs text-gray-600 font-ui leading-relaxed">
                {isPremium
                  ? "Для открытия премиальных материалов и закрытой базы подтвердите вашу личность."
                  : "Войдите для сохранения вашего прогресса уроков и синхронизации."}
              </p>
            </div>

            {/* Security banner */}
            <div className="border border-gray-300 bg-white p-4 mb-6 flex gap-3 items-start">
              <ShieldCheck className="w-5 h-5 text-black shrink-0 mt-0.5" />
              <div className="text-left">
                <p className="text-xs font-bold text-black uppercase tracking-wider">
                  Безопасный вход без пароля
                </p>
                <p className="text-[11px] text-gray-600 mt-0.5 leading-snug">
                  Используйте Passkey (Face ID, Touch ID) для мгновенного входа или получите код на вашу почту.
                </p>
              </div>
            </div>

            {/* Action buttons */}
            <div className="space-y-3">
              {/* Passkey button — только если браузер поддерживает */}
              {passkeyAvailable && (
                <button
                  type="button"
                  onClick={handlePasskeyLogin}
                  disabled={isLoading}
                  className="w-full h-[52px] bg-black text-white hover:bg-gray-800 active:bg-gray-900 font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2.5 transition-all cursor-pointer select-none border-none"
                >
                  <Fingerprint className="w-5 h-5 shrink-0" />
                  <span>Войти через Passkey</span>
                </button>
              )}

              {/* Email button */}
              <button
                type="button"
                onClick={() => setView("email_input")}
                disabled={isLoading}
                className={`w-full h-[52px] font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2.5 transition-all cursor-pointer select-none border ${
                  passkeyAvailable
                    ? "border-black bg-white text-black hover:bg-gray-50"
                    : "border-none bg-black text-white hover:bg-gray-800"
                }`}
              >
                <Mail className="w-5 h-5 shrink-0" />
                <span>Войти по email</span>
              </button>
            </div>

            {error && (
              <p className="mt-4 text-xs font-bold text-red-700 text-center flex items-center justify-center gap-1.5 border border-red-200 bg-red-50 p-3">
                <KeyRound className="w-4 h-4 shrink-0" />
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
        )}

        {/* ═══════════════════════════════════════════════════════════
            VIEW: email_input — Ввод email
        ═══════════════════════════════════════════════════════════ */}
        {view === "email_input" && (
          <div>
            <div className="text-center mb-6">
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-black mb-2">
                Вход по email
              </h2>
              <p className="text-xs text-gray-600 leading-relaxed">
                Введите ваш email — мы отправим 6-значный код для входа.
              </p>
            </div>

            <form onSubmit={handleSendOTP} className="space-y-4">
              <Input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 bg-white border border-black text-center text-base font-medium focus:ring-0 focus:border-black rounded-none text-black lowercase"
                disabled={isLoading}
                autoFocus
                autoComplete="email"
              />

              {error && (
                <p className="text-xs font-bold text-red-700 text-center flex items-center justify-center gap-1.5 border border-red-200 bg-red-50 p-2">
                  <Mail className="w-4 h-4 shrink-0" />
                  {error}
                </p>
              )}

              <Button
                type="submit"
                className="w-full h-12 bg-black text-white hover:bg-gray-800 transition-colors font-bold text-xs uppercase tracking-widest rounded-none cursor-pointer"
                disabled={!email.trim() || isLoading}
              >
                {isLoading ? "Отправляем..." : "Получить код"}
              </Button>

              <button
                type="button"
                onClick={handleBackToInitial}
                className="w-full py-2 text-xs font-semibold text-gray-600 hover:text-black transition-colors flex items-center justify-center gap-1 cursor-pointer"
                disabled={isLoading}
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Назад
              </button>
            </form>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════
            VIEW: otp_verify — Ввод OTP кода
        ═══════════════════════════════════════════════════════════ */}
        {view === "otp_verify" && (
          <div>
            <div className="text-center mb-6">
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-black mb-2">
                Введите код
              </h2>
              <p className="text-xs text-gray-600 leading-relaxed">
                Мы отправили 6-значный код на{" "}
                <strong className="text-black">{email}</strong>
              </p>
            </div>

            {/* Email badge */}
            <div className="border border-black bg-white p-3.5 flex gap-3 items-center mb-6 text-left shadow-xs">
              <div className="w-9 h-9 border border-gray-300 bg-gray-100 flex items-center justify-center shrink-0">
                <Mail className="w-4 h-4 text-black" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-black leading-tight truncate">
                  {email}
                </p>
                <p className="text-[10px] uppercase font-bold text-emerald-700 tracking-wider flex items-center gap-1 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                  Код отправлен
                </p>
              </div>
            </div>

            <form onSubmit={handleVerifyOTP} className="space-y-4">
              <Input
                ref={otpInputRef}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={6}
                placeholder="000000"
                value={otpCode}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, "").slice(0, 6)
                  setOtpCode(val)
                }}
                className="h-14 bg-white border border-black text-center text-2xl tracking-[0.5em] uppercase font-mono font-bold focus:ring-0 focus:border-black rounded-none text-black"
                disabled={isLoading}
                autoFocus
                autoComplete="one-time-code"
              />

              {error && (
                <p className="text-xs font-bold text-red-700 text-center flex items-center justify-center gap-1.5 border border-red-200 bg-red-50 p-2">
                  <KeyRound className="w-4 h-4 shrink-0" />
                  {error}
                </p>
              )}

              <Button
                type="submit"
                className="w-full h-12 bg-black text-white hover:bg-gray-800 transition-colors font-bold text-xs uppercase tracking-widest rounded-none cursor-pointer"
                disabled={otpCode.length !== 6 || isLoading}
              >
                {isLoading ? "Проверяем..." : "Подтвердить"}
              </Button>

              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={handleBackToEmail}
                  className="text-xs font-semibold text-gray-600 hover:text-black transition-colors flex items-center gap-1 cursor-pointer"
                  disabled={isLoading}
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Другой email
                </button>

                <button
                  type="button"
                  onClick={() => handleSendOTP()}
                  className="text-xs font-semibold text-gray-600 hover:text-black transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                  disabled={isLoading || otpCountdown > 0}
                >
                  {otpCountdown > 0 ? `Повторно через ${otpCountdown}с` : "Отправить ещё раз"}
                </button>
              </div>
            </form>

            <div className="mt-6 p-3 border border-gray-200 bg-white flex gap-2.5 items-start text-left">
              <Info className="w-3.5 h-3.5 text-gray-500 shrink-0 mt-0.5" />
              <p className="text-[11px] text-gray-500 leading-snug">
                Не получили код? Проверьте папку «Спам». Код действителен 5 минут.
              </p>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════
            VIEW: invite_bind — Привязка инвайт-кода
        ═══════════════════════════════════════════════════════════ */}
        {view === "invite_bind" && (
          <div>
            <div className="text-center mb-6">
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-black mb-2">
                Привязка инвайт-кода
              </h2>
              <p className="text-xs text-gray-600 leading-relaxed">
                Введите инвайт-код, чтобы навсегда закрепить доступ за вашим email.
              </p>
            </div>

            {/* Email badge */}
            <div className="border border-black bg-white p-3.5 flex gap-3 items-center mb-6 text-left shadow-xs">
              <div className="w-9 h-9 border border-gray-300 bg-gray-100 flex items-center justify-center shrink-0">
                <Mail className="w-4 h-4 text-black" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-black leading-tight truncate">
                  {email}
                </p>
                <p className="text-[10px] uppercase font-bold text-emerald-700 tracking-wider flex items-center gap-1 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                  Email подтверждён
                </p>
              </div>
            </div>

            <form onSubmit={handleBindInvite} className="space-y-4">
              <div>
                <Input
                  type="text"
                  placeholder="ВВЕДИТЕ ИНВАЙТ-КОД"
                  value={inviteCode}
                  onChange={(e) => setInviteCode(e.target.value)}
                  className="h-12 bg-white border border-black text-center text-base tracking-widest uppercase font-mono font-bold focus:ring-0 focus:border-black rounded-none text-black"
                  disabled={isLoading}
                  autoFocus
                />
                {error && (
                  <p className="text-xs font-bold text-red-700 text-center flex items-center justify-center gap-1.5 mt-2 border border-red-200 bg-red-50 p-2">
                    <KeyRound className="w-4 h-4 shrink-0" />
                    {error}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-black text-white hover:bg-gray-800 transition-colors font-bold text-xs uppercase tracking-widest rounded-none cursor-pointer"
                disabled={!inviteCode.trim() || isLoading}
              >
                {isLoading ? "Активация..." : "Активировать доступ"}
              </Button>

              <button
                type="button"
                onClick={handleBackToInitial}
                className="w-full py-2 text-xs font-semibold text-gray-600 hover:text-black transition-colors flex items-center justify-center gap-1 cursor-pointer"
                disabled={isLoading}
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Войти с другого email
              </button>
            </form>

            <div className="mt-6 p-3 border border-gray-200 bg-white flex gap-2.5 items-start text-left">
              <Info className="w-3.5 h-3.5 text-gray-500 shrink-0 mt-0.5" />
              <p className="text-[11px] text-gray-500 leading-snug">
                Инвайт-код навсегда закрепляется за вашим email. В будущем для входа достаточно будет Passkey или код на почту.
              </p>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════
            VIEW: passkey_offer — Предложение сохранить Passkey
        ═══════════════════════════════════════════════════════════ */}
        {view === "passkey_offer" && (
          <div>
            <div className="text-center mb-6">
              <div className="mx-auto mb-4 w-14 h-14 border border-black bg-black text-white flex items-center justify-center">
                <Fingerprint className="w-7 h-7" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-black mb-2">
                Мгновенный вход
              </h2>
              <p className="text-xs text-gray-600 leading-relaxed">
                Сохраните Passkey, чтобы в следующий раз входить в один тап через Face ID, Touch ID или Windows Hello — без кода и без пароля.
              </p>
            </div>

            <div className="space-y-3">
              <button
                type="button"
                onClick={handleRegisterPasskey}
                disabled={isLoading}
                className="w-full h-[52px] bg-black text-white hover:bg-gray-800 active:bg-gray-900 font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2.5 transition-all cursor-pointer select-none border-none"
              >
                <Fingerprint className="w-5 h-5 shrink-0" />
                {isLoading ? "Сохраняем..." : "Сохранить Passkey"}
              </button>

              <button
                type="button"
                onClick={handleSkipPasskey}
                className="w-full py-3 text-xs font-semibold text-gray-500 hover:text-black transition-colors flex items-center justify-center gap-1 cursor-pointer"
              >
                Пропустить
              </button>
            </div>

            <div className="mt-6 p-3 border border-gray-200 bg-white flex gap-2.5 items-start text-left">
              <Info className="w-3.5 h-3.5 text-gray-500 shrink-0 mt-0.5" />
              <p className="text-[11px] text-gray-500 leading-snug">
                Passkey хранится на вашем устройстве и защищён биометрией. Вы всегда сможете войти по email, если смените устройство.
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
