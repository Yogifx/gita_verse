import type { VerseCitation } from "@/types/knowledge";

type VerseSourcePanelProps = {
  citation: VerseCitation;
  meaning?: string;
};

export function VerseSourcePanel({ citation, meaning }: VerseSourcePanelProps) {
  return (
    <section className="flex flex-col gap-4 rounded-panel border border-border bg-surface p-4 md:p-6">
      <div>
        <p className="text-caption font-medium text-gold">{citation.label}</p>
        <p className="mt-1 text-caption text-foreground-secondary">
          {citation.chapterNameTransliterated || citation.chapterName}
        </p>
      </div>

      <blockquote className="rounded-control border border-border bg-background px-4 py-3 font-display text-body-lg leading-relaxed text-foreground">
        {citation.sanskrit}
      </blockquote>

      {citation.transliteration ? (
        <p className="text-caption italic text-foreground-secondary">{citation.transliteration}</p>
      ) : null}

      {meaning ? (
        <div>
          <p className="text-caption font-medium text-foreground-secondary">Simplified meaning</p>
          <p className="mt-1 text-body text-foreground">{meaning}</p>
        </div>
      ) : null}

      <p className="text-small text-foreground-muted">
        Verified scripture stays in the Knowledge Layer. Generated content may cite{" "}
        {citation.label} — it must not invent or alter this verse.
      </p>
    </section>
  );
}
