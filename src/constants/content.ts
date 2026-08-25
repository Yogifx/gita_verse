import type { LucideIcon } from "lucide-react";
import {
  Clapperboard,
  GalleryHorizontal,
  Image as ImageIcon,
  Presentation,
} from "lucide-react";
import type {
  ContentFormat,
  ContentStatus,
  Platform,
  PipelineStage,
} from "@/types/content";

export type StatusTone = "neutral" | "info" | "warning" | "success";

export const STATUS_META: Record<
  ContentStatus,
  { label: string; tone: StatusTone }
> = {
  draft: { label: "Draft", tone: "neutral" },
  ai_generated: { label: "AI Generated", tone: "info" },
  in_review: { label: "In Review", tone: "warning" },
  approved: { label: "Approved", tone: "success" },
  scheduled: { label: "Scheduled", tone: "info" },
  published: { label: "Published", tone: "success" },
};

export const CONTENT_FORMAT_META: Record<
  ContentFormat,
  { label: string; icon: LucideIcon; description: string }
> = {
  carousel: {
    label: "Carousel",
    icon: GalleryHorizontal,
    description: "Multi-slide swipeable teachings for Instagram & LinkedIn.",
  },
  post: {
    label: "Post",
    icon: ImageIcon,
    description: "Single-frame teachings for the feed and LinkedIn.",
  },
  reel: {
    label: "Reel / Short",
    icon: Clapperboard,
    description: "Vertical video for Reels, Shorts & Stories.",
  },
  session: {
    label: "Session",
    icon: Presentation,
    description: "Long-form teaching session for a class, workshop, or study group.",
  },
};

export const CONTENT_FORMATS: ContentFormat[] = ["carousel", "post", "reel", "session"];

export const PLATFORM_META: Record<Platform, { label: string }> = {
  instagram: { label: "Instagram" },
  facebook: { label: "Facebook" },
  linkedin: { label: "LinkedIn" },
  youtube_shorts: { label: "YouTube Shorts" },
};

export const PIPELINE_STAGES: { stage: PipelineStage; label: string }[] = [
  { stage: "idea", label: "Idea" },
  { stage: "research", label: "Research" },
  { stage: "script", label: "Script" },
  { stage: "design", label: "Design" },
  { stage: "review", label: "Review" },
  { stage: "approved", label: "Approved" },
  { stage: "scheduled", label: "Scheduled" },
  { stage: "published", label: "Published" },
];

/** Statuses that represent content actively awaiting the creative reviewer. */
export const REVIEW_QUEUE_STATUSES: ContentStatus[] = ["ai_generated", "in_review"];

export const PLATFORMS: Platform[] = ["instagram", "facebook", "linkedin", "youtube_shorts"];

/** A Content Library filter matches either a format or a status. */
export type ContentFilterKey = "all" | ContentFormat | ContentStatus;

/** Filter chips for the Content Library — order matches the product spec. */
export const CONTENT_LIBRARY_FILTERS: { key: ContentFilterKey; label: string }[] = [
  { key: "all", label: "All" },
  { key: "carousel", label: "Carousel" },
  { key: "post", label: "Post" },
  { key: "reel", label: "Reel / Short" },
  { key: "session", label: "Session" },
  { key: "draft", label: "Draft" },
  { key: "in_review", label: "In Review" },
  { key: "approved", label: "Approved" },
  { key: "scheduled", label: "Scheduled" },
  { key: "published", label: "Published" },
];
