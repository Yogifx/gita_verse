import type { KnowledgeProject } from "@/types/project";

export function searchProjects(projects: KnowledgeProject[], query: string): KnowledgeProject[] {
  const q = query.trim().toLowerCase();
  if (!q) return projects;

  return projects.filter((project) =>
    `${project.name} ${project.description}`.toLowerCase().includes(q),
  );
}

export function getProjectById(
  projects: KnowledgeProject[],
  id: string,
): KnowledgeProject | undefined {
  return projects.find((project) => project.id === id);
}
