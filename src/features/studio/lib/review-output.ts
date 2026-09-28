import type { ContentItem } from "@/types/content";
import type { CarouselOutput, ContentOutput, PostOutput, ReelOutput } from "@/types/content-output";

export function outputDraftFromItem(item: ContentItem): ContentOutput | null {
  if (item.output) return cloneOutput(item.output);
  if (item.format === "reel") return fallbackReel(item);
  if (item.format === "carousel") return fallbackCarousel(item);
  if (item.format === "post") return fallbackPost(item);
  return null;
}

export function cloneOutput(output: ContentOutput): ContentOutput {
  return JSON.parse(JSON.stringify(output)) as ContentOutput;
}

export function sameOutput(a: ContentOutput, b: ContentOutput): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

export function validateOutputDraft(output: ContentOutput): string | null {
  if (output.format === "reel") {
    if (!output.hook.trim() || !output.closing.trim() || output.scenes.length === 0) {
      return "Hook, at least one scene, and closing are required.";
    }
    return null;
  }
  if (output.format === "carousel") {
    if (output.slides.length === 0) return "This carousel needs at least one slide.";
    const cover = output.slides.find((slide) => slide.role === "cover");
    if (!cover?.headline.trim() && !cover?.body.trim()) {
      return "The opening slide needs a title.";
    }
    return null;
  }
  if (!output.headline.trim() || !output.body.trim()) {
    return "Hook / title and body are required.";
  }
  return null;
}

function fallbackReel(item: ContentItem): ReelOutput {
  return {
    format: "reel",
    hook: item.keyLearning || item.title,
    scenes: [
      {
        voiceover: item.meaning || item.keyLearning,
        onScreenText: item.keyLearning || item.title,
        visualDirection: "",
      },
    ],
    closing: item.meaning,
    cta: "",
  };
}

function fallbackCarousel(item: ContentItem): CarouselOutput {
  return {
    format: "carousel",
    slides: [
      { role: "cover", headline: item.title, body: item.keyLearning, visualDirection: "" },
      { role: "content", headline: "Meaning", body: item.meaning, visualDirection: "" },
      { role: "close", headline: "Takeaway", body: item.keyLearning, cta: "", visualDirection: "" },
    ],
  };
}

function fallbackPost(item: ContentItem): PostOutput {
  return {
    format: "post",
    headline: item.title,
    keyMessage: item.keyLearning,
    body: item.meaning || item.keyLearning,
    visualDirection: "",
    cta: "",
  };
}
