"use client";

import { Minus, Plus } from "lucide-react";
import { useContentStore } from "@/features/content/store/use-content-store";
import { DAILY_TARGET_MAX, DAILY_TARGET_MIN } from "@/constants/settings";
import { SectionCard } from "@/components/shared/SectionCard";

export function WorkspacePreferencesCard() {
  const dailyTarget = useContentStore((s) => s.dailyTarget);
  const setDailyTarget = useContentStore((s) => s.setDailyTarget);
  const items = useContentStore((s) => s.items);

  const publishedToday = items.filter(
    (item) => item.isToday && item.status === "published",
  ).length;

  return (
    <SectionCard
      title="Workspace Preferences"
      description="Controls the daily publishing cadence used across the Dashboard."
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="font-medium text-foreground">Daily publishing target</p>
          <p className="mt-1 text-caption text-foreground-secondary">
            You&apos;ve published {publishedToday} of {dailyTarget} today.
          </p>
        </div>

        <div className="flex items-center gap-3 rounded-control border border-border bg-background px-2 py-1.5">
          <button
            type="button"
            aria-label="Decrease daily target"
            disabled={dailyTarget <= DAILY_TARGET_MIN}
            onClick={() => setDailyTarget(dailyTarget - 1)}
            className="flex h-8 w-8 items-center justify-center rounded-control text-foreground-secondary transition-colors duration-fast hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="w-8 text-center font-sans text-h3 text-foreground">{dailyTarget}</span>
          <button
            type="button"
            aria-label="Increase daily target"
            disabled={dailyTarget >= DAILY_TARGET_MAX}
            onClick={() => setDailyTarget(dailyTarget + 1)}
            className="flex h-8 w-8 items-center justify-center rounded-control text-foreground-secondary transition-colors duration-fast hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>
    </SectionCard>
  );
}
