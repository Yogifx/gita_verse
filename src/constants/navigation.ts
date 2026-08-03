import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  FolderKanban,
  PenLine,
  Images,
  Sparkles,
  Palette,
  Settings,
} from "lucide-react";

export type AppRoute = {
  id: string;
  label: string;
  href: string;
  title: string;
  description: string;
  icon: LucideIcon;
};

export const APP_NAV: AppRoute[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    href: "/dashboard",
    title: "Dashboard",
    description: "Overview of your creative workspace.",
    icon: LayoutDashboard,
  },
  {
    id: "projects",
    label: "Knowledge Projects",
    href: "/projects",
    title: "Knowledge Projects",
    description: "Organize educational initiatives grounded in the Gita.",
    icon: FolderKanban,
  },
  {
    id: "studio",
    label: "Content Studio",
    href: "/studio",
    title: "Content Studio",
    description: "Author lessons, scripts, and structured teaching materials.",
    icon: PenLine,
  },
  {
    id: "assets",
    label: "Asset Library",
    href: "/assets",
    title: "Asset Library",
    description: "Media and reference assets for your projects.",
    icon: Images,
  },
  {
    id: "design-intelligence",
    label: "Design Intelligence",
    href: "/design-intelligence",
    title: "Design Intelligence",
    description: "Visual and pedagogical design guidance.",
    icon: Sparkles,
  },
  {
    id: "theme",
    label: "Theme Manager",
    href: "/theme",
    title: "Theme Manager",
    description: "Manage appearance and theme preferences.",
    icon: Palette,
  },
  {
    id: "settings",
    label: "Settings",
    href: "/settings",
    title: "Settings",
    description: "Application preferences and account controls.",
    icon: Settings,
  },
];

export function getRouteByPathname(pathname: string): AppRoute | undefined {
  return APP_NAV.find(
    (route) => pathname === route.href || pathname.startsWith(`${route.href}/`),
  );
}

export const APP_VERSION = "0.1.0";
export const APP_NAME = "GitaVerse";
