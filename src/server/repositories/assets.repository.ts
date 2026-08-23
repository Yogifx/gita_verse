import type { Asset } from "@/types/asset";
import { readDb, mutateDb } from "@/server/persistence/file-store";
import { DuplicateRecordError, NotFoundError, ValidationError } from "@/server/persistence/errors";

export async function listAssets(ownerId: string): Promise<Asset[]> {
  const db = await readDb();
  return db.assets.filter((entry) => entry.ownerId === ownerId);
}

export async function getAsset(id: string, ownerId: string): Promise<Asset> {
  const db = await readDb();
  const asset = db.assets.find((entry) => entry.id === id && entry.ownerId === ownerId);
  if (!asset) throw new NotFoundError("Asset", id);
  return asset;
}

/** Inserts a fully-formed asset record (id/timestamps assigned by the caller). */
export async function createAsset(input: Asset): Promise<Asset> {
  if (!input.id) throw new ValidationError("Asset id is required.");
  if (!input.ownerId) throw new ValidationError("Asset owner is required.");
  if (!input.name || !input.name.trim()) throw new ValidationError("Asset name is required.");
  if (!input.category) throw new ValidationError("Asset category is required.");

  return mutateDb((db) => {
    if (db.assets.some((entry) => entry.id === input.id)) {
      throw new DuplicateRecordError("Asset", input.id);
    }

    const record: Asset = { ...input, name: input.name.trim() };
    return { db: { ...db, assets: [record, ...db.assets] }, result: record };
  });
}

export type AssetPatch = Partial<Omit<Asset, "id" | "ownerId">> & { updatedAt: string };

export async function updateAsset(id: string, ownerId: string, patch: AssetPatch): Promise<Asset> {
  if (patch.name !== undefined && !patch.name.trim()) {
    throw new ValidationError("Asset name cannot be empty.");
  }

  return mutateDb((db) => {
    const index = db.assets.findIndex((entry) => entry.id === id && entry.ownerId === ownerId);
    if (index === -1) throw new NotFoundError("Asset", id);

    const updated: Asset = {
      ...db.assets[index],
      ...patch,
      name: patch.name !== undefined ? patch.name.trim() : db.assets[index].name,
      ownerId,
    };
    const assets = [...db.assets];
    assets[index] = updated;
    return { db: { ...db, assets }, result: updated };
  });
}

export async function archiveAsset(id: string, ownerId: string): Promise<Asset> {
  return updateAsset(id, ownerId, { status: "archived", updatedAt: new Date().toISOString() });
}
