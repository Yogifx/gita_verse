/**
 * MobileSidebar — Sheet-based sidebar for mobile viewports.
 *
 * Uses shadcn/ui Sheet (backed by @base-ui/react) to slide in the
 * navigation from the left on small screens.
 * Note: SheetTrigger renders as a native <button> — no asChild needed.
 */

'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    Menu,
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
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { useAppStore } from '@/lib/store';
import { sidebarNavigation } from '@/lib/navigation';
import {
    Sheet,
    SheetContent,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';

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

export function MobileSidebar() {
    const pathname = usePathname();
    const { mobileMenuOpen, setMobileMenuOpen } = useAppStore();

    return (
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            {/* SheetTrigger renders as a native <button> — style it directly */}
            <SheetTrigger
                className="lg:hidden inline-flex items-center justify-center h-9 w-9 rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                aria-label="Open menu"
            >
                <Menu className="h-5 w-5" />
            </SheetTrigger>

            <SheetContent side="left" className="w-72 p-0">
                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>

                {/* Brand */}
                <div className="flex items-center gap-3 px-4 h-16">
                    <div className="flex items-center justify-center w-8 h-8 rounded-md bg-primary text-primary-foreground font-bold text-sm flex-shrink-0">
                        G
                    </div>
                    <div className="flex flex-col">
                        <span className="font-semibold text-sm">GitaVerse</span>
                        <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
                            Creative Studio
                        </span>
                    </div>
                </div>

                <Separator />

                {/* Navigation */}
                <nav className="py-4 space-y-6">
                    {sidebarNavigation.map((group) => (
                        <div key={group.title} className="px-3">
                            <p className="text-[11px] uppercase tracking-wider text-muted-foreground mb-2 px-2">
                                {group.title}
                            </p>
                            <ul className="space-y-1">
                                {group.items.map((item) => {
                                    const Icon = iconMap[item.icon] || LayoutDashboard;
                                    const isActive = pathname === item.href;
                                    return (
                                        <li key={item.href}>
                                            <Link
                                                href={item.href}
                                                onClick={() => setMobileMenuOpen(false)}
                                                className={cn(
                                                    'flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors',
                                                    isActive
                                                        ? 'bg-primary/10 text-primary font-medium'
                                                        : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                                                )}
                                            >
                                                <Icon className="h-4 w-4" />
                                                {item.label}
                                            </Link>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    ))}
                </nav>
            </SheetContent>
        </Sheet>
    );
}
