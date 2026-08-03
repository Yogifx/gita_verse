"use client";

import { Menu, Moon, Search, Sun } from "lucide-react";
import { APP_NAME } from "@/constants/navigation";
import { useShellStore } from "@/stores/shell-store";
import { cn } from "@/lib/utils/cn";

export function Header() {
  const setMobileNavOpen = useShellStore((s) => s.setMobileNavOpen);
  const currentProjectName = useShellStore((s) => s.currentProjectName);
  const theme = useShellStore((s) => s.theme);
  const toggleTheme = useShellStore((s) => s.toggleTheme);

  return (
    <header className="flex h-16 shrink-0 items-center gap-3 border-b border-border bg-surface px-4 md:px-6">
      <button
        type="button"
        className="rounded-control p-2 text-foreground-secondary transition-colors duration-fast hover:bg-muted hover:text-foreground lg:hidden"
        aria-label="Open navigation"
        onClick={() => setMobileNavOpen(true)}
      >
        <Menu className="h-5 w-5" />
      </button>

      <div className="min-w-0 flex-1">
        <p className="truncate font-display text-h3 text-foreground">{APP_NAME}</p>
        <p className="truncate text-small text-foreground-muted">
          {currentProjectName ?? "No project selected"}
        </p>
      </div>

      <div className="hidden min-w-[12rem] max-w-sm flex-1 md:block lg:max-w-md">
        <label className="relative block">
          <span className="sr-only">Search</span>
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground-muted" />
          <input
            type="search"
            placeholder="Search workspace…"
            disabled
            className={cn(
              "w-full rounded-control border border-border bg-background py-2 pl-9 pr-3",
              "text-caption text-foreground-muted placeholder:text-foreground-muted",
              "cursor-not-allowed opacity-80",
            )}
          />
        </label>
      </div>

      <button
        type="button"
        onClick={toggleTheme}
        className="rounded-control border border-border p-2 text-foreground-secondary transition-colors duration-fast hover:bg-muted hover:text-foreground"
        aria-label="Toggle theme placeholder"
        title="Theme switch (placeholder)"
      >
        {theme === "dark" ? (
          <Sun className="h-4 w-4 text-gold" />
        ) : (
          <Moon className="h-4 w-4 text-indigo" />
        )}
      </button>

      <div
        className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-muted text-caption font-medium text-foreground-secondary"
        aria-label="User avatar placeholder"
        title="User"
      >
        GV
      </div>
    </header>
  );
}
