/**
 * Global type definitions for GitaVerse Studio.
 *
 * This file contains shared types used across the application.
 * Feature-specific types should live in their respective feature module.
 */

// ── Navigation ──────────────────────────────────────────────
export interface NavItem {
  /** Display label for the nav item */
  label: string;
  /** Route path or URL */
  href: string;
  /** Lucide icon name identifier */
  icon: string;
  /** Whether the item is currently active */
  isActive?: boolean;
  /** Optional badge count (e.g., notifications) */
  badge?: number;
  /** Nested child items for expandable sections */
  children?: NavItem[];
}

// ── Sidebar ─────────────────────────────────────────────────
export interface SidebarGroup {
  /** Group heading label (e.g., "Workspace", "Assets & Themes") */
  title: string;
  /** Navigation items within this group */
  items: NavItem[];
}

// ── Theme ───────────────────────────────────────────────────
export type Theme = 'light' | 'dark' | 'system';

// ── User ────────────────────────────────────────────────────
export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role: 'admin' | 'editor' | 'viewer';
}

// ── Breadcrumb ──────────────────────────────────────────────
export interface BreadcrumbItem {
  label: string;
  href?: string;
}

// ── API Response ────────────────────────────────────────────
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}
