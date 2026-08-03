type PlaceholderPageProps = {
  label: string;
};

export function PlaceholderPage({ label }: PlaceholderPageProps) {
  return (
    <div className="flex h-full min-h-[18rem] flex-col items-center justify-center rounded-panel border border-dashed border-border bg-surface/60 px-6 py-16 text-center">
      <p className="text-caption uppercase tracking-wide text-foreground-muted">
        Placeholder
      </p>
      <p className="mt-3 max-w-md text-body text-foreground-secondary">
        {label} content will live here. The application shell is ready —
        feature modules are intentionally empty.
      </p>
    </div>
  );
}
