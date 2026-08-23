import type { NextRequest } from "next/server";
import { jsonError, jsonOk } from "@/lib/api/http";
import { getSettings, updateSettings, type SettingsPatch } from "@/server/repositories/settings.repository";

export async function GET() {
  try {
    const settings = await getSettings();
    return jsonOk(settings);
  } catch (error) {
    return jsonError(error);
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const patch = (await request.json()) as SettingsPatch;
    const updated = await updateSettings(patch);
    return jsonOk(updated);
  } catch (error) {
    return jsonError(error);
  }
}
