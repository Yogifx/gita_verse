import Link from "next/link";
import { ArrowRight, Palette } from "lucide-react";
import { SectionCard } from "@/components/shared/SectionCard";

export function AppearanceLinkCard() {
  return (
    <SectionCard
      title="Appearance"
      description="Theme and visual preferences have their own dedicated workspace."
    >
      <Link
        href="/theme"
        className="flex items-center justify-between gap-3 rounded-control border border-border bg-background px-4 py-3 transition-colors duration-fast hover:bg-muted"
      >
        <span className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-control bg-primary-muted text-gold">
            <Palette className="h-4 w-4" />
          </span>
          <span>
            <span className="block font-medium text-foreground">Open Theme Manager</span>
            <span className="block text-caption text-foreground-secondary">
              Switch between Dark and Light, and preview design tokens.
            </span>
          </span>
        </span>
        <ArrowRight className="h-4 w-4 shrink-0 text-foreground-muted" />
      </Link>
    </SectionCard>
  );
}
