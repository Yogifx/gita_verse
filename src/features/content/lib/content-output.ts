/**
 * GV-015.3 helpers: validate structured output, compose it from a Content Brief,
 * and project it one-way into Tiptap HTML. No reverse sync. No AI provider.
 */

import { labelForAudience, labelForTone } from "@/constants/briefs";
import { ValidationError } from "@/server/persistence/errors";
import type { ContentBrief } from "@/types/brief";
import type {
  CarouselOutput,
  CarouselSlide,
  CarouselSlideRole,
  ContentOutput,
  PostOutput,
  ReelOutput,
  ReelScene,
} from "@/types/content-output";

/** Fields the deterministic mapper reads. ContentBrief remains assignable. */
export type OutputBriefFields = Pick<
  ContentBrief,
  "hook" | "keyMessage" | "keyTeaching" | "meaning" | "contentGoal"
>;

type HostFormat = ContentOutput["format"] | "session";

const SLIDE_ROLES: CarouselSlideRole[] = ["cover", "content", "close"];

export function assertContentOutput(
  value: unknown,
  itemFormat: HostFormat,
): ContentOutput {
  if (itemFormat === "session") {
    throw new ValidationError("Session content does not use a structured output contract.");
  }
  if (!value || typeof value !== "object") {
    throw new ValidationError("Structured content output is invalid.");
  }

  const record = value as { format?: unknown };
  if (record.format !== itemFormat) {
    throw new ValidationError("Structured output format must match the ContentItem format.");
  }

  if (record.format === "reel") return assertReel(value);
  if (record.format === "carousel") return assertCarousel(value);
  if (record.format === "post") return assertPost(value);

  throw new ValidationError("Structured output is only defined for Reel, Carousel, and Post.");
}

/** Display-only citation context. Never carries Sanskrit. */
export type OutputCitationContext = {
  label?: string;
  reference?: string;
};

export function outputFromBrief(
  brief: OutputBriefFields,
  format: HostFormat,
  citation?: OutputCitationContext,
): ContentOutput {
  if (format === "reel") return reelFromBrief(brief, citation);
  if (format === "carousel") return carouselFromBrief(brief, citation);
  if (format === "post") return postFromBrief(brief, citation);
  throw new ValidationError("Structured output is only defined for Reel, Carousel, and Post.");
}

/**
 * One-way projection for the existing editor. Citation label is display-only
 * (not stored in `output`, not copied scripture).
 */
export function htmlFromContentOutput(
  output: ContentOutput,
  options?: { citationLabel?: string; audienceLine?: string },
): string {
  const lead = [
    options?.citationLabel ? `<p>${escapeHtml(options.citationLabel)}</p>` : "",
    options?.audienceLine ? `<p>${escapeHtml(options.audienceLine)}</p>` : "",
  ];

  if (output.format === "reel") {
    return joinBlocks([
      ...lead,
      labeledBlock("Hook", output.hook),
      ...output.scenes.flatMap((scene, index) => [
        `<h2>${escapeHtml(`Scene ${index + 1}`)}</h2>`,
        labeledBlock("Voiceover", scene.voiceover, 3),
        labeledBlock("On-screen text", scene.onScreenText, 3),
        labeledBlock("Visual direction", scene.visualDirection, 3),
      ]),
      labeledBlock("Closing", output.closing),
      labeledBlock("CTA", output.cta),
    ]);
  }

  if (output.format === "carousel") {
    return joinBlocks([
      ...lead,
      ...output.slides.map((slide, index) =>
        joinBlocks([
          `<h2>${escapeHtml(carouselHeading(slide.role, index))}</h2>`,
          labeledBlock("Headline", slide.headline, 3),
          labeledBlock("Body", slide.body, 3),
          labeledBlock("Visual direction", slide.visualDirection ?? "", 3),
          labeledBlock("CTA", slide.cta ?? "", 3),
        ]),
      ),
    ]);
  }

  return joinBlocks([
    ...lead,
    labeledBlock("Headline", output.headline),
    labeledBlock("Key message", output.keyMessage ?? "", 3),
    labeledBlock("Body", output.body),
    labeledBlock("Visual direction", output.visualDirection ?? "", 3),
    labeledBlock("CTA", output.cta),
  ]);
}

export function audienceLineFromBrief(brief: ContentBrief): string {
  return `${labelForAudience(brief.audience)} · ${labelForTone(brief.tone)}`;
}

