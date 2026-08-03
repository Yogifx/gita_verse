"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { PropertiesPanel } from "@/components/layout/PropertiesPanel";
import { Sidebar } from "@/components/layout/Sidebar";
import { StatusBar } from "@/components/layout/StatusBar";
import { Workspace } from "@/components/layout/Workspace";
import { useShellStore } from "@/stores/shell-store";
import { cn } from "@/lib/utils/cn";

type AppLayoutProps = {
  children: ReactNode;
};

export function AppLayout({ children }: AppLayoutProps) {
  const sidebarCollapsed = useShellStore((s) => s.sidebarCollapsed);
  const theme = useShellStore((s) => s.theme);
  const setTheme = useShellStore((s) => s.setTheme);

  useEffect(() => {
    setTheme(theme);
  }, [setTheme, theme]);

  return (
    <div className="flex min-h-dvh bg-background text-foreground">
      <Sidebar />

      <div
        className={cn(
          "flex min-h-dvh min-w-0 flex-1 flex-col transition-[padding] duration-normal ease-standard",
          sidebarCollapsed ? "lg:pl-[4.5rem]" : "lg:pl-[16rem]",
        )}
      >
        <Header />
        <div className="flex min-h-0 flex-1 overflow-hidden">
          <Workspace>{children}</Workspace>
          <PropertiesPanel />
        </div>
        <StatusBar />
      </div>
    </div>
  );
}
