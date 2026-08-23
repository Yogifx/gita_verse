"use client";

import { useMemo, useState } from "react";
import { FolderPlus } from "lucide-react";
import { useProjectsStore } from "@/features/projects/store/use-projects-store";
import { searchProjects } from "@/features/projects/lib/selectors";
import { ProjectSearch } from "@/features/projects/components/ProjectSearch";
import { ProjectList } from "@/features/projects/components/ProjectList";
import { CreateProjectModal } from "@/features/projects/components/CreateProjectModal";
import { WorkspaceLoading } from "@/components/shared/WorkspaceLoading";

export function ProjectsListView() {
  const projects = useProjectsStore((s) => s.projects);
  const isHydrated = useProjectsStore((s) => s.isHydrated);
  const [query, setQuery] = useState("");
  const [createOpen, setCreateOpen] = useState(false);

  const visibleProjects = useMemo(() => searchProjects(projects, query), [projects, query]);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <ProjectSearch value={query} onChange={setQuery} className="sm:max-w-md" />
        <button
          type="button"
          onClick={() => setCreateOpen(true)}
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-control bg-primary px-4 py-2.5 text-caption font-medium text-foreground-on-primary transition-colors duration-fast hover:bg-primary-hover"
        >
          <FolderPlus className="h-4 w-4" />
          New Project
        </button>
      </div>

      {isHydrated ? (
        <ProjectList
          projects={visibleProjects}
          hasAnyProjects={projects.length > 0}
          onCreate={() => setCreateOpen(true)}
        />
      ) : (
        <WorkspaceLoading label="Loading Knowledge Projects…" />
      )}

      <CreateProjectModal open={createOpen} onClose={() => setCreateOpen(false)} />
    </div>
  );
}
