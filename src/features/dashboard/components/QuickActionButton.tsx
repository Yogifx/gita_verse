import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils/cn";

type QuickActionButtonProps = {
  label: string;
  icon: LucideIcon;
  href?: string;
  onClick?: () => void;
};

export function QuickActionButton({
  label,
  icon: Icon,
  href,
  onClick,
}: QuickActionButtonProps) {
  const className = cn(
    "flex items-center gap-2.5 rounded-control border border-border bg-background px-4 py-3 text-caption font-medium text-foreground-secondary transition-colors duration-fast hover:border-primary-muted hover:bg-muted hover:text-foreground",
  );

  if (href) {
    return (
      <Link href={href} className={className}>
        <Icon className="h-4 w-4 text-gold" />
        {label}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className={className}>
      <Icon className="h-4 w-4 text-gold" />
      {label}
    </button>
  );
}
