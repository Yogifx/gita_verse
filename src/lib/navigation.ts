/**
 * Navigation configuration for the sidebar.
 *
 * Centralized nav items definition. Each group maps to a section
 * in the sidebar with its own heading and list of links.
 */

import type { SidebarGroup } from '@/types';

export const sidebarNavigation: SidebarGroup[] = [
    {
        title: 'Workspace',
        items: [
            { label: 'Dashboard', href: '/', icon: 'LayoutDashboard' },
            { label: 'Projects', href: '/projects', icon: 'FolderKanban' },
            { label: 'Calendar', href: '/calendar', icon: 'CalendarDays' },
        ],
    },
    {
        title: 'Content',
        items: [
            { label: 'Content Bank', href: '/content-bank', icon: 'BookOpen' },
            { label: 'Post Builder', href: '/post-builder', icon: 'PenTool' },
            { label: 'Media Library', href: '/media', icon: 'Image' },
        ],
    },
    {
        title: 'Assets & Themes',
        items: [
            { label: 'Background Library', href: '/backgrounds', icon: 'Palette' },
            { label: 'Typography', href: '/typography', icon: 'Type' },
            { label: 'Theme Manager', href: '/themes', icon: 'Paintbrush' },
            { label: 'Settings', href: '/settings', icon: 'Settings' },
        ],
    },
];
