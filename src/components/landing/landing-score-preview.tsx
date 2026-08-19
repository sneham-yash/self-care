import { ScoreRing } from "@/components/metrics/score-ring";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const DEMO_SCORE = 72;

const DEMO_CATEGORIES = [
  { label: "Body", score: 80 },
  { label: "Mind", score: 67 },
  { label: "People", score: 73 },
  { label: "Purpose", score: 60 },
  { label: "Work", score: 78 },
] as const;

type LandingScorePreviewProps = {
  className?: string;
};

export function LandingScorePreview({ className }: LandingScorePreviewProps) {
  return (
    <Card
      className={cn(
        "relative overflow-hidden gap-4 border-primary/15 bg-linear-to-br from-primary/5 via-background to-background py-4",
        className,
      )}
    >
      <div
        className="pointer-events-none absolute -right-6 -top-6 size-28 rounded-full bg-primary/6 blur-2xl"
        aria-hidden
      />
      <CardContent className="relative space-y-4 px-4">
        <p className="text-xs font-medium tracking-wide text-primary/80 uppercase">
          Your Self-Care Balance
        </p>

        <div className="flex items-center gap-4">
          <ScoreRing score={DEMO_SCORE} size="xl" />
          <div className="space-y-0.5">
            <p className="text-3xl font-bold leading-none text-primary">
              {DEMO_SCORE}%
            </p>
            <p className="text-sm text-muted-foreground">Self-Care Score</p>
            <p className="text-xs text-muted-foreground">
              38 / 45 assessed
            </p>
          </div>
        </div>

        <div className="grid grid-cols-5 gap-1.5">
          {DEMO_CATEGORIES.map((cat) => (
            <div
              key={cat.label}
              className="rounded-xl border border-border/60 bg-card px-1.5 py-2 text-center"
            >
              <p className="text-[10px] font-medium text-foreground">
                {cat.label}
              </p>
              <p className="text-xs font-semibold text-primary">{cat.score}%</p>
            </div>
          ))}
        </div>

        <p className="text-[10px] text-muted-foreground">
          Based on your ★ intensity ratings across all five areas
        </p>
      </CardContent>
    </Card>
  );
}
