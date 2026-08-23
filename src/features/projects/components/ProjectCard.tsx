import Link from "next/link";
import { ArrowRight, FolderKanban } from "lucide-react";
import type { KnowledgeProject } from "@/types/project";
import { PROJECT_CATEGORY_META } from "@/constants/projects";
import { ProjectStatusBadge } from "@/features/projects/components/ProjectStatusBadge";
import { formatRelativeTime } from "@/lib/utils/time";

type ProjectCardProps = {
  project: KnowledgeProject;
};

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link
      href={`/projects/${project.id}`}
      className="group flex flex-col gap-3 rounded-panel border border-border bg-surface p-4 transition-colors duration-fast hover:border-primary-muted hover:bg-muted/40"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-control bg-primary-muted text-gold">
            <FolderKanban className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <p className="truncate font-medium text-foreground">{project.name}</p>
            {project.category ? (
              <p className="truncate text-caption text-foreground-muted">
                {PROJECT_CATEGORY_META[project.category].label}
              </p>
            ) : null}
          </div>
        </div>
        <ProjectStatusBadge status={project.status} />
      </div>

      <p className="line-clamp-2 text-caption text-foreground-secondary">
        {project.description}
      </p>

      <div className="mt-auto flex items-center justify-between pt-1 text-caption text-foreground-muted">
        <span>
          {project.contentCount} {project.contentCount === 1 ? "item" : "items"} · Updated{" "}
          {formatRelativeTime(project.updatedAt)}
        </span>
        <span className="inline-flex items-center gap-1 font-medium text-gold opacity-0 transition-opacity duration-fast group-hover:opacity-100">
          Open
          <ArrowRight className="h-3.5 w-3.5" />
        </span>
      </div>
    </Link>
  );
}
