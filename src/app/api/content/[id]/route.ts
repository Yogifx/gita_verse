import type { NextRequest } from "next/server";
import { jsonError, jsonOk } from "@/lib/api/http";
import { requireUser } from "@/server/auth/session";
import {
  getContentItem,
  updateContentItem,
  type ContentItemPatch,
} from "@/server/repositories/content.repository";

type RouteParams = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const user = await requireUser();
    const { id } = await params;
    const item = await getContentItem(id, user.id);
    return jsonOk(item);
  } catch (error) {
    return jsonError(error);
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const user = await requireUser();
    const { id } = await params;
    const patch = (await request.json()) as ContentItemPatch;
    const updated = await updateContentItem(id, user.id, patch);
    return jsonOk(updated);
  } catch (error) {
    return jsonError(error);
  }
}
