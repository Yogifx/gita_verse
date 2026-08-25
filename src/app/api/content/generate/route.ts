import type { NextRequest } from "next/server";
import { jsonError, jsonOk } from "@/lib/api/http";
import { requireUser } from "@/server/auth/session";
import { generateContentItemFromBrief } from "@/server/content/generate-from-brief";
import { ValidationError } from "@/server/persistence/errors";

export async function POST(request: NextRequest) {
  try {
    const user = await requireUser();
    let body: { briefId?: string };
    try {
      body = (await request.json()) as { briefId?: string };
    } catch {
      throw new ValidationError("Request body must be JSON.");
    }

    const created = await generateContentItemFromBrief(user.id, body.briefId ?? "");
    return jsonOk(created, { status: 201 });
  } catch (error) {
    return jsonError(error);
  }
}
