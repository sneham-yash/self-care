"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeftIcon } from "lucide-react";

import {
  MetricDefinitionCard,
  ScoreRing,
} from "@/components/metrics";
import {
  INSIGHTS_READINESS_NOTE,
  METRIC_DEFINITIONS,
} from "@/components/tutorial/tutorial-content";
import { METRIC_DEFINITION_KEYS } from "@/lib/analytics/metric-config";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { typography } from "@/lib/typography";
import { cn } from "@/lib/utils";

const BACK_LINKS = {
  insights: { href: "/insights", label: "Insights" },
  tutorial: { href: "/settings/tutorial", label: "Tutorial" },
} as const;

export function MetricsGuidePage() {
  const searchParams = useSearchParams();
  const from = searchParams.get("from");
  const backLink =
    from === "insights" ? BACK_LINKS.insights : BACK_LINKS.tutorial;

  return (
    <div className="space-y-4">
      <Link
        href={backLink.href}
        className={cn(
          typography.bodyText,
          "text-muted-foreground inline-flex items-center gap-1 hover:text-foreground md:hidden",
        )}
      >
        <ArrowLeftIcon className="size-4" />
        {backLink.label}
      </Link>

      <div className="space-y-1">
        <h1 className={typography.screenTitle}>How Metrics Work</h1>
        <p className={typography.screenSubtitle}>
          Self-Care Score and Care Consistency explained
        </p>
      </div>

      {/* ── Self-Care Score ─────────────────────────────────────────── */}
      <Card className="gap-3 border-primary/15 bg-linear-to-br from-primary/4 via-card to-card py-4">
        <CardHeader className="px-4 pb-0">
          <p className={cn(typography.sectionTitle, "text-primary")}>
            Self-Care Score
          </p>
          <p className={cn(typography.bodyMuted, "text-sm leading-relaxed")}>
            Your Self-Care Score reflects how often you currently practice
            different areas of self-care — based on your ★ intensity ratings,
            not on daily completion streaks.
          </p>
        </CardHeader>
        <CardContent className="space-y-3 px-4">
          <div className="rounded-xl border border-primary/15 bg-primary/4 p-3 space-y-1.5">
            <p className={cn(typography.bodyMuted, "text-xs font-medium text-foreground")}>
              Formula
            </p>
            <p className={cn(typography.bodyMuted, "text-xs leading-relaxed")}>
              Each item you rate contributes its intensity (1–3) to its area
              average. That average is divided by 3 and multiplied by 100 to
              give a percentage. Items you haven&apos;t rated yet are excluded —
              not treated as zero.
            </p>
            <div className="mt-2 grid grid-cols-3 gap-1.5">
              {(
                [
                  { stars: "★", label: "Rarely", val: "1" },
                  { stars: "★★", label: "Sometimes", val: "2" },
                  { stars: "★★★", label: "Often", val: "3" },
                ] as const
              ).map(({ stars, label, val }) => (
                <div
                  key={label}
                  className="rounded-lg bg-card border border-border/60 px-2 py-1.5 text-center"
                >
                  <p className="font-medium text-xs text-primary">
                    {stars}
                  </p>
                  <p className="text-[10px] text-muted-foreground">{label} = {val}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <p className={cn(typography.bodyMuted, "text-xs font-medium text-foreground")}>
              Equal area weighting
            </p>
            <p className={cn(typography.bodyMuted, "text-xs leading-relaxed")}>
              Body, Mind, People, Purpose, and Work each contribute 20% to your
              overall score — regardless of how many items each area contains.
              Areas with no ratings yet are excluded from the overall average.
            </p>
            <div className="grid grid-cols-5 gap-1 mt-2">
              {(["Body", "Mind", "People", "Purpose", "Work"] as const).map(
                (area) => (
                  <div
                    key={area}
                    className="rounded-lg border border-primary/15 bg-primary/5 py-1.5 text-center"
                  >
                    <p className="text-[10px] text-primary/80 font-medium">
                      {area}
                    </p>
                    <p className="text-[10px] text-muted-foreground">20%</p>
                  </div>
                ),
              )}
            </div>
          </div>

          <div className="bg-primary/5 flex items-center justify-between gap-3 rounded-lg border border-primary/20 px-4 py-3">
            <div className="flex items-center gap-3">
              <ScoreRing score={72} size="sm" />
              <span className={typography.sectionTitle}>Example score</span>
            </div>
            <span className={typography.metricValue}>72%</span>
          </div>

          <p className={cn(typography.bodyMuted, "text-xs leading-relaxed")}>
            Improvement flags and notes you write never change the score —
            they are there to help you reflect, not to judge.
          </p>
        </CardContent>
      </Card>

      {/* ── Care Consistency ─────────────────────────────────────────── */}
      <Card className="gap-3 py-4">
        <CardHeader className="px-4 pb-0">
          <p className={typography.sectionTitle}>Care Consistency</p>
          <p className={cn(typography.bodyMuted, "text-sm leading-relaxed")}>
            Your streak, daily completion progress, and steps forward are
            supporting indicators — they show <em>how consistently</em> you are
            showing up, without changing your Self-Care Score. Use them as
            encouragement, not measurement.
          </p>
        </CardHeader>
      </Card>

      <div className="space-y-2">
        <h2 className={typography.sectionTitle}>Individual Metrics</h2>
        {METRIC_DEFINITIONS.map((metric, index) => (
          <MetricDefinitionCard
            key={metric.title}
            metricKey={METRIC_DEFINITION_KEYS[index] ?? "completionRate"}
            title={metric.title}
            description={metric.description}
            window={metric.window}
          />
        ))}
      </div>

      <Card className="border-dashed py-4">
        <CardContent className="px-4">
          <p className={cn(typography.bodyText, "font-medium")}>
            When do Insights unlock?
          </p>
          <p className={cn(typography.bodyMuted, "mt-1 text-sm leading-relaxed")}>
            {INSIGHTS_READINESS_NOTE}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
