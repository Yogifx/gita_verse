import type { ContentItem } from "@/types/content";
import type { ContentOutput } from "@/types/content-output";
import {
  captionFromOutput,
  contentSummaryFromOutput,
  hashtagsForItem,
  publishDestinationsForFormat,
} from "@/features/studio/lib/creation-status";

type PublishPrepPanelProps = {
  item: ContentItem;
  output: ContentOutput;
};

export function PublishPrepPanel({ item, output }: PublishPrepPanelProps) {
  const caption = captionFromOutput(output);
  const hashtags = hashtagsForItem(item);
  const contentSummary = contentSummaryFromOutput(output);
  const destinations = publishDestinationsForFormat(item.format);

  return (
    <section className="flex flex-col gap-4 rounded-panel border border-primary-muted bg-surface p-4 md:p-6">
      <div>
        <h2 className="font-display text-h3 text-foreground">Ready to publish</h2>
        <p className="mt-1 text-caption text-foreground-secondary">
          Platform preparation only. No social accounts are connected yet.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
        {destinations.map((destination) => (
          <article
            key={destination.platform}
            className="flex flex-col gap-3 rounded-control border border-border bg-background p-4"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-medium text-foreground">{destination.label}</p>
                <p className="mt-0.5 text-caption text-foreground-muted">{destination.format}</p>
              </div>
              <span className="rounded-full bg-success-muted px-2.5 py-1 text-small font-medium text-success">
                Ready to publish
              </span>
            </div>

            <Meta label="Content" value={contentSummary} />
            <Meta label="Caption" value={caption || "Add a title and close to form the caption."} />
            <Meta label="Hashtags" value={hashtags} />
            <Meta label="Format" value={destination.format} />
            <Meta label="Readiness" value="Approved · adapted, not posted" />
            <Meta label="Status" value="READY TO PUBLISH" />
          </article>
        ))}
      </div>
    </section>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-small font-medium text-foreground-muted">{label}</p>
      <p className="mt-1 whitespace-pre-wrap text-caption text-foreground">{value}</p>
    </div>
  );
}
