/**
 * DashboardQuickActions — animated quick-action cards.
 *
 * This is a Client Component so it can use Framer Motion hover animations.
 * Kept separate from page.tsx which is a Server Component.
 */

'use client';

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const quickActions = [
    {
        label: 'Create New Post',
        description: 'Start a carousel, reel, or quote card',
        href: '/post-builder',
    },
    {
        label: 'Browse Content Bank',
        description: 'Pick a verified verse to work with',
        href: '/content-bank',
    },
    {
        label: 'Open Media Library',
        description: 'Manage background images and assets',
        href: '/media',
    },
];

export function DashboardQuickActions() {
    return (
        <section aria-label="Quick actions">
            <h2 className="text-base font-medium mb-4">Quick Actions</h2>
            <div className="grid sm:grid-cols-3 gap-4">
                {quickActions.map((action, i) => (
                    <motion.a
                        key={action.label}
                        href={action.href}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.08, duration: 0.3, ease: 'easeOut' }}
                        whileHover={{ y: -3, transition: { duration: 0.15 } }}
                        className="group rounded-xl border bg-card p-5 flex flex-col gap-2 hover:border-primary/40 transition-colors cursor-pointer"
                    >
                        <span className="font-medium text-sm">{action.label}</span>
                        <span className="text-xs text-muted-foreground flex-1">{action.description}</span>
                        <span className="flex items-center gap-1 text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity mt-1">
                            Open <ArrowRight className="h-3 w-3" />
                        </span>
                    </motion.a>
                ))}
            </div>
        </section>
    );
}
