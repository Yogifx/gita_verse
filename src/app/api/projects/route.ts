import type { NextRequest } from "next/server";
import { jsonError, jsonOk } from "@/lib/api/http";
import { createProject, listProjects } from "@/server/repositories/projects.repository";
import type { KnowledgeProject } from "@/types/project";

export async function GET() {
  try {
    const projects = await listProjects();
    return jsonOk(projects);
  } catch (error) {
    return jsonError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const input = (await request.json()) as KnowledgeProject;
    const created = await createProject(input);
    return jsonOk(created, { status: 201 });
  } catch (error) {
    return jsonError(error);
  }
}
