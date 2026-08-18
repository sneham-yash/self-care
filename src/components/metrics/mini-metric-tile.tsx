import type { LucideIcon } from "lucide-react";

import {
  getMetricConfig,
  getTrendValueClass,
  getTransformationIcon,
  type MetricKey,
} from "@/lib/analytics/metric-config";
import { typography } from "@/lib/typography";
import { cn } from "@/lib/utils";

import { MetricIconBadge } from "./metric-icon-badge";

type MiniMetricTileProps = {
  metricKey: MetricKey;
  value: string | number;
  unit?: string;
  align?: "center" | "left";
  trendValue?: number;
  icon?: LucideIcon;
  className?: string;
  compact?: boolean;
};

export function MiniMetricTile({
  metricKey,
  value,
  unit,
  align = "center",
  trendValue,
  icon,
  className,
  compact = false,
}: MiniMetricTileProps) {
  const config = getMetricConfig(metricKey);
  const Icon =
    icon ??
    (metricKey === "transformation" || metricKey === "growthTrend"
      ? getTransformationIcon(trendValue ?? 0)
      : config.icon);
  const label = config.shortLabel ?? config.label;
  const isCentered = align === "center";

  return (
    <div
      className={cn(
        "bg-muted/30 flex min-w-0 flex-col overflow-hidden rounded-lg border px-1.5 py-2.5 sm:px-2",
        compact ? "min-h-[3.75rem]" : "min-h-[4.5rem]",
        isCentered ? "items-center text-center" : "items-start text-left",
        className,
      )}
    >
      <MetricIconBadge
        icon={Icon}
        tone={config.tone}
        size="sm"
        className={cn(isCentered ? "mb-1.5" : "mb-2")}
      />
      <p
        className={cn(
          typography.metricValueSm,
          "max-w-full truncate text-lg leading-tight",
          (metricKey === "transformation" || metricKey === "growthTrend") &&
            trendValue !== undefined
            ? getTrendValueClass(trendValue)
            : undefined,
        )}
      >
        {value}
      </p>
      {unit ? (
        <p className={cn(typography.bodyMuted, "text-[10px] leading-tight")}>
          {unit}
        </p>
      ) : null}
      <p className={cn(typography.metricLabel, "mt-0.5 text-[10px]")}>
        {label}
      </p>
    </div>
  );
}
