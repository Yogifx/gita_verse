import type { NextRequest } from "next/server";
import { jsonError, jsonOk } from "@/lib/api/http";
import { requireUser } from "@/server/auth/session";
import {
  getContentBrief,
  updateContentBrief,
  type ContentBriefPatch,
} from "@/server/repositories/briefs.repository";

type RouteParams = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const user = await requireUser();
    const { id } = await params;
    const brief = await getContentBrief(id, user.id);
    return jsonOk(brief);
  } catch (error) {
    return jsonError(error);
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const user = await requireUser();
    const { id } = await params;
    const patch = (await request.json()) as ContentBriefPatch;
    const updated = await updateContentBrief(id, user.id, patch);
    return jsonOk(updated);
  } catch (error) {
    return jsonError(error);
  }
}