function reelFromBrief(brief: OutputBriefFields, citation?: OutputCitationContext): ReelOutput {
  const hook = brief.hook.trim() || brief.keyMessage.trim();
  const keyMessage = brief.keyMessage.trim();
  const teaching = brief.keyTeaching.trim();
  const meaning = brief.meaning.trim();
  const goal = brief.contentGoal.trim();
  const verseLabel = citation?.label?.trim() || "this verse";

  const scenes: ReelScene[] = [];
  pushReelScene(scenes, {
    voiceover: keyMessage || hook,
    onScreenText: firstOnScreenLine(keyMessage || hook),
    visualDirection: `Open on a still, grounded frame. Hold ${verseLabel} as the source of the teaching. Do not display invented scripture. Soft light, unhurried pace.`,
  });
  pushReelScene(scenes, {
    voiceover: teaching,
    onScreenText: firstOnScreenLine(teaching),
    visualDirection:
      "Cut to a quiet work scene — hands at a desk, a path being walked, or a simple daily task. Keep motion simple so the teaching can land.",
  });
  pushReelScene(scenes, {
    voiceover: meaning,
    onScreenText: firstOnScreenLine(meaning),
    visualDirection:
      "Return to a close portrait or contemplative landscape. On-screen text stays short. Speak the simplified meaning; do not rewrite the verse.",
  });
  pushReelScene(scenes, {
    voiceover: goal,
    onScreenText: firstOnScreenLine(goal),
    visualDirection: "Hold a final still. Give the viewer one breath before the close.",
  });

  if (scenes.length === 0) {
    scenes.push({
      voiceover: hook,
      onScreenText: firstOnScreenLine(hook),
      visualDirection: `A single still frame grounded in ${verseLabel}.`,
    });
  }

  return {
    format: "reel",
    hook,
    scenes,
    closing: goal || teaching || meaning || hook,
    cta: `Save this teaching from ${verseLabel}. Return to the work in front of you.`,
  };
}

function pushReelScene(scenes: ReelScene[], scene: ReelScene): void {
  const voiceover = scene.voiceover.trim();
  if (!voiceover) return;
  if (scenes.some((entry) => entry.voiceover.trim() === voiceover)) return;
  scenes.push({
    voiceover,
    onScreenText: scene.onScreenText.trim() || firstOnScreenLine(voiceover),
    visualDirection: scene.visualDirection.trim(),
  });
}

function firstOnScreenLine(value: string, max = 86): string {
  const line = value.trim().split(/\n/)[0] ?? "";
  if (line.length <= max) return line;
  return `${line.slice(0, max - 1).trim()}…`;
}

function carouselFromBrief(
  brief: OutputBriefFields,
  citation?: OutputCitationContext,
): CarouselOutput {
  const hook = brief.hook.trim() || brief.keyMessage.trim();
  const keyMessage = brief.keyMessage.trim();
  const teaching = brief.keyTeaching.trim();
  const meaning = brief.meaning.trim();
  const goal = brief.contentGoal.trim();
  const verseLabel = citation?.label?.trim() || "this verse";

  const slides: CarouselSlide[] = [
    {
      role: "cover",
      headline: hook,
      body: verseLabel,
      visualDirection: `Opening title card. Large type, quiet background. Cite ${verseLabel} without inventing scripture.`,
    },
  ];
  pushCarouselSlide(slides, {
    role: "content",
    headline: "Key message",
    body: keyMessage,
    visualDirection: "A single teaching line on a still frame. Generous margins, unhurried read.",
  });
  pushCarouselSlide(slides, {
    role: "content",
    headline: "Teaching",
    body: teaching,
    visualDirection: "Keep the type hierarchy simple. One idea per slide.",
  });
  pushCarouselSlide(slides, {
    role: "content",
    headline: "Meaning",
    body: meaning,
    visualDirection: "Softer light. Let the simplified meaning sit without decorative ornament.",
  });
  slides.push({
    role: "close",
    headline: "Takeaway",
    body: goal || teaching || meaning || hook,
    visualDirection: "Final still. Leave space for the CTA.",
    cta: `Save this teaching from ${verseLabel}. Return to the work in front of you.`,
  });
  return { format: "carousel", slides };
}

function pushCarouselSlide(slides: CarouselSlide[], slide: CarouselSlide): void {
  const body = slide.body.trim();
  if (!body) return;
  if (slides.some((entry) => entry.body.trim() === body)) return;
  slides.push({
    ...slide,
    headline: slide.headline.trim(),
    body,
    visualDirection: slide.visualDirection?.trim() || undefined,
    cta: slide.cta?.trim() || undefined,
  });
}

