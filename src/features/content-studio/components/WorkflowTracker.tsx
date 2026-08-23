import { Check } from "lucide-react";
import type { WorkflowStage } from "@/types/content";
import { PIPELINE_STAGES } from "@/constants/content";
import { cn } from "@/lib/utils/cn";

type WorkflowTrackerProps = {
  stage: WorkflowStage;
};

export function WorkflowTracker({ stage }: WorkflowTrackerProps) {
  const currentIndex = PIPELINE_STAGES.findIndex((s) => s.stage === stage);

  return (
    <div
      className="flex items-stretch gap-1 overflow-x-auto"
      role="list"
      aria-label="Content workflow stage"
    >
      {PIPELINE_STAGES.map((item, index) => {
        const isComplete = index < currentIndex;
        const isCurrent = index === currentIndex;

        return (
          <div key={item.stage} className="flex flex-1 items-center gap-1" role="listitem">
            <div className="flex min-w-[5.5rem] flex-1 flex-col items-center gap-1.5 text-center">
              <span
                className={cn(
                  "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-small font-medium",
                  isCurrent && "border-primary bg-primary text-foreground-on-primary",
                  isComplete && "border-primary-muted bg-primary-muted text-gold",
                  !isCurrent && !isComplete && "border-border bg-background text-foreground-muted",
                )}
              >
                {isComplete ? <Check className="h-3.5 w-3.5" /> : index + 1}
              </span>
              <span
                className={cn(
                  "text-small",
                  isCurrent
                    ? "font-medium text-foreground"
                    : isComplete
                      ? "text-foreground-secondary"
                      : "text-foreground-muted",
                )}
              >
                {item.label}
              </span>
            </div>
            {index < PIPELINE_STAGES.length - 1 ? (
              <div
                className={cn(
                  "mb-4 h-px flex-1",
                  isComplete ? "bg-primary-muted" : "bg-border",
                )}
              />
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
