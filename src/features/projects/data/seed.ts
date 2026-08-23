import type { KnowledgeProject } from "@/types/project";

const HOUR = 60 * 60 * 1000;
const DAY = 24 * HOUR;

function ago(ms: number): string {
  return new Date(Date.now() - ms).toISOString();
}

/**
 * Realistic starting Knowledge Projects so the module is immediately
 * testable. Structured to match the shape a future projects API/database
 * would return — replacing this module is the only change needed to go live.
 */
export const seedKnowledgeProjects: KnowledgeProject[] = [
  {
    id: "p1",
    name: "Bhagavad Gita Core Teachings",
    description:
      "A foundational study series covering the central teachings of all 18 chapters, written for first-time learners.",
    category: "study_series",
    status: "active",
    contentCount: 12,
    createdAt: ago(30 * DAY),
    updatedAt: ago(2 * HOUR),
  },
  {
    id: "p2",
    name: "Karma Yoga",
    description:
      "A focused curriculum on the path of selfless action — drawn primarily from Chapter 2 and Chapter 3.",
    category: "curriculum",
    status: "in_review",
    contentCount: 6,
    createdAt: ago(14 * DAY),
    updatedAt: ago(1 * DAY),
  },
  {
    id: "p3",
    name: "Daily GitaVerse Content",
    description:
      "The ongoing knowledge base behind our daily social content — one verse, one lesson, every day.",
    category: "content_series",
    status: "active",
    contentCount: 21,
    createdAt: ago(60 * DAY),
    updatedAt: ago(3 * HOUR),
  },
];
