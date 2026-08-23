import type { ContentFormat } from "@/types/content";
import { CONTENT_FORMAT_META } from "@/constants/content";
import { cn } from "@/lib/utils/cn";

type FormatBadgeProps = {
  format: ContentFormat;
  className?: string;
};

export function FormatBadge({ format, className }: FormatBadgeProps) {
  const meta = CONTENT_FORMAT_META[format];
  const Icon = meta.icon;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-border bg-surface px-2.5 py-1 text-small font-medium text-foreground-secondary",
        className,
      )}
    >
      <Icon className="h-3.5 w-3.5 text-foreground-muted" />
      {meta.label}
    </span>
  );
}
