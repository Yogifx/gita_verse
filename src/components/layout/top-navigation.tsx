/**
 * TopNavigation — Horizontal bar at the top of the main content area.
 *
 * Contains:
 * - Mobile menu trigger (hidden on desktop)
 * - Search placeholder
 * - Theme toggle
 * - User avatar dropdown
 */

'use client';

import * as React from 'react';
import { Search, Bell } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { ThemeToggle } from '@/components/shared/theme-toggle';
import { MobileSidebar } from '@/components/layout/mobile-sidebar';

export function TopNavigation() {
    return (
        <header className="flex items-center justify-between h-16 px-4 md:px-6 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex-shrink-0">
            {/* Left: Mobile menu + Search */}
            <div className="flex items-center gap-3">
                <MobileSidebar />
                <div className="relative hidden sm:block">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search projects, verses..."
                        className="w-64 pl-9 h-9 bg-muted/50"
                    />
                </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="h-9 w-9 hidden sm:flex">
                    <Bell className="h-4 w-4" />
                    <span className="sr-only">Notifications</span>
                </Button>

                <ThemeToggle />

                <Separator orientation="vertical" className="h-6 mx-1" />

                <Avatar className="h-8 w-8 cursor-pointer">
                    <AvatarImage src="" alt="User" />
                    <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">
                        YS
                    </AvatarFallback>
                </Avatar>
            </div>
        </header>
    );
}
