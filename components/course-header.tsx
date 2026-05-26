"use client"

import { LogOut, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { TelegramUser } from "@/lib/sheets-api"

interface CourseHeaderProps {
  courseName: string
  onLogout: () => void
  telegramUser?: TelegramUser | null
}

export function CourseHeader({ courseName, onLogout, telegramUser }: CourseHeaderProps) {
  const displayName = telegramUser
    ? (telegramUser.username ? `@${telegramUser.username}` : telegramUser.first_name)
    : "Студент"

  return (
    <header className="h-16 bg-card/60 backdrop-blur-md border-b border-border/50 flex items-center justify-between px-6 shrink-0 transition-all duration-300">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-accent/10 border border-accent/25 flex items-center justify-center shadow-lg shadow-accent/5">
          <span className="text-accent font-bold text-base">N</span>
        </div>
        <span className="font-semibold text-foreground tracking-tight">{courseName}</span>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-secondary/35 border border-border/30">
          {telegramUser?.photo_url ? (
            <img
              src={telegramUser.photo_url}
              alt={displayName}
              className="w-6 h-6 rounded-full object-cover border border-accent/40"
              referrerPolicy="no-referrer" // Telegram аватарки требуют referrerPolicy, чтобы обходить блокировки хотлинкинга
              onError={(e) => {
                // Если не удалось загрузить, заменяем на заглушку
                e.currentTarget.style.display = 'none'
                const sibling = e.currentTarget.nextElementSibling as HTMLElement
                if (sibling) sibling.style.display = 'block'
              }}
            />
          ) : null}
          
          <User 
            className="w-4 h-4 text-accent" 
            style={{ display: telegramUser?.photo_url ? 'none' : 'block' }} 
          />
          
          <span className="text-sm font-medium text-foreground tracking-wide max-w-[120px] truncate">
            {displayName}
          </span>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={onLogout}
          className="gap-2 text-muted-foreground hover:text-destructive hover:bg-destructive/5 rounded-xl px-3 h-9 transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline text-xs font-medium">Выйти</span>
        </Button>
      </div>
    </header>
  )
}
