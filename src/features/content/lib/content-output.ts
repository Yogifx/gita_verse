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

export function outputFromBrief(brief: ContentBrief, format: HostFormat): ContentOutput {
  if (format === "reel") return reelFromBrief(brief);
  if (format === "carousel") return carouselFromBrief(brief);
  if (format === "post") return postFromBrief(brief);
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
    labeledBlock("Body", output.body),
    labeledBlock("CTA", output.cta),
  ]);
}

export function audienceLineFromBrief(brief: ContentBrief): string {
  return `${labelForAudience(brief.audience)} · ${labelForTone(brief.tone)}`;
}

function reelFromBrief(brief: ContentBrief): ReelOutput {
  const scenes: ReelScene[] = [
    {
      voiceover: brief.keyMessage.trim(),
      onScreenText: brief.keyMessage.trim(),
      visualDirection: "",
    },
  ];
  if (brief.keyTeaching.trim()) {
    scenes.push({
      voiceover: brief.keyTeaching.trim(),
      onScreenText: brief.keyTeaching.trim(),
      visualDirection: "",
    });
  }
  if (brief.meaning.trim()) {
    scenes.push({
      voiceover: brief.meaning.trim(),
      onScreenText: brief.meaning.trim(),
      visualDirection: "",
    });
  }

  return {
    format: "reel",
    hook: brief.hook.trim() || brief.keyMessage.trim(),
    scenes,
    closing: brief.contentGoal.trim(),
    cta: "",
  };
}

function carouselFromBrief(brief: ContentBrief): CarouselOutput {
  const slides: CarouselSlide[] = [
    { role: "cover", headline: brief.hook.trim() || brief.keyMessage.trim(), body: "" },
    { role: "content", headline: "Key message", body: brief.keyMessage.trim() },
  ];
  if (brief.keyTeaching.trim()) {
    slides.push({
      role: "content",
      headline: "Teaching",
      body: brief.keyTeaching.trim(),
    });
  }
  slides.push({
    role: "close",
    headline: "Takeaway",
    body: brief.contentGoal.trim(),
    cta: "",
  });
  return { format: "carousel", slides };
}

function postFromBrief(brief: ContentBrief): PostOutput {
  return {
    format: "post",
    headline: brief.hook.trim() || brief.keyMessage.trim(),
    body: [brief.keyMessage.trim(), brief.meaning.trim()].filter(Boolean).join("\n\n"),
    cta: brief.contentGoal.trim(),
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
