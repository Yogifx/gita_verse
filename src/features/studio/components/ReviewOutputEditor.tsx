import { ReviewField } from "@/features/studio/components/ReviewField";
import type {
  CarouselOutput,
  CarouselSlide,
  ContentOutput,
  PostOutput,
  ReelOutput,
  ReelScene,
} from "@/types/content-output";

type ReviewOutputEditorProps = {
  output: ContentOutput;
  onChange: (output: ContentOutput) => void;
};

export function ReviewOutputEditor({ output, onChange }: ReviewOutputEditorProps) {
  if (output.format === "reel") {
    return <ReelEditor output={output} onChange={onChange} />;
  }
  if (output.format === "carousel") {
    return <CarouselEditor output={output} onChange={onChange} />;
  }
  return <PostEditor output={output} onChange={onChange} />;
}

function ReelEditor({
  output,
  onChange,
}: {
  output: ReelOutput;
  onChange: (output: ReelOutput) => void;
}) {
  function updateScene(index: number, patch: Partial<ReelScene>) {
    onChange({
      ...output,
      scenes: output.scenes.map((scene, sceneIndex) =>
        sceneIndex === index ? { ...scene, ...patch } : scene,
      ),
    });
  }

  return (
    <>
      <ReviewField
        label="Hook"
        value={output.hook}
        onChange={(hook) => onChange({ ...output, hook })}
      />
      {output.scenes.map((scene, index) => (
        <div key={`scene-${index}`} className="flex flex-col gap-3 rounded-control border border-border bg-background p-4">
          <h2 className="font-display text-h3 text-foreground">Scene {index + 1}</h2>
          <ReviewField
            label="On-screen text"
            value={scene.onScreenText}
            rows={2}
            onChange={(onScreenText) => updateScene(index, { onScreenText })}
          />
          <ReviewField
            label="Voiceover"
            value={scene.voiceover}
            onChange={(voiceover) => updateScene(index, { voiceover })}
          />
          <ReviewField
            label="Visual direction"
            value={scene.visualDirection}
            onChange={(visualDirection) => updateScene(index, { visualDirection })}
          />
        </div>
      ))}
      <ReviewField
        label="Closing"
        value={output.closing}
        onChange={(closing) => onChange({ ...output, closing })}
      />
      <ReviewField
        label="CTA"
        value={output.cta}
        rows={2}
        onChange={(cta) => onChange({ ...output, cta })}
      />
    </>
  );
}

function CarouselEditor({
  output,
  onChange,
}: {
  output: CarouselOutput;
  onChange: (output: CarouselOutput) => void;
}) {
  function updateSlide(index: number, patch: Partial<CarouselSlide>) {
    onChange({
      ...output,
      slides: output.slides.map((slide, slideIndex) =>
        slideIndex === index ? { ...slide, ...patch } : slide,
      ),
    });
  }

  return (
    <>
      {output.slides.map((slide, index) => (
        <div key={`slide-${index}`} className="flex flex-col gap-3 rounded-control border border-border bg-background p-4">
          <h2 className="font-display text-h3 text-foreground">{slideHeading(slide.role, index)}</h2>
          <ReviewField
            label={slide.role === "cover" ? "Opening / title" : "Slide text"}
            value={slide.headline}
            rows={2}
            onChange={(headline) => updateSlide(index, { headline })}
          />
          <ReviewField
            label={slide.role === "cover" ? "Supporting line" : slide.role === "close" ? "Closing" : "Body"}
            value={slide.body}
            onChange={(body) => updateSlide(index, { body })}
          />
          <ReviewField
            label="Visual direction"
            value={slide.visualDirection ?? ""}
            onChange={(visualDirection) => updateSlide(index, { visualDirection })}
          />
          {slide.role === "close" ? (
            <ReviewField
              label="CTA"
              value={slide.cta ?? ""}
              rows={2}
              onChange={(cta) => updateSlide(index, { cta })}
            />
          ) : null}
        </div>
      ))}
    </>
  );
}

function PostEditor({
  output,
  onChange,
}: {
  output: PostOutput;
  onChange: (output: PostOutput) => void;
}) {
  return (
    <>
      <ReviewField
        label="Hook / title"
        value={output.headline}
        rows={2}
        onChange={(headline) => onChange({ ...output, headline })}
      />
      <ReviewField
        label="Key message"
        value={output.keyMessage ?? ""}
        rows={2}
        onChange={(keyMessage) => onChange({ ...output, keyMessage })}
      />
      <ReviewField
        label="Body / caption"
        value={output.body}
        rows={6}
        onChange={(body) => onChange({ ...output, body })}
      />
      <ReviewField
        label="Visual direction"
        value={output.visualDirection ?? ""}
        onChange={(visualDirection) => onChange({ ...output, visualDirection })}
      />
      <ReviewField
        label="CTA"
        value={output.cta}
        rows={2}
        onChange={(cta) => onChange({ ...output, cta })}
      />
    </>
  );
}

function slideHeading(role: CarouselSlide["role"], index: number): string {
  if (role === "cover") return "Opening";
  if (role === "close") return "Closing";
  return `Slide ${index + 1}`;
}
