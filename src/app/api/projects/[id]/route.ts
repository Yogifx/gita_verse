import type { NextRequest } from "next/server";
import { jsonError, jsonOk } from "@/lib/api/http";
import { requireUser } from "@/server/auth/session";
import {
  getProject,
  updateProject,
  type ProjectPatch,
} from "@/server/repositories/projects.repository";

type RouteParams = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const user = await requireUser();
    const { id } = await params;
    const project = await getProject(id, user.id);
    return jsonOk(project);
  } catch (error) {
    return jsonError(error);
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const user = await requireUser();
    const { id } = await params;
    const patch = (await request.json()) as ProjectPatch;
    const updated = await updateProject(id, user.id, patch);
    return jsonOk(updated);
  } catch (error) {
    return jsonError(error);
  }
}
