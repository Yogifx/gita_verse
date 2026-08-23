"use client";

import { useState } from "react";
import { LogOut } from "lucide-react";
import { useSettingsStore } from "@/features/settings/store/use-settings-store";
import { SectionCard } from "@/components/shared/SectionCard";

export function AccountSessionCard() {
  const email = useSettingsStore((s) => s.email);
  const signOut = useSettingsStore((s) => s.signOut);
  const [pending, setPending] = useState(false);

  async function handleSignOut() {
    setPending(true);
    try {
      await signOut();
    } catch {
      setPending(false);
    }
  }

  return (
    <SectionCard
      title="Account"
      description="The signed-in identity for this GitaVerse workspace. Project membership and enforced roles arrive in a later milestone."
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-caption font-medium text-foreground-secondary">Email</p>
          <p className="mt-0.5 text-body text-foreground">{email || "—"}</p>
        </div>
        <button
          type="button"
          onClick={() => void handleSignOut()}
          disabled={pending}
          className="inline-flex items-center gap-1.5 rounded-control border border-border px-4 py-2 text-caption font-medium text-foreground-secondary transition-colors duration-fast hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-60"
        >
          <LogOut className="h-3.5 w-3.5" />
          {pending ? "Signing out…" : "Sign out"}
        </button>
      </div>
    </SectionCard>
  );
}
