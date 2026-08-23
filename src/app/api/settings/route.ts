import type { NextRequest } from "next/server";
import { jsonError, jsonOk } from "@/lib/api/http";
import { requireUser } from "@/server/auth/session";
import { getSettings, updateSettings, type SettingsPatch } from "@/server/repositories/settings.repository";

export async function GET() {
  try {
    const user = await requireUser();
    const settings = await getSettings(user.id);
    return jsonOk(settings);
  } catch (error) {
    return jsonError(error);
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const user = await requireUser();
    const patch = (await request.json()) as SettingsPatch;
    const updated = await updateSettings(user.id, patch);
    return jsonOk(updated);
  } catch (error) {
    return jsonError(error);
  }
}
