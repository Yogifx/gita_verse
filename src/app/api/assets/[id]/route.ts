import type { NextRequest } from "next/server";
import { jsonError, jsonOk } from "@/lib/api/http";
import { requireUser } from "@/server/auth/session";
import { getAsset, updateAsset, type AssetPatch } from "@/server/repositories/assets.repository";

type RouteParams = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const user = await requireUser();
    const { id } = await params;
    const asset = await getAsset(id, user.id);
    return jsonOk(asset);
  } catch (error) {
    return jsonError(error);
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const user = await requireUser();
    const { id } = await params;
    const patch = (await request.json()) as AssetPatch;
    const updated = await updateAsset(id, user.id, patch);
    return jsonOk(updated);
  } catch (error) {
    return jsonError(error);
  }
}
