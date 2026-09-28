type ReviewFieldProps = {
  label: string;
  value: string;
  rows?: number;
  onChange: (value: string) => void;
};

export function ReviewField({ label, value, rows = 3, onChange }: ReviewFieldProps) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-caption font-medium text-foreground-secondary">{label}</span>
      <textarea
        value={value}
        rows={rows}
        onChange={(event) => onChange(event.target.value)}
        className="resize-y rounded-control border border-border bg-background px-3 py-2 text-body text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-ring"
      />
    </label>
  );
}
