"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Archive, ArrowLeft, FileText } from "lucide-react";
import { useProjectsStore } from "@/features/projects/store/use-projects-store";
import { getProjectById } from "@/features/projects/lib/selectors";
import { PROJECT_CATEGORY_META } from "@/constants/projects";
import { ProjectStatusBadge } from "@/features/projects/components/ProjectStatusBadge";
import { SectionCard } from "@/components/shared/SectionCard";
import { formatDate, formatRelativeTime } from "@/lib/utils/time";

type ProjectDetailsProps = {
  id: string;
};

export function ProjectDetails({ id }: ProjectDetailsProps) {
  const router = useRouter();
  const projects = useProjectsStore((s) => s.projects);
  const archiveProject = useProjectsStore((s) => s.archiveProject);

  const project = getProjectById(projects, id);

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-panel border border-dashed border-border bg-surface/60 px-6 py-16 text-center">
        <p className="text-body text-foreground-secondary">
          This project could not be found. It may have been removed.
        </p>
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 rounded-control bg-primary px-4 py-2 text-caption font-medium text-foreground-on-primary transition-colors duration-fast hover:bg-primary-hover"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Knowledge Projects
        </Link>
      </div>
    );
  }

  function handleArchive() {
    archiveProject(id);
    router.push("/projects");
  }

  return (
    <div className="flex flex-col gap-4">
      <Link
        href="/projects"
        className="inline-flex w-fit items-center gap-1.5 text-caption font-medium text-foreground-secondary transition-colors duration-fast hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to Knowledge Projects
      </Link>

      {project.status === "archived" ? (
        <div className="rounded-control border border-warning-muted bg-warning-muted/40 px-4 py-3 text-caption text-warning">
          This project is archived. It no longer appears as active in the project library.
        </div>
      ) : null}

      <SectionCard
        title={project.name}
        description={
          project.category ? PROJECT_CATEGORY_META[project.category].label : undefined
        }
        action={<ProjectStatusBadge status={project.status} />}
      >
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            <Meta label="Created" value={formatDate(project.createdAt)} />
            <Meta label="Last updated" value={formatRelativeTime(project.updatedAt)} />
            <Meta label="Content items" value={String(project.contentCount)} />
          </div>

          <div>
            <p className="mb-1 text-caption font-medium text-foreground-secondary">
              Project overview
            </p>
            <p className="text-body text-foreground">
              {project.description || "No description added yet."}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 border-t border-border pt-4">
            {project.status !== "archived" ? (
              <button
                type="button"
                onClick={handleArchive}
                className="inline-flex items-center gap-1.5 rounded-control border border-border px-4 py-2 text-caption font-medium text-foreground-secondary transition-colors duration-fast hover:bg-danger-muted hover:text-danger"
              >
                <Archive className="h-3.5 w-3.5" />
                Archive project
              </button>
            ) : null}
          </div>
        </div>
      </SectionCard>

      <SectionCard
        title="Knowledge & Content Summary"
        description="Documents, lessons, and content pieces linked to this project."
      >
        <div className="flex flex-col items-start gap-3 rounded-control border border-dashed border-border bg-background px-4 py-6">
          <span className="flex h-9 w-9 items-center justify-center rounded-control bg-primary-muted text-gold">
            <FileText className="h-4 w-4" />
          </span>
          <p className="text-body text-foreground-secondary">
            This project currently references{" "}
            <span className="font-medium text-foreground">{project.contentCount}</span>{" "}
            knowledge/content item{project.contentCount === 1 ? "" : "s"}. Linking individual
            Content Studio pieces to a Knowledge Project arrives in a future milestone.
          </p>
        </div>
      </SectionCard>
    </div>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-small text-foreground-muted">{label}</p>
      <p className="mt-0.5 font-medium text-foreground">{value}</p>
    </div>
  );
}
