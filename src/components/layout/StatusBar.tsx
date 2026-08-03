"use client";

import { APP_VERSION } from "@/constants/navigation";
import { useShellStore } from "@/stores/shell-store";

export function StatusBar() {
  const theme = useShellStore((s) => s.theme);
  const projectStatus = useShellStore((s) => s.projectStatus);
  const currentProjectName = useShellStore((s) => s.currentProjectName);

  return (
    <footer className="flex h-8 shrink-0 items-center gap-4 border-t border-border bg-surface px-4 text-small text-foreground-muted">
      <span className="font-mono">v{APP_VERSION}</span>
      <span className="h-3 w-px bg-border" aria-hidden />
      <span className="capitalize">Theme: {theme}</span>
      <span className="h-3 w-px bg-border" aria-hidden />
      <span className="truncate">
        Status: {projectStatus}
        {currentProjectName ? ` · ${currentProjectName}` : ""}
      </span>
    </footer>
  );
}
