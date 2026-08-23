import type { GitaChapterRef } from "@/types/design-intelligence";

/**
 * Lightweight chapter reference used only to compute coverage insights for
 * Design Intelligence. This is intentionally minimal — it is not the
 * Gita Knowledge Layer module (docs/09_PRODUCT_ARCHITECTURE.md §4.5), which
 * will later own full verse addressing, translations, and citation lookup.
 */
export const GITA_CHAPTERS: GitaChapterRef[] = [
  { chapter: 1, title: "Arjuna Vishada Yoga", theme: "Observing the armies on the battlefield" },
  { chapter: 2, title: "Sankhya Yoga", theme: "The eternal reality of the soul" },
  { chapter: 3, title: "Karma Yoga", theme: "Action and its secret" },
  { chapter: 4, title: "Jnana Yoga", theme: "Transcendental knowledge" },
  { chapter: 5, title: "Karma Sanyasa Yoga", theme: "Action and renunciation" },
  { chapter: 6, title: "Dhyana Yoga", theme: "The practice of meditation" },
  { chapter: 7, title: "Jnana Vijnana Yoga", theme: "Knowledge of the absolute" },
  { chapter: 8, title: "Akshara Brahma Yoga", theme: "Attaining the supreme" },
  { chapter: 9, title: "Raja Vidya Guhya Yoga", theme: "The most confidential knowledge" },
  { chapter: 10, title: "Vibhuti Yoga", theme: "The opulence of the absolute" },
  { chapter: 11, title: "Vishwarupa Darshana Yoga", theme: "Vision of the universal form" },
  { chapter: 12, title: "Bhakti Yoga", theme: "The yoga of devotion" },
  { chapter: 13, title: "Kshetra Kshetragna Vibhaga Yoga", theme: "The field and its knower" },
  { chapter: 14, title: "Gunatraya Vibhaga Yoga", theme: "The three modes of material nature" },
  { chapter: 15, title: "Purushottama Yoga", theme: "The supreme divine personality" },
  { chapter: 16, title: "Daivasura Sampad Vibhaga Yoga", theme: "The divine and demoniac natures" },
  { chapter: 17, title: "Shraddhatraya Vibhaga Yoga", theme: "The divisions of faith" },
  { chapter: 18, title: "Moksha Sanyasa Yoga", theme: "The perfection of renunciation" },
];
