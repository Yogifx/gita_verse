import type { ContentStatus } from "@/types/content";
import {
  REVIEW_STATUS_STEPS,
  reviewStatusStep,
} from "@/features/studio/lib/creation-status";
import { cn } from "@/lib/utils/cn";

type ContentStatusStepperProps = {
  status: ContentStatus;
};

export function ContentStatusStepper({ status }: ContentStatusStepperProps) {
  const current = reviewStatusStep(status);
  const currentIndex = REVIEW_STATUS_STEPS.findIndex((step) => step.id === current);

  return (
    <div className="flex flex-col gap-2" aria-label="Content status">
      <div className="flex items-center gap-2">
        {REVIEW_STATUS_STEPS.map((step, index) => {
          const isCurrent = step.id === current;
          const isComplete = index < currentIndex;

          return (
            <div key={step.id} className="flex min-w-0 flex-1 items-center gap-2">
              <span
                className={cn(
                  "rounded-full px-2.5 py-1 text-small font-medium",
                  isCurrent && step.id === "approved" && "bg-success-muted text-success",
                  isCurrent && step.id === "in_review" && "bg-warning-muted text-warning",
                  isCurrent && step.id === "draft" && "bg-muted text-foreground-secondary",
                  isComplete && "bg-primary-muted text-gold",
                  !isCurrent && !isComplete && "bg-background text-foreground-muted",
                )}
              >
                {step.label}
              </span>
              {index < REVIEW_STATUS_STEPS.length - 1 ? (
                <span
                  className={cn(
                    "h-px min-w-4 flex-1",
                    isComplete ? "bg-primary-muted" : "bg-border",
                  )}
                  aria-hidden
                />
              ) : null}
            </div>
          );
        })}
      </div>
      <p className="text-small text-foreground-muted">Draft → In Review → Approved</p>
    </div>
  );
}
