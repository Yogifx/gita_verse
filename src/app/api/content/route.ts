import type { NextRequest } from "next/server";
import { jsonError, jsonOk } from "@/lib/api/http";
import { createContentItem, listContentItems } from "@/server/repositories/content.repository";
import type { ContentItem } from "@/types/content";

export async function GET() {
  try {
    const items = await listContentItems();
    return jsonOk(items);
  } catch (error) {
    return jsonError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const input = (await request.json()) as ContentItem;
    const created = await createContentItem(input);
    return jsonOk(created, { status: 201 });
  } catch (error) {
    return jsonError(error);
  }
}
