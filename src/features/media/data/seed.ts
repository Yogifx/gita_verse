import type { Asset } from "@/types/asset";

const HOUR = 60 * 60 * 1000;
const DAY = 24 * HOUR;

function ago(ms: number): string {
  return new Date(Date.now() - ms).toISOString();
}

/**
 * A small, realistic starting set of reusable GitaVerse creative assets.
 * Structured to match the shape a future object-storage/CDN layer would
 * return — replacing this module is the only change needed to go live.
 */
export const seedAssets: Omit<Asset, "ownerId">[] = [
  {
    id: "a1",
    name: "Krishna Meditation Background",
    type: "jpg",
    category: "backgrounds",
    tags: ["krishna", "meditation", "background"],
    dimensions: { width: 1920, height: 1080 },
    size: 2_400_000,
    previewTone: "indigo",
    createdAt: ago(40 * DAY),
    updatedAt: ago(6 * DAY),
    status: "active",
  },
  {
    id: "a2",
    name: "Temple Texture",
    type: "jpg",
    category: "images",
    tags: ["temple", "texture", "stone"],
    dimensions: { width: 2400, height: 1600 },
    size: 3_100_000,
    previewTone: "gold",
    createdAt: ago(35 * DAY),
    updatedAt: ago(12 * DAY),
    status: "active",
  },
  {
    id: "a3",
    name: "Golden Paper Texture",
    type: "png",
    category: "backgrounds",
    tags: ["texture", "paper", "gold"],
    dimensions: { width: 1600, height: 1600 },
    size: 1_800_000,
    previewTone: "indigo",
    createdAt: ago(28 * DAY),
    updatedAt: ago(28 * DAY),
    status: "active",
  },
  {
    id: "a4",
    name: "GitaVerse Logo",
    type: "svg",
    category: "brand",
    tags: ["logo", "brand", "wordmark"],
    size: 24_000,
    previewTone: "gold",
    createdAt: ago(60 * DAY),
    updatedAt: ago(3 * DAY),
    status: "active",
  },
  {
    id: "a5",
    name: "Devanagari Background",
    type: "png",
    category: "backgrounds",
    tags: ["devanagari", "script", "background"],
    dimensions: { width: 1920, height: 1200 },
    size: 2_100_000,
    previewTone: "indigo",
    createdAt: ago(20 * DAY),
    updatedAt: ago(20 * DAY),
    status: "active",
  },
  {
    id: "a6",
    name: "Minimal Dharma Background",
    type: "png",
    category: "backgrounds",
    tags: ["dharma", "minimal", "background"],
    dimensions: { width: 1920, height: 1080 },
    size: 1_500_000,
    previewTone: "indigo",
    createdAt: ago(15 * DAY),
    updatedAt: ago(2 * DAY),
    status: "active",
  },
  {
    id: "a7",
    name: "Lotus Illustration",
    type: "svg",
    category: "illustrations",
    tags: ["lotus", "illustration", "line-art"],
    dimensions: { width: 800, height: 800 },
    size: 68_000,
    previewTone: "success",
    createdAt: ago(9 * DAY),
    updatedAt: ago(9 * DAY),
    status: "active",
  },
];
