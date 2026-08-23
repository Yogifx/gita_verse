import type { NextRequest } from "next/server";
import { jsonError, jsonOk } from "@/lib/api/http";
import { requireUser } from "@/server/auth/session";
import { createContentItem, listContentItems } from "@/server/repositories/content.repository";
import type { ContentItem } from "@/types/content";

export async function GET() {
  try {
    const user = await requireUser();
    const items = await listContentItems(user.id);
    return jsonOk(items);
  } catch (error) {
    return jsonError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireUser();
    const input = (await request.json()) as ContentItem;
    const created = await createContentItem({ ...input, ownerId: user.id });
    return jsonOk(created, { status: 201 });
  } catch (error) {
    return jsonError(error);
  }
}
