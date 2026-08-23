import { Search } from "lucide-react";
import { cn } from "@/lib/utils/cn";

type ProjectSearchProps = {
  value: string;
  onChange: (value: string) => void;
  className?: string;
};

export function ProjectSearch({ value, onChange, className }: ProjectSearchProps) {
  return (
    <label className={cn("relative block w-full", className)}>
      <span className="sr-only">Search projects</span>
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground-muted" />
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search projects by name or description…"
        className="w-full rounded-control border border-border bg-background py-2 pl-9 pr-3 text-caption text-foreground placeholder:text-foreground-muted focus:border-primary-muted focus:outline-none"
      />
    </label>
  );
}
