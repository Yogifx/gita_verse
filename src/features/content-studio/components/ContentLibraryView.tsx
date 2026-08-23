"use client";

import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { useContentStore } from "@/features/content/store/use-content-store";
import {
  filterContentItems,
  getActiveItems,
  searchContentItems,
} from "@/features/content/lib/selectors";
import { CONTENT_LIBRARY_FILTERS, type ContentFilterKey } from "@/constants/content";
import { ContentSearchBar } from "@/features/content-studio/components/ContentSearchBar";
import { ContentFilterBar } from "@/features/content-studio/components/ContentFilterBar";
import { ContentCard } from "@/features/content-studio/components/ContentCard";
import { CreateContentDialog } from "@/features/content-studio/components/CreateContentDialog";

export function ContentLibraryView() {
  const items = useContentStore((s) => s.items);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<ContentFilterKey>("all");
  const [createOpen, setCreateOpen] = useState(false);

  const searched = useMemo(
    () => searchContentItems(getActiveItems(items), query),
    [items, query],
  );

  const counts = useMemo(() => {
    const result: Record<string, number> = {};
    for (const filterOption of CONTENT_LIBRARY_FILTERS) {
      result[filterOption.key] = filterContentItems(searched, filterOption.key).length;
    }
    return result;
  }, [searched]);

  const visible = useMemo(
    () => filterContentItems(searched, filter),
    [searched, filter],
  );

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <ContentSearchBar value={query} onChange={setQuery} className="sm:max-w-md" />
        <button
          type="button"
          onClick={() => setCreateOpen(true)}
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-control bg-primary px-4 py-2.5 text-caption font-medium text-foreground-on-primary transition-colors duration-fast hover:bg-primary-hover"
        >
          <Plus className="h-4 w-4" />
          Create Content
        </button>
      </div>

      <ContentFilterBar active={filter} onChange={setFilter} counts={counts} />

      {visible.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-panel border border-dashed border-border bg-surface/60 px-6 py-16 text-center">
          <p className="text-body text-foreground-secondary">
            {items.length === 0
              ? "No content yet. Create your first piece to get started."
              : "Nothing matches your search or filter."}
          </p>
          <button
            type="button"
            onClick={() => setCreateOpen(true)}
            className="inline-flex items-center gap-2 rounded-control bg-primary px-4 py-2 text-caption font-medium text-foreground-on-primary transition-colors duration-fast hover:bg-primary-hover"
          >
            <Plus className="h-4 w-4" />
            Create Content
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((item) => (
            <ContentCard key={item.id} item={item} />
          ))}
        </div>
      )}

      <CreateContentDialog open={createOpen} onClose={() => setCreateOpen(false)} />
    </div>
  );
}
