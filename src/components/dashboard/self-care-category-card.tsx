"use client";

import { getLucideIcon, resolveIconName } from "@/constants/icons";
import { getCarePointDomain } from "@/constants/care-points";
import type { DomainSlug } from "@/constants/care";
import type { CategoryScore, ScoreTrend } from "@/lib/analytics/self-care-score";
import { cn } from "@/lib/utils";

const DOMAIN_ICONS: Record<DomainSlug, string> = {
  physical: "leaf",
  emotional: "brain",
  social: "users",
  spiritual: "sun",
  professional: "briefcase",
};

type SelfCareCategoryCardProps = {
  categoryScore: CategoryScore;
  trend: ScoreTrend | null;
};

export function SelfCareCategoryCard({
  categoryScore,
  trend,
}: SelfCareCategoryCardProps) {
  const {
    category,
    score,
    assessedCount,
    totalCount,
    coveragePercentage,
    isEligibleForScore,
  } = categoryScore;

  const domain = getCarePointDomain(category);
  const iconName = resolveIconName(DOMAIN_ICONS[category] ?? "heart");
  const LucideIcon = getLucideIcon(iconName);

  const hasAnyAssessed = assessedCount > 0;
  // Show the numeric score only when the category has enough coverage
  const showScore = isEligibleForScore && score !== null;
  const pct = showScore ? Math.round(score) : null;

  // Progress bar reflects assessment coverage (how much has been rated),
  // not the performance score, so users can see how far they still need to go.
  const coveragePct = Math.round(coveragePercentage * 100);

  return (
    <div className="rounded-2xl border border-border/60 bg-card p-4 shadow-sm dark:border-border/30">
      {/* Icon + label */}
      <div className="flex items-center gap-2.5">
        <div
          className={cn(
            "flex size-9 shrink-0 items-center justify-center rounded-xl",
            domain ? [domain.bgLight, domain.bgDark] : "bg-muted",
          )}
          aria-hidden
        >
          <LucideIcon className="size-4 text-white" />
        </div>
        <p className="text-sm font-semibold leading-tight">
          {domain?.label ?? category}
        </p>
      </div>

      {/* Score / status */}
      <div className="mt-3">
        {showScore ? (
          <p className="text-2xl font-bold leading-none tracking-tight">
            {pct}%
          </p>
        ) : hasAnyAssessed ? (
          <p className="text-xs font-medium text-warning leading-snug">
            Assessment in progress
          </p>
        ) : (
          <p className="text-sm text-muted-foreground italic">Not assessed</p>
        )}
      </div>

      {/* Coverage / assessment progress bar */}
      {hasAnyAssessed ? (
        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
          <div
            className={cn(
              "h-full rounded-full transition-all duration-500",
              showScore
                ? domain
                  ? [domain.bgLight, domain.bgDark]
                  : "bg-primary"
                : "bg-warning/40",
            )}
            style={{ width: `${coveragePct}%` }}
            role="progressbar"
            aria-label={`${assessedCount} of ${totalCount} items assessed`}
            aria-valuenow={coveragePct}
            aria-valuemin={0}
            aria-valuemax={100}
          />
        </div>
      ) : null}

      {/* Assessment count + trend */}
      <div className="mt-2 flex items-center justify-between gap-2">
        <p className="text-xs text-muted-foreground">
          {assessedCount} / {totalCount} assessed
        </p>

        {trend !== null ? (
          <span
            className={cn(
              "text-xs font-medium",
              trend.delta > 0
                ? "text-success"
                : trend.delta < 0
                  ? "text-destructive"
                  : "text-muted-foreground",
            )}
          >
            {trend.delta > 0
              ? `▲ ${trend.delta}%`
              : trend.delta < 0
                ? `▼ ${Math.abs(trend.delta)}%`
                : "—"}
          </span>
        ) : null}
      </div>
    </div>
  );
}
