import { Check } from "lucide-react";
import {
  CREATION_JOURNEY_STEPS,
  type CreationJourneyStepId,
} from "@/features/studio/lib/creation-status";
import { cn } from "@/lib/utils/cn";

type CreationJourneyProps = {
  current: CreationJourneyStepId;
};

export function CreationJourney({ current }: CreationJourneyProps) {
  const currentIndex = CREATION_JOURNEY_STEPS.findIndex((step) => step.id === current);

  return (
    <div
      className="flex items-stretch gap-1 overflow-x-auto"
      role="list"
      aria-label="Content creation journey"
    >
      {CREATION_JOURNEY_STEPS.map((step, index) => {
        const isComplete = index < currentIndex;
        const isCurrent = index === currentIndex;

        return (
          <div key={step.id} className="flex flex-1 items-center gap-1" role="listitem">
            <div className="flex min-w-[4.75rem] flex-1 flex-col items-center gap-1.5 text-center">
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
                {step.label}
              </span>
            </div>
            {index < CREATION_JOURNEY_STEPS.length - 1 ? (
              <div className={cn("mb-4 h-px flex-1", isComplete ? "bg-primary-muted" : "bg-border")} />
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
