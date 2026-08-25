/**
 * Chapter titles used by the Creative Workspace scripture metadata fields.
 * Full verse addressing belongs to the Gita Knowledge Layer (later milestone).
 */
export const WORKSPACE_CHAPTERS: { chapter: number; title: string }[] = [
  { chapter: 1, title: "Arjuna Vishada Yoga" },
  { chapter: 2, title: "Sankhya Yoga" },
  { chapter: 3, title: "Karma Yoga" },
  { chapter: 4, title: "Jnana Yoga" },
  { chapter: 5, title: "Karma Sanyasa Yoga" },
  { chapter: 6, title: "Dhyana Yoga" },
  { chapter: 7, title: "Jnana Vijnana Yoga" },
  { chapter: 8, title: "Akshara Brahma Yoga" },
  { chapter: 9, title: "Raja Vidya Guhya Yoga" },
  { chapter: 10, title: "Vibhuti Yoga" },
  { chapter: 11, title: "Vishwarupa Darshana Yoga" },
  { chapter: 12, title: "Bhakti Yoga" },
  { chapter: 13, title: "Kshetra Kshetragna Vibhaga Yoga" },
  { chapter: 14, title: "Gunatraya Vibhaga Yoga" },
  { chapter: 15, title: "Purushottama Yoga" },
  { chapter: 16, title: "Daivasura Sampad Vibhaga Yoga" },
  { chapter: 17, title: "Shraddhatraya Vibhaga Yoga" },
  { chapter: 18, title: "Moksha Sanyasa Yoga" },
];

export function chapterTitleFor(chapter: number): string {
  return WORKSPACE_CHAPTERS.find((entry) => entry.chapter === chapter)?.title ?? "";
}
