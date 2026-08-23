"use client";

import { useSettingsStore } from "@/features/settings/store/use-settings-store";
import { CREATOR_ROLES, type CreatorRole } from "@/constants/settings";
import { SectionCard } from "@/components/shared/SectionCard";

export function ProfileSettingsCard() {
  const displayName = useSettingsStore((s) => s.displayName);
  const role = useSettingsStore((s) => s.role);
  const setDisplayName = useSettingsStore((s) => s.setDisplayName);
  const setRole = useSettingsStore((s) => s.setRole);

  return (
    <SectionCard
      title="Profile"
      description="How you're identified across the GitaVerse workspace. Saved to the local workspace data file — no account system yet."
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5">
          <span className="text-caption font-medium text-foreground-secondary">Display name</span>
          <input
            type="text"
            value={displayName}
            onChange={(event) => setDisplayName(event.target.value)}
            placeholder="Your name"
            className="rounded-control border border-border bg-background px-3 py-2 text-body text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-caption font-medium text-foreground-secondary">Role</span>
          <select
            value={role}
            onChange={(event) => setRole(event.target.value as CreatorRole)}
            className="rounded-control border border-border bg-background px-3 py-2 text-body text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >
            {CREATOR_ROLES.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
      </div>

      <p className="mt-3 text-caption text-foreground-muted">
        Your initials update in the header avatar as soon as you set a name.
      </p>
    </SectionCard>
  );
}
