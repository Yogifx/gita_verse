/**
 * Dashboard Page — GitaVerse Studio home screen.
 *
 * This is a placeholder foundation page (Server Component).
 * Feature implementations (stats, project cards, activity feed)
 * will be added per feature module.
 */

import type { Metadata } from 'next';
import { BookOpen, FolderKanban, TrendingUp, Zap, Sparkles } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { DashboardQuickActions } from '@/components/shared/dashboard-quick-actions';

export const metadata: Metadata = {
  title: 'Dashboard',
};

// ── Placeholder stat data ──────────────────────────────────────────────────────
const stats = [
  { label: 'Posts Ready', value: '7', icon: BookOpen, delta: '+2 this week' },
  { label: 'Projects Active', value: '3', icon: FolderKanban, delta: '+1 this week' },
  { label: 'Published Assets', value: '92', icon: TrendingUp, delta: '+14 this month' },
  { label: 'AI Quality Score', value: '98', icon: Zap, delta: 'Excellent' },
];

export default function DashboardPage() {
  return (
    <div className="p-6 md:p-8 space-y-10 max-w-7xl mx-auto">

      {/* ── Page Header ─────────────────────────────────── */}
      <div>
        <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
          <Sparkles className="h-4 w-4" />
          <span>Welcome back</span>
        </div>
        <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Your GitaVerse creative workspace — review, create, and publish.
        </p>
      </div>

      {/* ── Stats Row ───────────────────────────────────── */}
      <section aria-label="Overview statistics">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="rounded-xl border bg-card p-5 flex flex-col gap-3 hover:border-primary/40 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{stat.label}</span>
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="text-3xl font-semibold tracking-tight">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.delta}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Quick Actions (Client Component for hover animations) ────── */}
      <DashboardQuickActions />

      {/* ── Foundation Notice ───────────────────────────── */}
      <section className="rounded-xl border border-dashed border-primary/30 bg-primary/5 p-8 text-center">
        <Sparkles className="h-8 w-8 mx-auto mb-3 text-primary/60" />
        <h3 className="font-medium mb-1">Foundation Ready</h3>
        <p className="text-sm text-muted-foreground max-w-md mx-auto mb-4">
          App shell, theme system, navigation, and state management are all wired up.
          Feature modules can now be built on top of this foundation.
        </p>
        <Button variant="outline" size="sm">
          View Documentation
        </Button>
      </section>

    </div>
  );
}
