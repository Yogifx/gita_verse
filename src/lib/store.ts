/**
 * App Store — Zustand global state management.
 *
 * Manages UI-level state such as sidebar visibility,
 * mobile menu state, and global app preferences.
 *
 * Feature-specific stores should be co-located in their feature module.
 */

import { create } from 'zustand';

interface AppState {
    /** Whether the sidebar is expanded or collapsed */
    sidebarOpen: boolean;
    /** Whether the mobile sheet menu is open */
    mobileMenuOpen: boolean;

    // ── Actions ──
    toggleSidebar: () => void;
    setSidebarOpen: (open: boolean) => void;
    toggleMobileMenu: () => void;
    setMobileMenuOpen: (open: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
    sidebarOpen: true,
    mobileMenuOpen: false,

    toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
    setSidebarOpen: (open) => set({ sidebarOpen: open }),
    toggleMobileMenu: () => set((state) => ({ mobileMenuOpen: !state.mobileMenuOpen })),
    setMobileMenuOpen: (open) => set({ mobileMenuOpen: open }),
}));
