import { FolderPlus } from "lucide-react";
import type { KnowledgeProject } from "@/types/project";
import { ProjectCard } from "@/features/projects/components/ProjectCard";

type ProjectListProps = {
  projects: KnowledgeProject[];
  hasAnyProjects: boolean;
  onCreate: () => void;
};

export function ProjectList({ projects, hasAnyProjects, onCreate }: ProjectListProps) {
  if (projects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-panel border border-dashed border-border bg-surface/60 px-6 py-16 text-center">
        <p className="text-body text-foreground-secondary">
          {hasAnyProjects
            ? "Nothing matches your search."
            : "No Knowledge Projects yet. Create your first one to get started."}
        </p>
        <button
          type="button"
          onClick={onCreate}
          className="inline-flex items-center gap-2 rounded-control bg-primary px-4 py-2 text-caption font-medium text-foreground-on-primary transition-colors duration-fast hover:bg-primary-hover"
        >
          <FolderPlus className="h-4 w-4" />
          New Project
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}
