"use client";

import { ArrowLeft, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserProfile } from "@/lib/sheets-api";
import { motion } from "motion/react";
import { BrandIdentity } from "@/components/brand";
import type { Variants } from "motion/react";

interface CourseHeaderProps {
  courseName: string;
  onLogout?: () => void;
  user?: UserProfile | null;
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
  onClickLogo?: () => void;
  backHref?: string;
  backLabel?: string;
  variant?: "default" | "premium";
  showUser?: boolean;
}

interface PathProps {
  d?: string;
  variants: Variants;
  transition?: { duration: number };
}

const Path = (props: PathProps) => (
  <motion.path
    fill="transparent"
    strokeWidth="2.5"
    stroke="currentColor"
    strokeLinecap="round"
    {...props}
  />
);

const MenuToggle = ({
  toggle,
  isOpen,
}: {
  toggle: () => void;
  isOpen: boolean;
}) => (
  <button
    onClick={toggle}
    className="p-2 hover:bg-secondary rounded-xl text-foreground transition-colors cursor-pointer shrink-0 flex items-center justify-center border border-transparent hover:border-border"
    aria-label={isOpen ? "Закрыть оглавление" : "Открыть оглавление"}
    aria-expanded={isOpen}
    aria-controls="course-outline"
  >
    <motion.svg
      width="22"
      height="22"
      viewBox="0 0 23 23"
      className="w-5 h-5 text-foreground"
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
);

export function CourseHeader({
  courseName,
  onLogout,
  user,
  onToggleSidebar,
  isSidebarOpen,
  onClickLogo,
  backHref,
  backLabel = "На главную",
  variant = "default",
  showUser = true,
}: CourseHeaderProps) {
  const isPremium = variant === "premium";
  const displayName = user ? user.display_name || user.email : "Студент";

  return (
    <header className="course-header h-16 bg-background border-b border-border flex items-center justify-between px-4 sm:px-6 shrink-0 z-50">
      <div className="flex items-center gap-3">
        <MenuToggle isOpen={isSidebarOpen} toggle={onToggleSidebar} />

        <button
          onClick={onClickLogo}
          className="flex items-baseline gap-2 cursor-pointer hover:opacity-80 transition-opacity"
        >
          <span className="brand-mark">
            <BrandIdentity />
          </span>
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] px-1.5 py-0.5 border border-border bg-primary text-primary-foreground">
            {isPremium ? "BLACK" : "FREE"}
          </span>
        </button>

        {backHref && (
          <a
            href={backHref}
            aria-label={backLabel}
            className="inline-flex items-center gap-1.5 border border-border bg-background p-1.5 sm:px-3 sm:py-1 text-xs font-semibold text-muted-foreground hover:bg-black hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{backLabel}</span>
          </a>
        )}
      </div>

      <div className="flex items-center gap-3">
        {showUser && (
          <div className="flex items-center gap-2 px-3 py-1.5 border border-border bg-card">
            <User className="w-4 h-4 text-foreground" />

            <span className="text-xs font-semibold text-foreground tracking-wide max-w-[130px] truncate font-ui">
              {displayName}
            </span>
          </div>
        )}

        {onLogout && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onLogout}
            className="gap-1.5 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-xl px-3 h-8 text-xs font-semibold border border-transparent hover:border-border transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Выйти</span>
          </Button>
        )}
      </div>
    </header>
  );
}
