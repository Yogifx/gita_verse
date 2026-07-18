/**
 * Sidebar — Collapsible left navigation panel.
 *
 * Features:
 * - Grouped nav items with Lucide icons
 * - Collapse/expand toggle with Framer Motion animation
 * - Tooltips for collapsed state (base-ui tooltip wraps the link)
 * - Brand logo at the top
 *
 * Note: shadcn v4 uses @base-ui/react — no asChild on Trigger components.
 * The Tooltip wraps the entire <Link> for collapsed icon tooltips.
 */

'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard,
    FolderKanban,
    CalendarDays,
    BookOpen,
    PenTool,
    Image,
    Palette,
    Type,
    Paintbrush,
    Settings,
    PanelLeftClose,
    PanelLeft,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { useAppStore } from '@/lib/store';
import { sidebarNavigation } from '@/lib/navigation';
import { Separator } from '@/components/ui/separator';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';

/** Map icon string names to actual Lucide components */
const iconMap: Record<string, LucideIcon> = {
    LayoutDashboard,
    FolderKanban,
    CalendarDays,
    BookOpen,
    PenTool,
    Image,
    Palette,
    Type,
    Paintbrush,
    Settings,
};

export function Sidebar() {
    const pathname = usePathname();
    const { sidebarOpen, toggleSidebar } = useAppStore();

    return (
        <motion.aside
            initial={false}
            animate={{ width: sidebarOpen ? 260 : 68 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className={cn(
                'hidden lg:flex flex-col h-full border-r bg-sidebar text-sidebar-foreground',
                'overflow-hidden flex-shrink-0',
            )}
        >
            {/* Brand */}
            <div className="flex items-center gap-3 px-4 h-16 flex-shrink-0">
                <div className="flex items-center justify-center w-8 h-8 rounded-md bg-primary text-primary-foreground font-bold text-sm flex-shrink-0">
                    G
                </div>
                <AnimatePresence>
                    {sidebarOpen && (
                        <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            transition={{ duration: 0.15 }}
                            className="flex flex-col min-w-0"
                        >
                            <span className="font-semibold text-sm truncate">GitaVerse</span>
                            <span className="text-[10px] uppercase tracking-widest text-muted-foreground truncate">
                                Creative Studio
                            </span>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <Separator />

            {/* Navigation Groups */}
            <nav className="flex-1 overflow-y-auto py-4 space-y-6">
                {sidebarNavigation.map((group) => (
                    <div key={group.title} className="px-3">
                        <AnimatePresence>
                            {sidebarOpen && (
                                <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="text-[11px] uppercase tracking-wider text-muted-foreground mb-2 px-2"
                                >
                                    {group.title}
                                </motion.p>
                            )}
                        </AnimatePresence>

                        <ul className="space-y-1">
                            {group.items.map((item) => {
                                const Icon = iconMap[item.icon] || LayoutDashboard;
                                const isActive = pathname === item.href;

                                const linkEl = (
                                    <Link
                                        href={item.href}
                                        className={cn(
                                            'flex items-center gap-3 rounded-md transition-colors',
                                            sidebarOpen ? 'px-3 py-2' : 'px-0 py-2 justify-center',
                                            isActive
                                                ? 'bg-primary/10 text-primary font-medium'
                                                : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                                        )}
                                    >
                                        <Icon className="h-4 w-4 flex-shrink-0" />
                                        <AnimatePresence>
                                            {sidebarOpen && (
                                                <motion.span
                                                    initial={{ opacity: 0, width: 0 }}
                                                    animate={{ opacity: 1, width: 'auto' }}
                                                    exit={{ opacity: 0, width: 0 }}
                                                    transition={{ duration: 0.15 }}
                                                    className="text-sm truncate"
                                                >
                                                    {item.label}
                                                </motion.span>
                                            )}
                                        </AnimatePresence>
                                    </Link>
                                );

                                return (
                                    <li key={item.href}>
                                        {!sidebarOpen ? (
                                            /**
                                             * When collapsed, wrap link in a Tooltip.
                                             * TooltipTrigger (base-ui) renders as <span> by default,
                                             * so we render the link inside it as child content.
                                             */
                                            <Tooltip>
                                                <TooltipTrigger
                                                    className="block w-full"
                                                    render={<span className="block w-full" />}
                                                >
                                                    {linkEl}
                                                </TooltipTrigger>
                                                <TooltipContent side="right" sideOffset={8}>
                                                    {item.label}
                                                </TooltipContent>
                                            </Tooltip>
                                        ) : (
                                            linkEl
                                        )}
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                ))}
            </nav>

            <Separator />

            {/* Collapse Toggle */}
            <div className="flex items-center justify-center p-3">
                <button
                    onClick={toggleSidebar}
                    className="inline-flex items-center justify-center h-8 w-8 rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                    aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
                >
                    {sidebarOpen ? (
                        <PanelLeftClose className="h-4 w-4" />
                    ) : (
                        <PanelLeft className="h-4 w-4" />
                    )}
                </button>
            </div>
        </motion.aside>
    );
}
