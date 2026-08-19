"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScoreRing } from "@/components/metrics/score-ring";
import { SelfCareCategoryCard } from "@/components/dashboard/self-care-category-card";
import { SelfCareScoreDetails } from "@/components/dashboard/self-care-score-details";
import {
  getScoreTrend,
  type SelfCareScoreState,
} from "@/lib/analytics/self-care-score";
import { typography } from "@/lib/typography";
import { cn } from "@/lib/utils";

type SelfCareScoreCardProps = {
  state: SelfCareScoreState;
  previousState: SelfCareScoreState | null;
  /** Set false to hide the expandable "How your score works" section (e.g. on Insights). */
  showDetails?: boolean;
};

export function SelfCareScoreCard({
  state,
  previousState,
  showDetails = true,
}: SelfCareScoreCardProps) {
  const {
    overallScore,
    categoryScores,
    totalAssessed,
    totalItems,
    fullyAssessed,
    hasAnyData,
  } = state;

  const overallTrend =
    previousState && overallScore !== null
      ? getScoreTrend(overallScore, previousState.overallScore)
      : null;

  return (
    <Card className="relative min-w-0 gap-4 overflow-hidden rounded-2xl border-primary/15 bg-linear-to-br from-primary/5 via-background to-background py-4">
      <div
        className="pointer-events-none absolute -right-6 -top-6 size-28 rounded-full bg-primary/6 blur-2xl"
        aria-hidden
      />

      <CardContent className="relative min-w-0 space-y-4 px-4 md:py-1">
        <div className="flex items-center justify-between gap-2">
          <p className={cn(typography.metricLabel, "text-primary/80")}>
            Your Self-Care Balance
          </p>

          {overallTrend !== null ? (
            <span
              className={cn(
                "shrink-0 rounded-full px-2 py-0.5 text-xs font-medium",
                overallTrend.delta > 0
                  ? "bg-success/15 text-success"
                  : overallTrend.delta < 0
                    ? "bg-destructive/15 text-destructive"
                    : "bg-muted text-muted-foreground",
              )}
            >
              {overallTrend.delta > 0
                ? `▲ ${overallTrend.delta}%`
                : overallTrend.delta < 0
                  ? `▼ ${Math.abs(overallTrend.delta)}%`
                  : "Your baseline"}
            </span>
          ) : hasAnyData && overallScore !== null ? (
            <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
              Your baseline
            </span>
          ) : null}
        </div>

        {!hasAnyData ? (
          <div className="py-4 text-center space-y-3">
            <div className="flex justify-center">
              <ScoreRing score={null} size="xl" />
            </div>
            <div className="space-y-1">
              <p className={cn(typography.sectionTitle, "text-base")}>
                Nothing here yet
              </p>
              <p className={cn(typography.bodyMuted, "text-sm")}>
                A small beginning can become something meaningful. Take a moment
                to reflect on how you&apos;re caring for yourself.
              </p>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link href="#self-care-points">Start Assessment</Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-4">
              <ScoreRing
                score={overallScore}
                size="xl"
                aria-label={
                  overallScore !== null
                    ? `Self-Care Score: ${Math.round(overallScore)}%`
                    : "Rate your first item to see your score"
                }
              />

              <div className="min-w-0 space-y-1">
                <p className={cn(typography.metricValue, "text-primary leading-none")}>
                  {overallScore !== null ? `${Math.round(overallScore)}%` : "—"}
                </p>
                <p className={cn(typography.bodyMuted, "text-sm")}>
                  Self-Care Score
                </p>
                {!fullyAssessed ? (
                  <p className="text-xs text-muted-foreground">
                    {totalAssessed} / {totalItems} assessed
                  </p>
                ) : null}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-5">
              {categoryScores.map((cs) => {
                const prevCategoryScore = previousState?.categoryScores.find(
                  (p) => p.category === cs.category,
                );
                const trend =
                  prevCategoryScore?.isEligibleForScore && cs.isEligibleForScore
                    ? getScoreTrend(cs.score, prevCategoryScore.score)
                    : null;

                return (
                  <SelfCareCategoryCard
                    key={cs.category}
                    categoryScore={cs}
                    trend={trend}
                  />
                );
              })}
            </div>
          </>
        )}

        {showDetails ? <SelfCareScoreDetails /> : null}
      </CardContent>
    </Card>
  );
}
