import type { NextRequest } from "next/server";
import { jsonError, jsonOk } from "@/lib/api/http";
import { requireUser } from "@/server/auth/session";
import { createContentBrief, listContentBriefs } from "@/server/repositories/briefs.repository";
import type { ContentBrief } from "@/types/brief";

export async function GET() {
  try {
    const user = await requireUser();
    const briefs = await listContentBriefs(user.id);
    return jsonOk(briefs);
  } catch (error) {
    return jsonError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireUser();
    const input = (await request.json()) as ContentBrief;
    const created = await createContentBrief({ ...input, ownerId: user.id });
    return jsonOk(created, { status: 201 });
  } catch (error) {
    return jsonError(error);
  }
}
