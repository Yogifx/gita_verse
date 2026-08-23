"use client";

import { useState } from "react";
import { X } from "lucide-react";
import type { AssetCategory } from "@/types/asset";
import { ASSET_CATEGORIES, ASSET_CATEGORY_META } from "@/constants/assets";
import { cn } from "@/lib/utils/cn";

type AssetMetadataFormProps = {
  name: string;
  onNameChange: (value: string) => void;
  category: AssetCategory | undefined;
  onCategoryChange: (value: AssetCategory) => void;
  tags: string[];
  onTagsChange: (tags: string[]) => void;
  nameError?: string;
  categoryError?: string;
};

export function AssetMetadataForm({
  name,
  onNameChange,
  category,
  onCategoryChange,
  tags,
  onTagsChange,
  nameError,
  categoryError,
}: AssetMetadataFormProps) {
  const [tagInput, setTagInput] = useState("");

  function commitTag() {
    const tag = tagInput.trim().toLowerCase();
    if (tag && !tags.includes(tag)) {
      onTagsChange([...tags, tag]);
    }
    setTagInput("");
  }

  function handleTagKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      commitTag();
    } else if (event.key === "Backspace" && tagInput === "" && tags.length > 0) {
      onTagsChange(tags.slice(0, -1));
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <div>
        <label className="mb-1.5 block text-caption font-medium text-foreground-secondary">
          Asset name
        </label>
        <input
          type="text"
          value={name}
          onChange={(event) => onNameChange(event.target.value)}
          placeholder="e.g. Sunrise Over the Ganges"
          className={cn(
            "w-full rounded-control border bg-background px-3 py-2 text-caption text-foreground placeholder:text-foreground-muted focus:outline-none",
            nameError ? "border-danger focus:border-danger" : "border-border focus:border-primary-muted",
          )}
        />
        {nameError ? <p className="mt-1.5 text-small text-danger">{nameError}</p> : null}
      </div>

      <div>
        <p className="mb-2 text-caption font-medium text-foreground-secondary">Category</p>
        <div className="flex flex-wrap gap-2">
          {ASSET_CATEGORIES.map((option) => {
            const isActive = option === category;
            return (
              <button
                key={option}
                type="button"
                onClick={() => onCategoryChange(option)}
                aria-pressed={isActive}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-caption font-medium transition-colors duration-fast",
                  isActive
                    ? "border-primary bg-primary-muted text-gold"
                    : "border-border bg-background text-foreground-secondary hover:bg-muted",
                )}
              >
                {ASSET_CATEGORY_META[option].label}
              </button>
            );
          })}
        </div>
        {categoryError ? <p className="mt-1.5 text-small text-danger">{categoryError}</p> : null}
      </div>

      <div>
        <label className="mb-1.5 block text-caption font-medium text-foreground-secondary">
          Tags <span className="text-foreground-muted">(optional)</span>
        </label>
        <div className="flex flex-wrap items-center gap-1.5 rounded-control border border-border bg-background px-2.5 py-2 focus-within:border-primary-muted">
          {tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-small text-foreground-secondary"
            >
              {tag}
              <button
                type="button"
                onClick={() => onTagsChange(tags.filter((t) => t !== tag))}
                aria-label={`Remove tag ${tag}`}
                className="text-foreground-muted transition-colors duration-fast hover:text-foreground"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
          <input
            type="text"
            value={tagInput}
            onChange={(event) => setTagInput(event.target.value)}
            onKeyDown={handleTagKeyDown}
            onBlur={commitTag}
            placeholder={tags.length === 0 ? "Add a tag and press Enter…" : "Add another…"}
            className="min-w-[8rem] flex-1 bg-transparent py-0.5 text-caption text-foreground placeholder:text-foreground-muted focus:outline-none"
          />
        </div>
      </div>
    </div>
  );
}
