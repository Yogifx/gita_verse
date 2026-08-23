import type { NextRequest } from "next/server";
import { jsonError, jsonOk } from "@/lib/api/http";
import { getAsset, updateAsset, type AssetPatch } from "@/server/repositories/assets.repository";

type RouteParams = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const asset = await getAsset(id);
    return jsonOk(asset);
  } catch (error) {
    return jsonError(error);
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const patch = (await request.json()) as AssetPatch;
    const updated = await updateAsset(id, patch);
    return jsonOk(updated);
  } catch (error) {
    return jsonError(error);
  }
}
