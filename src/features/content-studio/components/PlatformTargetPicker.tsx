import type { Platform } from "@/types/content";
import { PLATFORMS, PLATFORM_META } from "@/constants/content";
import { cn } from "@/lib/utils/cn";

type PlatformTargetPickerProps = {
  platforms: Platform[];
  onToggle: (platform: Platform) => void;
};

export function PlatformTargetPicker({ platforms, onToggle }: PlatformTargetPickerProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {PLATFORMS.map((platform) => {
        const isActive = platforms.includes(platform);
        return (
          <button
            key={platform}
            type="button"
            onClick={() => onToggle(platform)}
            aria-pressed={isActive}
            className={cn(
              "rounded-full border px-3 py-1.5 text-caption font-medium transition-colors duration-fast",
              isActive
                ? "border-primary bg-primary-muted text-gold"
                : "border-border bg-background text-foreground-secondary hover:bg-muted hover:text-foreground",
            )}
          >
            {PLATFORM_META[platform].label}
          </button>
        );
      })}
    </div>
  );
}
