import type { DesignGuideline } from "@/types/design-intelligence";

/**
 * Curated Design Intelligence library — visual guidance grounded in
 * docs/05_DESIGN_SYSTEM.md, and pedagogical guidance grounded in the
 * product's own philosophy (docs/09_PRODUCT_ARCHITECTURE.md §2: authenticity
 * over speed, source grounding, teaching is the product). Static reference
 * data, not AI-generated — deterministic guidance, not a model call.
 */
export const designGuidelines: DesignGuideline[] = [
  {
    id: "visual-carousel",
    format: "carousel",
    category: "visual",
    title: "Composing a Carousel",
    principle:
      "Each slide is a beat in one visual rhythm. Consistency across slides matters more than any single slide's decoration.",
    dos: [
      "Use one strong typographic hierarchy across every slide (display for the teaching, body for support text).",
      "Keep a consistent frame, margin, and accent placement so the swipe feels like one composition.",
      "Reserve gold for the single most important element per slide — the verse number, the key phrase, or the CTA.",
      "Leave generous breathing room; let the Sanskrit and translation each have their own space.",
    ],
    donts: [
      "Don't vary fonts, colors, or spacing between slides — it breaks the reading rhythm.",
      "Don't add gradients, glow, or decorative textures behind the text; let the words carry the weight.",
      "Don't cram more than one idea onto a single slide.",
    ],
  },
  {
    id: "pedagogical-carousel",
    format: "carousel",
    category: "pedagogical",
    title: "Teaching Through a Carousel",
    principle:
      "A carousel is a guided walk from question to understanding — each slide should earn the swipe to the next.",
    dos: [
      "Open with a hook slide: a question or tension the verse resolves.",
      "Ground the teaching explicitly — state the chapter and verse before or alongside the translation.",
      "Dedicate one slide solely to the key learning, stated as a plain, actionable line.",
      "Close with a short reflective prompt or next step, not just a sign-off.",
    ],
    donts: [
      "Don't bury the citation — always let the viewer trace the teaching back to its verse.",
      "Don't editorialize past what the verse and its accepted meaning support.",
    ],
  },
  {
    id: "visual-post",
    format: "post",
    category: "visual",
    title: "Composing a Single Post",
    principle:
      "A post has one shot at one frame. Every element should support a single, immediate focal point.",
    dos: [
      "Establish a clear focal hierarchy: one headline treatment, one supporting line, nothing competing for attention.",
      "Use the restrained gold accent only where the eye should land first.",
      "Make sure the core teaching is legible at thumbnail size, not just at full view.",
    ],
    donts: [
      "Don't stack multiple teachings or quotes into one frame.",
      "Don't rely on busy background imagery that fights the typography for attention.",
    ],
  },
  {
    id: "pedagogical-post",
    format: "post",
    category: "pedagogical",
    title: "Teaching Through a Single Post",
    principle:
      "A post must deliver a complete, self-contained lesson in one glance and one caption.",
    dos: [
      "Lead the caption with the takeaway, then support it with the verse and context.",
      "State the key learning as one plain sentence a reader could act on today.",
      "Name the chapter and verse so the teaching is traceable, even without the image.",
    ],
    donts: [
      "Don't leave the teaching abstract — connect it to a concrete moment the reader recognizes.",
      "Don't let the caption merely restate the image; let it add context the image can't.",
    ],
  },
  {
    id: "visual-reel",
    format: "reel",
    category: "visual",
    title: "Composing a Reel / Short",
    principle:
      "Vertical video is watched in motion, often without sound — design for glanceability and safe framing.",
    dos: [
      "Keep on-screen text inside safe zones so platform UI (captions, controls) never covers it.",
      "Use short, high-contrast text bursts synced to the spoken teaching, not dense paragraphs.",
      "Keep the accent treatment consistent with the rest of the GitaVerse visual language — gold for emphasis, nothing else competing.",
    ],
    donts: [
      "Don't rely on tiny text that only works at full brightness and full attention.",
      "Don't add decorative motion or glow effects that distract from the spoken teaching.",
    ],
  },
  {
    id: "pedagogical-reel",
    format: "reel",
    category: "pedagogical",
    title: "Teaching Through a Reel / Short",
    principle:
      "The first three seconds decide whether the teaching is heard at all — earn attention before you explain.",
    dos: [
      "Open on the tension or question, not the citation — hook first, ground second.",
      "Speak the verse's meaning in plain, modern language before quoting the Sanskrit.",
      "End on one memorable, repeatable line — the key learning stated as advice.",
    ],
    donts: [
      "Don't open with 'In chapter X, verse Y...' — it reads as a lecture, not a hook.",
      "Don't try to teach more than one idea in a short-form script.",
    ],
  },
];
