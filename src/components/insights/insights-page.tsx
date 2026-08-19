"use client";

import {
  CategoryInsightCard,
  MiniMetricTile,
} from "@/components/metrics";
import { SelfCareScoreCard } from "@/components/dashboard/self-care-score-card";
import { InsightsPageHeader } from "@/components/insights/insights-page-header";
import { CareScoreTrendChart } from "@/components/insights/care-score-trend-chart";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useInsights } from "@/hooks/use-insights";
import { useSelfCareScore } from "@/hooks/use-self-care-score";
import { typography } from "@/lib/typography";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { DownloadIcon } from "lucide-react";

const METRICS_GUIDE_FROM_INSIGHTS = "/settings/metrics-guide?from=insights";

export function InsightsPage() {
  const { data, isLoading, error } = useInsights();
  const { data: scoreData } = useSelfCareScore();

  return (
    <div className="space-y-4">
      <InsightsPageHeader metricsGuideHref={METRICS_GUIDE_FROM_INSIGHTS} />

      {isLoading ? (
        <p className={typography.bodyMuted}>Loading insights…</p>
      ) : null}

      {error ? (
        <p className="text-destructive text-sm" role="alert">
          {error.message}
        </p>
      ) : null}

      {data && !data.isReady ? (
        <Card className="border-dashed">
          <CardHeader className="text-center">
            <h2 className={typography.sectionTitle}>Insights coming soon</h2>
            <p className={cn(typography.bodyText, "leading-relaxed")}>
              Keep checking in for a few days to unlock your Self-Care Score
              and domain highlights.
            </p>
          </CardHeader>
          <CardContent className={cn(typography.bodyMuted, "text-center")}>
            {data.itemCount > 0
              ? `${data.itemCount} items ready · ${data.metrics.steps_forward} steps forward so far`
              : "Your default checklist is ready — start checking in."}
          </CardContent>
        </Card>
      ) : null}

      {data?.isReady ? (
        <>
          <div className="flex justify-end">
            <Button variant="outline" size="sm" asChild>
              <Link href="/reports">
                <DownloadIcon />
                Download report
              </Link>
            </Button>
          </div>

          {/* Self-Care Score — the single headline number */}
          {scoreData ? (
            <SelfCareScoreCard
              state={scoreData.state}
              previousState={scoreData.previousState}
              showDetails={false}
            />
          ) : null}

          {/* Score trend chart (historical consistency shape) */}
          <CareScoreTrendChart data={data.scoreTrend} />

          {/* Completion rates by domain — supporting context */}
          <div className="grid min-w-0 grid-cols-2 gap-2 lg:grid-cols-5">
            <MiniMetricTile
              metricKey="physicalScore"
              value={`${data.insights.physicalRate}%`}
              align="left"
            />
            <MiniMetricTile
              metricKey="socialScore"
              value={`${data.insights.socialRate}%`}
              align="left"
            />
            <MiniMetricTile
              metricKey="emotionalScore"
              value={`${data.insights.emotionalRate}%`}
              align="left"
            />
            <MiniMetricTile
              metricKey="spiritualScore"
              value={`${data.insights.spiritualRate}%`}
              align="left"
            />
            <MiniMetricTile
              metricKey="professionalScore"
              value={`${data.insights.professionalRate}%`}
              align="left"
            />
          </div>

          <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
            <CategoryInsightCard
              metricKey="strongestCategory"
              value={data.insights.strongestCategoryName ?? "—"}
            />
            <CategoryInsightCard
              metricKey="needsAttention"
              value={data.insights.needsAttentionCategoryName ?? "—"}
              description="A domain where small steps can help most"
            />
          </div>
        </>
      ) : null}
    </div>
  );
}
