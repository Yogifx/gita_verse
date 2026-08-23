import { Check, X } from "lucide-react";
import type { DesignGuideline } from "@/types/design-intelligence";
import { CONTENT_FORMAT_META } from "@/constants/content";
import { GUIDANCE_CATEGORY_META } from "@/constants/design-intelligence";

type GuidelineCardProps = {
  guideline: DesignGuideline;
};

export function GuidelineCard({ guideline }: GuidelineCardProps) {
  const categoryMeta = GUIDANCE_CATEGORY_META[guideline.category];
  const formatMeta = CONTENT_FORMAT_META[guideline.format];
  const CategoryIcon = categoryMeta.icon;

  return (
    <div className="flex flex-col gap-3 rounded-panel border border-border bg-surface p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-control bg-primary-muted text-gold">
            <CategoryIcon className="h-4 w-4" />
          </span>
          <div>
            <p className="font-medium text-foreground">{guideline.title}</p>
            <p className="text-small text-foreground-muted">{categoryMeta.label}</p>
          </div>
        </div>
        <span className="shrink-0 whitespace-nowrap rounded-full border border-border bg-background px-2.5 py-1 text-small font-medium text-foreground-secondary">
          {formatMeta.label}
        </span>
      </div>

      <p className="text-caption text-foreground-secondary">{guideline.principle}</p>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <p className="mb-1.5 flex items-center gap-1.5 text-small font-medium text-success">
            <Check className="h-3.5 w-3.5" />
            Do
          </p>
          <ul className="flex flex-col gap-1.5">
            {guideline.dos.map((item) => (
              <li key={item} className="text-caption text-foreground-secondary">
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="mb-1.5 flex items-center gap-1.5 text-small font-medium text-danger">
            <X className="h-3.5 w-3.5" />
            Don&apos;t
          </p>
          <ul className="flex flex-col gap-1.5">
            {guideline.donts.map((item) => (
              <li key={item} className="text-caption text-foreground-secondary">
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
