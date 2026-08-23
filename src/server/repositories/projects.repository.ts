import type { KnowledgeProject, KnowledgeProjectStatus } from "@/types/project";
import { readDb, mutateDb } from "@/server/persistence/file-store";
import { DuplicateRecordError, NotFoundError, ValidationError } from "@/server/persistence/errors";

export async function listProjects(ownerId: string): Promise<KnowledgeProject[]> {
  const db = await readDb();
  return db.projects.filter((project) => project.ownerId === ownerId);
}

export async function getProject(id: string, ownerId: string): Promise<KnowledgeProject> {
  const db = await readDb();
  const project = db.projects.find((p) => p.id === id && p.ownerId === ownerId);
  if (!project) throw new NotFoundError("KnowledgeProject", id);
  return project;
}

/** Inserts a fully-formed project record (id/timestamps assigned by the caller). */
export async function createProject(input: KnowledgeProject): Promise<KnowledgeProject> {
  if (!input.id) throw new ValidationError("Project id is required.");
  if (!input.ownerId) throw new ValidationError("Project owner is required.");
  if (!input.name || !input.name.trim()) throw new ValidationError("Project name is required.");

  return mutateDb((db) => {
    if (db.projects.some((p) => p.id === input.id)) {
      throw new DuplicateRecordError("KnowledgeProject", input.id);
    }

    const record: KnowledgeProject = { ...input, name: input.name.trim() };
    return { db: { ...db, projects: [record, ...db.projects] }, result: record };
  });
}

export type ProjectPatch = Partial<
  Pick<KnowledgeProject, "name" | "description" | "category" | "status" | "contentCount">
> & { updatedAt: string };

export async function updateProject(
  id: string,
  ownerId: string,
  patch: ProjectPatch,
): Promise<KnowledgeProject> {
  if (patch.name !== undefined && !patch.name.trim()) {
    throw new ValidationError("Project name cannot be empty.");
  }

  return mutateDb((db) => {
    const index = db.projects.findIndex((p) => p.id === id && p.ownerId === ownerId);
    if (index === -1) throw new NotFoundError("KnowledgeProject", id);

    const updated: KnowledgeProject = {
      ...db.projects[index],
      ...patch,
      name: patch.name !== undefined ? patch.name.trim() : db.projects[index].name,
      ownerId,
    };
    const projects = [...db.projects];
    projects[index] = updated;
    return { db: { ...db, projects }, result: updated };
  });
}

export async function archiveProject(id: string, ownerId: string): Promise<KnowledgeProject> {
  const status: KnowledgeProjectStatus = "archived";
  return updateProject(id, ownerId, { status, updatedAt: new Date().toISOString() });
}
