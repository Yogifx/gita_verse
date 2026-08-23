"use client";

import { create } from "zustand";
import type { KnowledgeProject, KnowledgeProjectCategory, KnowledgeProjectStatus } from "@/types/project";
import { seedKnowledgeProjects } from "@/features/projects/data/seed";

export type CreateProjectInput = {
  name: string;
  description: string;
  category?: KnowledgeProjectCategory;
  status?: KnowledgeProjectStatus;
};

type ProjectsState = {
  projects: KnowledgeProject[];
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

export const useProjectsStore = create<ProjectsState>((set) => ({
  projects: seedKnowledgeProjects,

  createProject: ({ name, description, category, status = "draft" }) => {
    const id = nextProjectId();
    const now = new Date().toISOString();

    const newProject: KnowledgeProject = {
      id,
      name: name.trim(),
      description: description.trim(),
      category,
      status,
      contentCount: 0,
      createdAt: now,
      updatedAt: now,
    };

    set((state) => ({ projects: [newProject, ...state.projects] }));
    return id;
  },

  archiveProject: (id) => {
    const now = new Date().toISOString();
    set((state) => ({
      projects: state.projects.map((project) =>
        project.id === id ? { ...project, status: "archived", updatedAt: now } : project,
      ),
    }));
  },
}));
