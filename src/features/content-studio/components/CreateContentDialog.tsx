"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Modal } from "@/components/shared/Modal";
import { useContentStore } from "@/features/content/store/use-content-store";
import { CONTENT_FORMATS, CONTENT_FORMAT_META, PLATFORMS, PLATFORM_META } from "@/constants/content";
import type { ContentFormat, Platform } from "@/types/content";
import { cn } from "@/lib/utils/cn";

type CreateContentDialogProps = {
  open: boolean;
  onClose: () => void;
};

export function CreateContentDialog({ open, onClose }: CreateContentDialogProps) {
  const router = useRouter();
  const createContentItem = useContentStore((s) => s.createContentItem);

  const [format, setFormat] = useState<ContentFormat | null>(null);
  const [platforms, setPlatforms] = useState<Platform[]>([]);

  function togglePlatform(platform: Platform) {
    setPlatforms((prev) =>
      prev.includes(platform) ? prev.filter((p) => p !== platform) : [...prev, platform],
    );
  }

  function handleClose() {
    setFormat(null);
    setPlatforms([]);
    onClose();
  }

  function handleCreate() {
    if (!format) return;
    const id = createContentItem(format, platforms);
    handleClose();
    router.push(`/studio?format=${format}&item=${id}`);
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Create Content"
      description="Choose a format to start a new GitaVerse content piece."
    >
      <div className="flex flex-col gap-5">
        <div>
          <p className="mb-2 text-caption font-medium text-foreground-secondary">Format</p>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            {CONTENT_FORMATS.map((option) => {
              const meta = CONTENT_FORMAT_META[option];
              const Icon = meta.icon;
              const isActive = option === format;

              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => setFormat(option)}
                  aria-pressed={isActive}
                  className={cn(
                    "flex flex-col items-start gap-2 rounded-control border p-3 text-left transition-colors duration-fast",
                    isActive
                      ? "border-primary bg-primary-muted"
                      : "border-border bg-background hover:bg-muted",
                  )}
                >
                  <Icon className={cn("h-5 w-5", isActive ? "text-gold" : "text-foreground-muted")} />
                  <span
                    className={cn(
                      "text-caption font-medium",
                      isActive ? "text-gold" : "text-foreground",
                    )}
                  >
                    {meta.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <p className="mb-2 text-caption font-medium text-foreground-secondary">
            Target platforms <span className="text-foreground-muted">(optional)</span>
          </p>
          <div className="flex flex-wrap gap-2">
            {PLATFORMS.map((platform) => {
              const isActive = platforms.includes(platform);
              return (
                <button
                  key={platform}
                  type="button"
                  onClick={() => togglePlatform(platform)}
                  aria-pressed={isActive}
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-caption font-medium transition-colors duration-fast",
                    isActive
                      ? "border-primary bg-primary-muted text-gold"
                      : "border-border bg-background text-foreground-secondary hover:bg-muted",
                  )}
                >
                  {PLATFORM_META[platform].label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-border pt-4">
          <button
            type="button"
            onClick={handleClose}
            className="rounded-control border border-border px-4 py-2 text-caption font-medium text-foreground-secondary transition-colors duration-fast hover:bg-muted hover:text-foreground"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleCreate}
            disabled={!format}
            className="rounded-control bg-primary px-4 py-2 text-caption font-medium text-foreground-on-primary transition-colors duration-fast hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
          >
            Create
          </button>
        </div>
      </div>
    </Modal>
  );
}
