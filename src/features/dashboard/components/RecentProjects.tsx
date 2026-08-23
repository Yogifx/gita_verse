import Link from "next/link";
import { Pencil } from "lucide-react";
import type { ContentItem } from "@/types/content";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { FormatBadge } from "@/components/shared/FormatBadge";
import { SectionCard } from "@/components/shared/SectionCard";
import { formatRelativeTime } from "@/lib/utils/time";

type RecentProjectsProps = {
  projects: ContentItem[];
};

export function RecentProjects({ projects }: RecentProjectsProps) {
  return (
    <SectionCard
      title="Recent Projects"
      description="Where you left off."
      action={
        <Link
          href="/projects"
          className="text-caption font-medium text-gold transition-colors duration-fast hover:text-primary-hover"
        >
          View all
        </Link>
      }
    >
      {projects.length === 0 ? (
        <p className="py-6 text-center text-caption text-foreground-muted">
          No projects yet. Create your first one from Quick Actions.
        </p>
      ) : (
        <ul className="flex flex-col divide-y divide-border">
          {projects.map((project) => (
            <li
              key={project.id}
              className="flex flex-wrap items-center justify-between gap-3 py-3"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-foreground">{project.title}</p>
                <p className="truncate text-caption text-foreground-muted">
                  Chapter {project.reference.chapter} · Verse{" "}
                  {project.reference.verseLabel}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <FormatBadge format={project.format} />
                <StatusBadge status={project.status} />
                <span className="text-small text-foreground-muted">
                  {formatRelativeTime(project.updatedAt)}
                </span>
                <Link
                  href={`/studio?format=${project.format}&item=${project.id}`}
                  className="inline-flex items-center gap-1.5 rounded-control border border-border px-3 py-1.5 text-caption font-medium text-foreground-secondary transition-colors duration-fast hover:bg-muted hover:text-foreground"
                >
                  <Pencil className="h-3.5 w-3.5" />
                  Edit
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </SectionCard>
  );
}
