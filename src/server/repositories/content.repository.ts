import type { ContentItem, Platform } from "@/types/content";
import { readDb, mutateDb } from "@/server/persistence/file-store";
import { DuplicateRecordError, NotFoundError, ValidationError } from "@/server/persistence/errors";

export async function listContentItems(ownerId: string): Promise<ContentItem[]> {
  const db = await readDb();
  return db.contentItems.filter((entry) => entry.ownerId === ownerId);
}

export async function getContentItem(id: string, ownerId: string): Promise<ContentItem> {
  const db = await readDb();
  const item = db.contentItems.find((entry) => entry.id === id && entry.ownerId === ownerId);
  if (!item) throw new NotFoundError("ContentItem", id);
  return item;
}

/** Inserts a fully-formed content item record (id/timestamps assigned by the caller). */
export async function createContentItem(input: ContentItem): Promise<ContentItem> {
  if (!input.id) throw new ValidationError("Content item id is required.");
  if (!input.ownerId) throw new ValidationError("Content owner is required.");
  if (!input.title || !input.title.trim()) {
    throw new ValidationError("Content item title is required.");
  }

  return mutateDb((db) => {
    if (db.contentItems.some((entry) => entry.id === input.id)) {
      throw new DuplicateRecordError("ContentItem", input.id);
    }

    const record: ContentItem = { ...input, title: input.title.trim() };
    return { db: { ...db, contentItems: [record, ...db.contentItems] }, result: record };
  });
}

export type ContentItemPatch = Partial<Omit<ContentItem, "id" | "ownerId">> & { updatedAt: string };

export async function updateContentItem(
  id: string,
  ownerId: string,
  patch: ContentItemPatch,
): Promise<ContentItem> {
  return mutateDb((db) => {
    const index = db.contentItems.findIndex((entry) => entry.id === id && entry.ownerId === ownerId);
    if (index === -1) throw new NotFoundError("ContentItem", id);

    const updated: ContentItem = { ...db.contentItems[index], ...patch, ownerId };
    const contentItems = [...db.contentItems];
    contentItems[index] = updated;
    return { db: { ...db, contentItems }, result: updated };
  });
}

export async function archiveContentItem(id: string, ownerId: string): Promise<ContentItem> {
  return updateContentItem(id, ownerId, { archived: true, updatedAt: new Date().toISOString() });
}

export async function toggleContentItemPlatform(
  id: string,
  ownerId: string,
  platform: Platform,
): Promise<ContentItem> {
  return mutateDb((db) => {
    const index = db.contentItems.findIndex((entry) => entry.id === id && entry.ownerId === ownerId);
    if (index === -1) throw new NotFoundError("ContentItem", id);

    const current = db.contentItems[index];
    const has = current.platforms.includes(platform);
    const updated: ContentItem = {
      ...current,
      platforms: has
        ? current.platforms.filter((p) => p !== platform)
        : [...current.platforms, platform],
      updatedAt: new Date().toISOString(),
    };
    const contentItems = [...db.contentItems];
    contentItems[index] = updated;
    return { db: { ...db, contentItems }, result: updated };
  });
}
