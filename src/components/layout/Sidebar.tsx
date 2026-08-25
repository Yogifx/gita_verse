"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { PanelLeftClose, PanelLeftOpen, X } from "lucide-react";
import { APP_NAME, APP_NAV } from "@/constants/navigation";
import { useShellStore } from "@/stores/shell-store";
import { cn } from "@/lib/utils/cn";

export function Sidebar() {
  const pathname = usePathname();
  const sidebarCollapsed = useShellStore((s) => s.sidebarCollapsed);
  const mobileNavOpen = useShellStore((s) => s.mobileNavOpen);
  const toggleSidebar = useShellStore((s) => s.toggleSidebar);
  const setMobileNavOpen = useShellStore((s) => s.setMobileNavOpen);

  const showLabels = !sidebarCollapsed;

  return (
    <>
      <AnimatePresence>
        {mobileNavOpen ? (
          <motion.button
            type="button"
            aria-label="Close navigation overlay"
            className="fixed inset-0 z-overlay bg-background/70 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.2, 0, 0, 1] }}
            onClick={() => setMobileNavOpen(false)}
          />
        ) : null}
      </AnimatePresence>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileNavOpen ? (
          <motion.aside
            key="mobile-sidebar"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.25, ease: [0.2, 0, 0, 1] }}
            className="fixed inset-y-0 left-0 z-sticky flex w-[16rem] flex-col border-r border-border bg-surface shadow-overlay lg:hidden"
          >
            <SidebarChrome
              pathname={pathname}
              showLabels
              onNavigate={() => setMobileNavOpen(false)}
              onCloseMobile={() => setMobileNavOpen(false)}
              showCloseMobile
            />
          </motion.aside>
        ) : null}
      </AnimatePresence>

      {/* Desktop sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: sidebarCollapsed ? "4.5rem" : "16rem" }}
        transition={{ duration: 0.25, ease: [0.2, 0, 0, 1] }}
        className="fixed inset-y-0 left-0 z-sticky hidden flex-col border-r border-border bg-surface lg:flex"
      >
        <SidebarChrome
          pathname={pathname}
          showLabels={showLabels}
          onNavigate={() => undefined}
          onToggleCollapse={toggleSidebar}
          collapsed={sidebarCollapsed}
        />
      </motion.aside>
    </>
  );
}

type SidebarChromeProps = {
  pathname: string;
  showLabels: boolean;
  onNavigate: () => void;
  onCloseMobile?: () => void;
  showCloseMobile?: boolean;
  onToggleCollapse?: () => void;
  collapsed?: boolean;
};

function SidebarChrome({
  pathname,
  showLabels,
  onNavigate,
  onCloseMobile,
  showCloseMobile,
  onToggleCollapse,
  collapsed,
}: SidebarChromeProps) {
  return (
    <>
      <div className="flex h-16 items-center justify-between gap-2 border-b border-border px-3">
        <Link
          href="/dashboard"
          className="flex min-w-0 items-center gap-3 rounded-control px-1 py-1 transition-colors duration-fast hover:bg-muted"
          onClick={onNavigate}
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-control bg-primary-muted text-gold">
            <span className="font-display text-h3 leading-none">G</span>
          </span>
          <AnimatePresence initial={false}>
            {showLabels ? (
              <motion.span
                key="logo-label"
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -6 }}
                transition={{ duration: 0.15 }}
                className="truncate font-display text-h3 text-foreground"
              >
                {APP_NAME}
              </motion.span>
            ) : null}
          </AnimatePresence>
        </Link>

        {showCloseMobile ? (
          <button
            type="button"
            className="rounded-control p-2 text-foreground-secondary transition-colors duration-fast hover:bg-muted hover:text-foreground"
            aria-label="Close sidebar"
            onClick={onCloseMobile}
          >
            <X className="h-4 w-4" />
          </button>
        ) : null}
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-2" aria-label="Primary">
        {APP_NAV.map((item) => {
          const active =
            pathname === item.href ||
            pathname.startsWith(`${item.href}/`) ||
            (item.id === "studio" && (pathname === "/studio" || pathname.startsWith("/studio/")));
          const Icon = item.icon;

          return (
            <Link
              key={item.id}
              href={item.href}
              title={item.label}
              onClick={onNavigate}
              className={cn(
                "group relative flex items-center gap-3 rounded-control px-3 py-2.5 text-caption transition-colors duration-fast",
                active
                  ? "bg-primary-muted text-gold"
                  : "text-foreground-secondary hover:bg-muted hover:text-foreground",
                !showLabels && "justify-center px-0",
              )}
            >
              {active ? (
                <motion.span
                  layoutId="nav-active-indicator"
                  className="absolute inset-y-1 left-0 w-0.5 rounded-full bg-primary"
                  transition={{ duration: 0.25, ease: [0.2, 0, 0, 1] }}
                />
              ) : null}
              <Icon
                className={cn(
                  "h-4 w-4 shrink-0 transition-transform duration-fast group-hover:scale-105",
                  active ? "text-gold" : "text-foreground-muted",
                )}
              />
              {showLabels ? <span className="truncate">{item.label}</span> : null}
            </Link>
          );
        })}
      </nav>

      {onToggleCollapse ? (
        <div className="border-t border-border p-2">
          <button
            type="button"
            onClick={onToggleCollapse}
            className={cn(
              "flex w-full items-center gap-3 rounded-control px-3 py-2.5 text-caption text-foreground-secondary transition-colors duration-fast hover:bg-muted hover:text-foreground",
              collapsed && "justify-center px-0",
            )}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? (
              <PanelLeftOpen className="h-4 w-4 shrink-0" />
            ) : (
              <PanelLeftClose className="h-4 w-4 shrink-0" />
            )}
            {showLabels ? <span>{collapsed ? "Expand" : "Collapse"}</span> : null}
          </button>
        </div>
      ) : null}
    </>
  );
}
