import { ChevronRight } from "lucide-react";
import type { PipelineStageCount } from "@/features/dashboard/types";
import { SectionCard } from "@/components/shared/SectionCard";
import { cn } from "@/lib/utils/cn";

type ContentPipelineProps = {
  stages: PipelineStageCount[];
};

export function ContentPipeline({ stages }: ContentPipelineProps) {
  return (
    <SectionCard
      title="Content Pipeline"
      description="Idea → Research → Script → Design → Review → Approved → Scheduled → Published"
    >
      <div className="flex flex-wrap items-stretch gap-2 md:flex-nowrap md:overflow-x-auto">
        {stages.map((stage, index) => (
          <div key={stage.stage} className="flex items-center gap-2">
            <div
              className={cn(
                "flex min-w-[6.5rem] flex-col items-center gap-1 rounded-control border px-3 py-2.5 text-center",
                stage.count > 0
                  ? "border-primary-muted bg-primary-muted/40"
                  : "border-border bg-background",
              )}
            >
              <span
                className={cn(
                  "font-sans text-2xl font-semibold",
                  stage.count > 0 ? "text-gold" : "text-foreground-muted",
                )}
              >
                {stage.count}
              </span>
              <span className="text-small text-foreground-secondary">{stage.label}</span>
            </div>
            {index < stages.length - 1 ? (
              <ChevronRight className="h-4 w-4 shrink-0 text-foreground-muted" />
            ) : null}
          </div>
        ))}
      </div>
    </SectionCard>
  );
}
