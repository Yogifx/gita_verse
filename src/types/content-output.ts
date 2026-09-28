/**
 * GV-015.3 Content Output Contract — structured generated representation
 * for Reel, Carousel, and Post. Canonical for future generation; not a
 * scripture store. Provenance remains ContentItem.briefId → verseId → GV-014.
 *
 * Session has no output contract. Legacy/manual items omit `output`.
 */

export type ReelScene = {
  voiceover: string;
  onScreenText: string;
  visualDirection: string;
};

export type ReelOutput = {
  format: "reel";
  hook: string;
  scenes: ReelScene[];
  closing: string;
  cta: string;
};

export type CarouselSlideRole = "cover" | "content" | "close";

export type CarouselSlide = {
  role: CarouselSlideRole;
  headline: string;
  body: string;
  visualDirection?: string;
  cta?: string;
};

export type CarouselOutput = {
  format: "carousel";
  slides: CarouselSlide[];
};

export type PostOutput = {
  format: "post";
  headline: string;
  body: string;
  cta: string;
  /** Optional structured teaching line. Existing posts may omit it. */
  keyMessage?: string;
  /** Optional single-frame art direction. Existing posts may omit it. */
  visualDirection?: string;
};

export type ContentOutput = ReelOutput | CarouselOutput | PostOutput;
