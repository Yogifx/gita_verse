import type { BriefAudience, BriefFormat, BriefTone } from "@/types/brief";

export const BRIEF_AUDIENCES: { value: BriefAudience; label: string }[] = [
  { value: "beginner", label: "Beginner" },
  { value: "spiritual_seeker", label: "Spiritual Seeker" },
  { value: "student", label: "Student" },
  { value: "working_professional", label: "Working Professional" },
  { value: "general_audience", label: "General Audience" },
];

export const BRIEF_FORMATS: { value: BriefFormat; label: string; description: string }[] = [
  { value: "reel", label: "Reel", description: "Short vertical teaching clip." },
  { value: "carousel", label: "Carousel", description: "Multi-slide swipeable teaching." },
  { value: "post", label: "Static Post", description: "Single-frame feed teaching." },
  { value: "quote", label: "Quote", description: "One-line verse-led graphic." },
  { value: "story", label: "Story", description: "Ephemeral vertical frame." },
  { value: "short_video", label: "Short Video", description: "Short-form video beyond a Reel cut." },
];

/**
 * Brief formats that already exist as ContentItem formats. Quote / Story /
 * Short Video stay on the brief until ContentItem grows those types.
 */
export const GENERATABLE_BRIEF_FORMATS: BriefFormat[] = ["reel", "carousel", "post"];

export const BRIEF_TONES: { value: BriefTone; label: string }[] = [
  { value: "simple", label: "Simple" },
  { value: "reflective", label: "Reflective" },
  { value: "practical", label: "Practical" },
  { value: "thought_provoking", label: "Thought-provoking" },
  { value: "conversational", label: "Conversational" },
];

export const BRIEF_AUDIENCE_VALUES = BRIEF_AUDIENCES.map((entry) => entry.value);
export const BRIEF_FORMAT_VALUES = BRIEF_FORMATS.map((entry) => entry.value);
export const BRIEF_TONE_VALUES = BRIEF_TONES.map((entry) => entry.value);

export function labelForAudience(value: BriefAudience): string {
  return BRIEF_AUDIENCES.find((entry) => entry.value === value)?.label ?? value;
}

export function labelForBriefFormat(value: BriefFormat): string {
  return BRIEF_FORMATS.find((entry) => entry.value === value)?.label ?? value;
}

export function labelForTone(value: BriefTone): string {
  return BRIEF_TONES.find((entry) => entry.value === value)?.label ?? value;
}
