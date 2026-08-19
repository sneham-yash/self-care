import { typography } from "@/lib/typography";
import { cn } from "@/lib/utils";

type ScoreRingSize = "sm" | "md" | "lg" | "xl";

const SIZE_CONFIG: Record<
  ScoreRingSize,
  { container: string; viewBox: string; radius: number; strokeWidth: number; valueClass: string }
> = {
  sm: {
    container: "size-16",
    viewBox: "0 0 64 64",
    radius: 24,
    strokeWidth: 5,
    valueClass: typography.metricValueSm + " text-xl",
  },
  md: {
    container: "size-20",
    viewBox: "0 0 72 72",
    radius: 28,
    strokeWidth: 5,
    valueClass: typography.metricValueSm,
  },
  lg: {
    container: "size-24",
    viewBox: "0 0 80 80",
    radius: 30,
    strokeWidth: 6,
    valueClass: typography.metricValue,
  },
  xl: {
    container: "size-32",
    viewBox: "0 0 112 112",
    radius: 44,
    strokeWidth: 7,
    valueClass: typography.metricValue + " text-3xl",
  },
};

/**
 * The score ring always uses the sage primary color.
 * Pass a custom `colorClass` (e.g. "text-[var(--category-mind)]") for category-specific rings.
 */
type ScoreRingProps = {
  score: number | null;
  size?: ScoreRingSize;
  /** Tailwind color class for the ring fill — defaults to text-primary (sage) */
  colorClass?: string;
  className?: string;
  "aria-label"?: string;
};

export function ScoreRing({
  score,
  size = "lg",
  colorClass = "text-primary",
  className,
  "aria-label": ariaLabel,
}: ScoreRingProps) {
  const config = SIZE_CONFIG[size];
  const center = parseInt(config.viewBox.split(" ")[2] ?? "80", 10) / 2;
  const circumference = 2 * Math.PI * config.radius;
  const effectiveScore = score ?? 0;
  const offset = circumference - (effectiveScore / 100) * circumference;

  return (
    <div
      className={cn("relative shrink-0", config.container, className)}
      role="img"
      aria-label={ariaLabel}
    >
      <svg
        className={cn(config.container, "-rotate-90")}
        viewBox={config.viewBox}
        aria-hidden
      >
        <circle
          cx={center}
          cy={center}
          r={config.radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={config.strokeWidth}
          className="text-muted"
        />
        <circle
          cx={center}
          cy={center}
          r={config.radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={config.strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className={cn(colorClass, "transition-all duration-500")}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        {score !== null ? (
          <span className={config.valueClass}>{Math.round(score)}</span>
        ) : null}
      </div>
    </div>
  );
}
