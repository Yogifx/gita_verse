"use client";

import { create } from "zustand";
import type { ThemeName } from "@/config/design-tokens";

type ShellState = {
  sidebarCollapsed: boolean;
  mobileNavOpen: boolean;
  propertiesOpen: boolean;
  theme: ThemeName;
  currentProjectName: string | null;
  projectStatus: string;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setMobileNavOpen: (open: boolean) => void;
  toggleProperties: () => void;
  setTheme: (theme: ThemeName) => void;
  toggleTheme: () => void;
};

function applyThemeToDocument(theme: ThemeName) {
  if (typeof document === "undefined") return;
  document.documentElement.setAttribute("data-theme", theme);
  document.documentElement.style.colorScheme = theme;
}

export const useShellStore = create<ShellState>((set, get) => ({
  sidebarCollapsed: false,
  mobileNavOpen: false,
  propertiesOpen: false,
  theme: "dark",
  currentProjectName: null,
  projectStatus: "Idle",

  toggleSidebar: () =>
    set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),

  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),

  setMobileNavOpen: (open) => set({ mobileNavOpen: open }),

  toggleProperties: () =>
    set((state) => ({ propertiesOpen: !state.propertiesOpen })),

  setTheme: (theme) => {
    applyThemeToDocument(theme);
    set({ theme });
  },

  toggleTheme: () => {
    const next = get().theme === "dark" ? "light" : "dark";
    applyThemeToDocument(next);
    set({ theme: next });
  },
}));
