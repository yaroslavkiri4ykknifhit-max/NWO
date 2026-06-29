"use client"

import { LogOut, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { TelegramUser } from "@/lib/sheets-api"
import { motion } from "motion/react"
import type { Variants } from "motion/react"

interface CourseHeaderProps {
  courseName: string
  onLogout: () => void
  telegramUser?: TelegramUser | null
  onToggleSidebar: () => void
  isSidebarOpen: boolean
  onClickLogo?: () => void
}

interface PathProps {
  d?: string
  variants: Variants
  transition?: { duration: number }
}

const Path = (props: PathProps) => (
  <motion.path
    fill="transparent"
    strokeWidth="3"
    stroke="currentColor"
    strokeLinecap="round"
    {...props}
  />
)

const MenuToggle = ({ toggle, isOpen }: { toggle: () => void; isOpen: boolean }) => (
  <button
    onClick={toggle}
    className="p-2.5 hover:bg-secondary/50 rounded-xl text-muted-foreground hover:text-foreground transition-colors cursor-pointer shrink-0 flex items-center justify-center"
    aria-label={isOpen ? "Закрыть меню" : "Открыть меню"}
  >
    <motion.svg 
      width="23" 
      height="23" 
      viewBox="0 0 23 23" 
      className="w-5 h-5"
      initial={false}
      animate={isOpen ? "open" : "closed"}
    >
      <Path
        variants={{
          closed: { d: "M 2 2.5 L 20 2.5" },
          open: { d: "M 3 16.5 L 17 2.5" },
        }}
      />
      <Path
        d="M 2 9.423 L 20 9.423"
        variants={{
          closed: { opacity: 1 },
          open: { opacity: 0 },
        }}
        transition={{ duration: 0.1 }}
      />
      <Path
        variants={{
          closed: { d: "M 2 16.346 L 20 16.346" },
          open: { d: "M 3 2.5 L 17 16.346" },
        }}
      />
    </motion.svg>
  </button>
)

export function CourseHeader({
  courseName,
  onLogout,
  telegramUser,
  onToggleSidebar,
  isSidebarOpen,
  onClickLogo,
}: CourseHeaderProps) {
  const displayName = telegramUser
    ? (telegramUser.username ? `@${telegramUser.username}` : telegramUser.first_name)
    : "Студент"

  return (
    <header className="h-16 bg-card/60 backdrop-blur-md border-b border-border/50 flex items-center justify-between px-4 sm:px-6 shrink-0 transition-all duration-300 z-50">
      <div className="flex items-center gap-2 sm:gap-3">
        <MenuToggle isOpen={isSidebarOpen} toggle={onToggleSidebar} />

        <button
          onClick={onClickLogo}
          className="text-3xl font-bold text-foreground font-caveat select-none tracking-wider italic shrink-0 pr-1 cursor-pointer hover:opacity-80 transition-opacity focus:outline-none"
        >
          NWO
        </button>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-secondary/35 border border-border/30">
          {telegramUser?.photo_url ? (
            <img
              src={telegramUser.photo_url}
              alt={displayName}
              className="w-6 h-6 rounded-full object-cover border border-accent/40"
              referrerPolicy="no-referrer"
              onError={(e) => {
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
