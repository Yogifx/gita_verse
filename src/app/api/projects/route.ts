import type { NextRequest } from "next/server";
import { jsonError, jsonOk } from "@/lib/api/http";
import { requireUser } from "@/server/auth/session";
import { createProject, listProjects } from "@/server/repositories/projects.repository";
import type { KnowledgeProject } from "@/types/project";

export async function GET() {
  try {
    const user = await requireUser();
    const projects = await listProjects(user.id);
    return jsonOk(projects);
  } catch (error) {
    return jsonError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireUser();
    const input = (await request.json()) as KnowledgeProject;
    const created = await createProject({ ...input, ownerId: user.id });
    return jsonOk(created, { status: 201 });
  } catch (error) {
    return jsonError(error);
  }
}
