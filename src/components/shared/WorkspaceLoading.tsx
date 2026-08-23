export function WorkspaceLoading({ label = "Loading workspace…" }: { label?: string }) {
  return (
    <div className="flex items-center justify-center rounded-panel border border-dashed border-border bg-surface/60 px-6 py-16">
      <p className="text-caption text-foreground-muted">{label}</p>
    </div>
  );
}
