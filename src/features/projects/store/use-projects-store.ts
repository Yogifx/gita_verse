"use client";

import { create } from "zustand";
import type { KnowledgeProject, KnowledgeProjectCategory, KnowledgeProjectStatus } from "@/types/project";
import { apiGet, apiPatch, apiPost } from "@/lib/api/client";
import { usePersistenceStatusStore } from "@/stores/persistence-status-store";

export type CreateProjectInput = {
  name: string;
  description: string;
  category?: KnowledgeProjectCategory;
  status?: KnowledgeProjectStatus;
};

type ProjectsState = {
  projects: KnowledgeProject[];
  isHydrated: boolean;
  /** Loads persisted Knowledge Projects. Safe to call multiple times. */
  hydrate: () => Promise<void>;
  /** Creates a new Knowledge Project and returns its id. */
  createProject: (input: CreateProjectInput) => string;
  /** Soft-removes a project from active views. History is preserved. */
  archiveProject: (id: string) => void;
};

let draftCounter = 0;

function nextProjectId(): string {
  draftCounter += 1;
  return `project-${Date.now()}-${draftCounter}`;
}

function reportPersistenceError(action: string, error: unknown) {
  const detail = error instanceof Error ? error.message : String(error);
  // eslint-disable-next-line no-console
  console.error(`[GitaVerse] projects store failed to ${action}:`, error);
  usePersistenceStatusStore
    .getState()
    .reportError(`Couldn't save "${action}" — ${detail}. Your change may not survive a refresh.`);
}

export const useProjectsStore = create<ProjectsState>((set, get) => ({
  projects: [],
  isHydrated: false,

  hydrate: async () => {
    if (get().isHydrated) return;
    try {
      const projects = await apiGet<KnowledgeProject[]>("/api/projects");
      set({ projects, isHydrated: true });
    } catch (error) {
      reportPersistenceError("load Knowledge Projects from the workspace data file", error);
      set({ isHydrated: true });
    }
  },

  createProject: ({ name, description, category, status = "draft" }) => {
    const id = nextProjectId();
    const now = new Date().toISOString();

    const newProject: KnowledgeProject = {
      id,
      ownerId: "",
      name: name.trim(),
      description: description.trim(),
      category,
      status,
      contentCount: 0,
      createdAt: now,
      updatedAt: now,
    };

    set((state) => ({ projects: [newProject, ...state.projects] }));
    void apiPost("/api/projects", newProject).catch((error) =>
      reportPersistenceError("create project", error),
    );
    return id;
  },

  archiveProject: (id) => {
    const now = new Date().toISOString();
    set((state) => ({
      projects: state.projects.map((project) =>
        project.id === id ? { ...project, status: "archived", updatedAt: now } : project,
      ),
    }));
    void apiPatch(`/api/projects/${id}`, { status: "archived", updatedAt: now }).catch((error) =>
      reportPersistenceError("archive project", error),
    );
  },
}));
