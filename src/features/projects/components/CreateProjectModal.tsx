"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Modal } from "@/components/shared/Modal";
import { useProjectsStore } from "@/features/projects/store/use-projects-store";
import { PROJECT_CATEGORIES, PROJECT_CATEGORY_META } from "@/constants/projects";
import type { KnowledgeProjectCategory } from "@/types/project";
import { cn } from "@/lib/utils/cn";

type CreateProjectModalProps = {
  open: boolean;
  onClose: () => void;
};

export function CreateProjectModal({ open, onClose }: CreateProjectModalProps) {
  const router = useRouter();
  const createProject = useProjectsStore((s) => s.createProject);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<KnowledgeProjectCategory | undefined>(undefined);
  const [touched, setTouched] = useState(false);

  const isNameValid = name.trim().length > 0;

  function handleClose() {
    setName("");
    setDescription("");
    setCategory(undefined);
    setTouched(false);
    onClose();
  }

  function handleCreate() {
    setTouched(true);
    if (!isNameValid) return;

    const id = createProject({ name, description, category, status: "draft" });
    handleClose();
    router.push(`/projects/${id}`);
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="New Knowledge Project"
      description="A project is a reusable knowledge context for creating GitaVerse content."
    >
      <div className="flex flex-col gap-5">
        <div>
          <label className="mb-1.5 block text-caption font-medium text-foreground-secondary">
            Project name
          </label>
          <input
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="e.g. Bhakti Yoga Study Series"
            className={cn(
              "w-full rounded-control border bg-background px-3 py-2 text-caption text-foreground placeholder:text-foreground-muted focus:outline-none",
              touched && !isNameValid
                ? "border-danger focus:border-danger"
                : "border-border focus:border-primary-muted",
            )}
          />
          {touched && !isNameValid ? (
            <p className="mt-1.5 text-small text-danger">Project name is required.</p>
          ) : null}
        </div>

        <div>
          <label className="mb-1.5 block text-caption font-medium text-foreground-secondary">
            Description <span className="text-foreground-muted">(optional)</span>
          </label>
          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="What is this project for, and what will it help you create?"
            rows={3}
            className="w-full resize-none rounded-control border border-border bg-background px-3 py-2 text-caption text-foreground placeholder:text-foreground-muted focus:border-primary-muted focus:outline-none"
          />
        </div>

        <div>
          <p className="mb-2 text-caption font-medium text-foreground-secondary">
            Category <span className="text-foreground-muted">(optional)</span>
          </p>
          <div className="flex flex-wrap gap-2">
            {PROJECT_CATEGORIES.map((option) => {
              const isActive = option === category;
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => setCategory(isActive ? undefined : option)}
                  aria-pressed={isActive}
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-caption font-medium transition-colors duration-fast",
                    isActive
                      ? "border-primary bg-primary-muted text-gold"
                      : "border-border bg-background text-foreground-secondary hover:bg-muted",
                  )}
                >
                  {PROJECT_CATEGORY_META[option].label}
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
            className="rounded-control bg-primary px-4 py-2 text-caption font-medium text-foreground-on-primary transition-colors duration-fast hover:bg-primary-hover"
          >
            Create Project
          </button>
        </div>
      </div>
    </Modal>
  );
}
