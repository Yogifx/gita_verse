import type { NextRequest } from "next/server";
import { jsonError, jsonOk } from "@/lib/api/http";
import { requireUser } from "@/server/auth/session";
import { createAsset, listAssets } from "@/server/repositories/assets.repository";
import type { Asset } from "@/types/asset";

export async function GET() {
  try {
    const user = await requireUser();
    const assets = await listAssets(user.id);
    return jsonOk(assets);
  } catch (error) {
    return jsonError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireUser();
    const input = (await request.json()) as Asset;
    const created = await createAsset({ ...input, ownerId: user.id });
    return jsonOk(created, { status: 201 });
  } catch (error) {
    return jsonError(error);
  }
}
