import type { ContentFormat, ContentItem, ContentStatus, Platform } from "@/types/content";
import type { ContentOutput } from "@/types/content-output";

export const CREATION_JOURNEY_STEPS = [
  { id: "verse", label: "Verse" },
  { id: "create", label: "Create" },
  { id: "generate", label: "Generate" },
  { id: "review", label: "Review" },
  { id: "approve", label: "Approve" },
  { id: "publish", label: "Ready to publish" },
] as const;

export type CreationJourneyStepId = (typeof CREATION_JOURNEY_STEPS)[number]["id"];

export const REVIEW_STATUS_STEPS = [
  { id: "draft", label: "Draft" },
  { id: "in_review", label: "In Review" },
  { id: "approved", label: "Approved" },
] as const;

export type ReviewStatusStepId = (typeof REVIEW_STATUS_STEPS)[number]["id"];

export function reviewStatusStep(status: ContentStatus): ReviewStatusStepId {
  if (status === "approved" || status === "scheduled" || status === "published") {
    return "approved";
  }
  if (status === "in_review") return "in_review";
  return "draft";
}

export const DEFAULT_PUBLISH_PLATFORMS: Platform[] = [
  "instagram",
  "youtube_shorts",
  "facebook",
];

export function publishDestinationsForFormat(format: ContentFormat): {
  platform: Platform;
  label: string;
  format: string;
}[] {
  if (format === "carousel") {
    return [
      { platform: "instagram", label: "Instagram Carousel", format: "Multi-slide · 4:5" },
      { platform: "youtube_shorts", label: "YouTube Shorts", format: "Vertical stills · 9:16" },
      { platform: "facebook", label: "Facebook Carousel", format: "Multi-slide feed" },
    ];
  }
  if (format === "post") {
    return [
      { platform: "instagram", label: "Instagram Post", format: "Single frame · 4:5" },
      { platform: "youtube_shorts", label: "YouTube Shorts", format: "Vertical still · 9:16" },
      { platform: "facebook", label: "Facebook Post", format: "Single-frame feed" },
    ];
  }
  return [
    { platform: "instagram", label: "Instagram Reel", format: "Vertical Reel · 9:16" },
    { platform: "youtube_shorts", label: "YouTube Short", format: "Vertical Short · 9:16" },
    { platform: "facebook", label: "Facebook Reel", format: "Vertical Reel · 9:16" },
  ];
}

export const PUBLISH_PREP_DESTINATIONS = publishDestinationsForFormat("reel");

export function captionFromOutput(output: ContentOutput): string {
  if (output.format === "reel") {
    return [output.hook.trim(), output.closing.trim()].filter(Boolean).join("\n\n");
  }
  if (output.format === "carousel") {
    const cover = output.slides.find((slide) => slide.role === "cover");
    const close = output.slides.find((slide) => slide.role === "close");
    return [cover?.headline.trim() || cover?.body.trim(), close?.cta?.trim() || close?.body.trim()]
      .filter(Boolean)
      .join("\n\n");
  }
  return [output.headline.trim(), output.body.trim()].filter(Boolean).join("\n\n");
}

export function contentSummaryFromOutput(output: ContentOutput): string {
  if (output.format === "reel") {
    return [output.hook, `${output.scenes.length} scenes`, output.cta].filter(Boolean).join(" · ");
  }
  if (output.format === "carousel") {
    return [output.slides[0]?.headline, `${output.slides.length} slides`].filter(Boolean).join(" · ");
  }
  return [output.headline, output.cta].filter(Boolean).join(" · ");
}

export function hashtagsForItem(item: ContentItem): string {
  const tags = ["#BhagavadGita", "#GitaVerse"];
  if (item.reference.chapter === 2 && item.reference.verseLabel === "47") {
    tags.splice(1, 0, "#KarmaYoga");
  }
  return tags.join(" ");
}

export function captionFromReel(output: Extract<ContentOutput, { format: "reel" }>): string {
  return captionFromOutput(output);
}

export function hashtagsForReel(item: ContentItem): string {
  return hashtagsForItem(item);
}

export function mergePublishPlatforms(platforms: Platform[]): Platform[] {
  const next = [...platforms];
  for (const platform of DEFAULT_PUBLISH_PLATFORMS) {
    if (!next.includes(platform)) next.push(platform);
  }
  return next;
}

export function formatReviewLabel(format: ContentFormat): string {
  if (format === "carousel") return "Carousel";
  if (format === "post") return "Post";
  if (format === "reel") return "Reel";
  return "piece";
}