function postFromBrief(brief: OutputBriefFields, citation?: OutputCitationContext): PostOutput {
  const hook = brief.hook.trim() || brief.keyMessage.trim();
  const keyMessage = brief.keyMessage.trim() || brief.keyTeaching.trim();
  const meaning = brief.meaning.trim();
  const goal = brief.contentGoal.trim();
  const verseLabel = citation?.label?.trim() || "this verse";

  return {
    format: "post",
    headline: hook,
    keyMessage,
    body: [keyMessage, meaning].filter(Boolean).join("\n\n"),
    visualDirection: `Single-frame feed teaching. Center the hook. Hold ${verseLabel} as a quiet citation, not as invented scripture.`,
    cta: goal || `Sit with this teaching from ${verseLabel}, then return to the work in front of you.`,
  };
}

function assertReel(value: object): ReelOutput {
  const record = value as Partial<ReelOutput>;
  if (!Array.isArray(record.scenes) || record.scenes.length === 0) {
    throw new ValidationError("Reel output needs at least one scene.");
  }
  return {
    format: "reel",
    hook: requiredString(record.hook, "Reel hook"),
    scenes: record.scenes.map((scene, index) => assertScene(scene, index)),
    closing: requiredString(record.closing, "Reel closing"),
    cta: requiredString(record.cta, "Reel CTA", true),
  };
}

function assertScene(value: unknown, index: number): ReelScene {
  if (!value || typeof value !== "object") {
    throw new ValidationError(`Reel scene ${index + 1} is invalid.`);
  }
  const scene = value as Partial<ReelScene>;
  return {
    voiceover: requiredString(scene.voiceover, `Reel scene ${index + 1} voiceover`, true),
    onScreenText: requiredString(scene.onScreenText, `Reel scene ${index + 1} on-screen text`, true),
    visualDirection: requiredString(
      scene.visualDirection,
      `Reel scene ${index + 1} visual direction`,
      true,
    ),
  };
}

function assertCarousel(value: object): CarouselOutput {
  const record = value as Partial<CarouselOutput>;
  if (!Array.isArray(record.slides) || record.slides.length === 0) {
    throw new ValidationError("Carousel output needs at least one slide.");
  }
  return {
    format: "carousel",
    slides: record.slides.map((slide, index) => assertSlide(slide, index)),
  };
}

function assertSlide(value: unknown, index: number): CarouselSlide {
  if (!value || typeof value !== "object") {
    throw new ValidationError(`Carousel slide ${index + 1} is invalid.`);
  }
  const slide = value as Partial<CarouselSlide>;
  if (!slide.role || !SLIDE_ROLES.includes(slide.role)) {
    throw new ValidationError(`Carousel slide ${index + 1} needs a role of cover, content, or close.`);
  }
  return {
    role: slide.role,
    headline: requiredString(slide.headline, `Carousel slide ${index + 1} headline`, true),
    body: requiredString(slide.body, `Carousel slide ${index + 1} body`, true),
    visualDirection:
      slide.visualDirection === undefined
        ? undefined
        : requiredString(slide.visualDirection, `Carousel slide ${index + 1} visual direction`, true),
    cta:
      slide.cta === undefined
        ? undefined
        : requiredString(slide.cta, `Carousel slide ${index + 1} CTA`, true),
  };
}

function assertPost(value: object): PostOutput {
  const record = value as Partial<PostOutput>;
  return {
    format: "post",
    headline: requiredString(record.headline, "Post headline"),
    body: requiredString(record.body, "Post body"),
    cta: requiredString(record.cta, "Post CTA", true),
    keyMessage:
      record.keyMessage === undefined
        ? undefined
        : requiredString(record.keyMessage, "Post key message", true),
    visualDirection:
      record.visualDirection === undefined
        ? undefined
        : requiredString(record.visualDirection, "Post visual direction", true),
  };
}

function requiredString(value: unknown, label: string, allowEmpty = false): string {
  if (typeof value !== "string") throw new ValidationError(`${label} is required.`);
  const trimmed = value.trim();
  if (!allowEmpty && !trimmed) throw new ValidationError(`${label} is required.`);
  return allowEmpty ? value : trimmed;
}

function carouselHeading(role: CarouselSlideRole, index: number): string {
  if (role === "cover") return "Cover";
  if (role === "close") return "Close";
  return `Slide ${index + 1}`;
}

function labeledBlock(label: string, value: string, heading: 2 | 3 = 2): string {
  const trimmed = value.trim();
  if (!trimmed) return "";
  const tag = heading === 3 ? "h3" : "h2";
  const paragraphs = trimmed
    .split(/\n+/)
    .map((line) => `<p>${escapeHtml(line.trim())}</p>`)
    .join("");
  return `<${tag}>${escapeHtml(label)}</${tag}>${paragraphs}`;
}

function joinBlocks(blocks: string[]): string {
  return blocks.filter(Boolean).join("") || "<p></p>";
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
