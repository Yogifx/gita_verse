import type { KnowledgeProjectStatus } from "@/types/project";
import { PROJECT_STATUS_META } from "@/constants/projects";
import type { StatusTone } from "@/constants/content";
import { cn } from "@/lib/utils/cn";

const TONE_CLASSES: Record<StatusTone, string> = {
  neutral: "bg-muted text-foreground-secondary",
  info: "bg-secondary-muted text-indigo",
  warning: "bg-warning-muted text-warning",
  success: "bg-success-muted text-success",
};

type ProjectStatusBadgeProps = {
  status: KnowledgeProjectStatus;
  className?: string;
};

export function ProjectStatusBadge({ status, className }: ProjectStatusBadgeProps) {
  const meta = PROJECT_STATUS_META[status];

  return (
    <span
      className={cn(
        "inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-1 text-small font-medium",
        TONE_CLASSES[meta.tone],
        className,
      )}
    >
      {meta.label}
    </span>
  );
}
