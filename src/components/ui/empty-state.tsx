import { cn } from "@/lib/utils";
import { typography } from "@/lib/typography";

type EmptyStateProps = {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
  size?: "sm" | "md";
};

export function EmptyState({
  title = "Nothing here yet",
  description = "A small beginning can become something meaningful.",
  action,
  className,
  size = "md",
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-dashed border-border/60 text-center",
        size === "md" ? "p-8 space-y-3" : "p-5 space-y-2",
        className,
      )}
    >
      <p className={cn(typography.sectionTitle, "text-base")}>{title}</p>
      <p className={cn(typography.bodyMuted, size === "sm" ? "text-xs" : "text-sm")}>
        {description}
      </p>
      {action ? <div className="pt-1">{action}</div> : null}
    </div>
  );
}
