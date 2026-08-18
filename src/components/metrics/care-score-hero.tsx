import type { ReactNode } from "react";

import { APP_TAGLINE } from "@/constants/brand";
import { Card, CardContent } from "@/components/ui/card";
import {
  formatStreakDays,
  formatTransformation,
} from "@/lib/analytics/care-score";
import { typography } from "@/lib/typography";
import { cn } from "@/lib/utils";

import { MiniMetricTile } from "./mini-metric-tile";
import { ScoreRing } from "./score-ring";

type CareScoreHeroProps = {
  careScore: number;
  transformation: number;
  currentStreak: number;
  stepsForward: number;
  children?: ReactNode;
  showTagline?: boolean;
  className?: string;
};

export function CareScoreHero({
  careScore,
  transformation,
  currentStreak,
  stepsForward,
  children,
  showTagline = true,
  className,
}: CareScoreHeroProps) {
  return (
    <Card
      className={cn(
        "relative min-w-0 gap-3 overflow-hidden rounded-2xl border-primary/15 bg-gradient-to-br from-primary/[0.08] via-background to-background py-3 shadow-sm shadow-primary/5",
        className,
      )}
    >
      <div
        className="pointer-events-none absolute -right-6 -top-6 size-28 rounded-full bg-primary/[0.06] blur-2xl"
        aria-hidden
      />

      <CardContent className="relative min-w-0 space-y-3 px-4 md:py-1">
        <div className="space-y-0.5">
          <p className={cn(typography.metricLabel, "uppercase tracking-wide")}>
            Care Score
          </p>
          <p
            className={cn(
              typography.bodyMuted,
              "text-xs uppercase tracking-wide",
            )}
          >
            Last 30 days
          </p>
        </div>

        <div className="grid grid-cols-[auto_1fr] items-center gap-3 md:gap-4">
          <ScoreRing score={careScore} size="lg" />
          <div className="flex min-w-0 flex-col justify-center gap-0.5">
            <h2 className={cn(typography.sectionTitle, "md:hidden")}>
              Care Score
            </h2>
            {showTagline ? (
              <p
                className={cn(
                  typography.bodyText,
                  "text-primary font-medium leading-snug",
                )}
              >
                {APP_TAGLINE}
              </p>
            ) : (
              <p className={cn(typography.bodyMuted, "text-sm")}>
                Last 30 days · 0–100
              </p>
            )}
          </div>
        </div>

        <div className="grid min-w-0 grid-cols-3 gap-1.5 md:gap-2">
          <MiniMetricTile
            metricKey="transformation"
            value={formatTransformation(transformation)}
            trendValue={transformation}
            align="center"
            compact
          />
          <MiniMetricTile
            metricKey="currentStreak"
            value={formatStreakDays(currentStreak)}
            align="center"
            compact
          />
          <MiniMetricTile
            metricKey="stepsForward"
            value={stepsForward}
            align="center"
            compact
          />
        </div>

        {children}
      </CardContent>
    </Card>
  );
}
