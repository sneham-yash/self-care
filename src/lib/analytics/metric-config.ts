import type { LucideIcon } from "lucide-react";
import {
  CircleCheckIcon,
  FlameIcon,
  FocusIcon,
  FootprintsIcon,
  HeartPulseIcon,
  LineChartIcon,
  TargetIcon,
  TrendingDownIcon,
  TrendingUpIcon,
  TrophyIcon,
  UsersIcon,
  BrainIcon,
  LeafIcon,
  BriefcaseIcon,
} from "lucide-react";

export type MetricKey =
  | "careScore"
  | "transformation"
  | "stepsForward"
  | "currentStreak"
  | "longestStreak"
  | "completionRate"
  | "physicalScore"
  | "socialScore"
  | "emotionalScore"
  | "spiritualScore"
  | "professionalScore"
  | "growthTrend"
  | "strongestCategory"
  | "needsAttention"
  | "scoreTrend"
  | "categoryScore";

export type MetricTone = "positive" | "neutral" | "attention" | "primary";

export type MetricConfig = {
  key: MetricKey;
  label: string;
  shortLabel?: string;
  icon: LucideIcon;
  tone: MetricTone;
};

const METRIC_CONFIG: Record<MetricKey, MetricConfig> = {
  careScore: {
    key: "careScore",
    label: "Care Score",
    icon: TargetIcon,
    tone: "primary",
  },
  transformation: {
    key: "transformation",
    label: "Transformation",
    shortLabel: "Growth",
    icon: TrendingUpIcon,
    tone: "positive",
  },
  stepsForward: {
    key: "stepsForward",
    label: "Steps Forward",
    shortLabel: "Steps",
    icon: FootprintsIcon,
    tone: "neutral",
  },
  currentStreak: {
    key: "currentStreak",
    label: "Current Streak",
    shortLabel: "Streak",
    icon: FlameIcon,
    tone: "primary",
  },
  longestStreak: {
    key: "longestStreak",
    label: "Longest Streak",
    shortLabel: "Longest",
    icon: FlameIcon,
    tone: "primary",
  },
  completionRate: {
    key: "completionRate",
    label: "Completion Rate",
    shortLabel: "Completion",
    icon: CircleCheckIcon,
    tone: "neutral",
  },
  physicalScore: {
    key: "physicalScore",
    label: "Physical",
    shortLabel: "Physical",
    icon: HeartPulseIcon,
    tone: "positive",
  },
  socialScore: {
    key: "socialScore",
    label: "Social",
    shortLabel: "Social",
    icon: UsersIcon,
    tone: "neutral",
  },
  emotionalScore: {
    key: "emotionalScore",
    label: "Emotional",
    shortLabel: "Emotional",
    icon: BrainIcon,
    tone: "primary",
  },
  spiritualScore: {
    key: "spiritualScore",
    label: "Spiritual",
    shortLabel: "Spiritual",
    icon: LeafIcon,
    tone: "positive",
  },
  professionalScore: {
    key: "professionalScore",
    label: "Professional",
    shortLabel: "Work",
    icon: BriefcaseIcon,
    tone: "neutral",
  },
  growthTrend: {
    key: "growthTrend",
    label: "Growth Trend",
    shortLabel: "Growth",
    icon: TrendingUpIcon,
    tone: "positive",
  },
  strongestCategory: {
    key: "strongestCategory",
    label: "Strongest Domain",
    icon: TrophyIcon,
    tone: "positive",
  },
  needsAttention: {
    key: "needsAttention",
    label: "Needs Attention",
    icon: FocusIcon,
    tone: "attention",
  },
  scoreTrend: {
    key: "scoreTrend",
    label: "Care Score Trend",
    icon: LineChartIcon,
    tone: "neutral",
  },
  categoryScore: {
    key: "categoryScore",
    label: "Domain Score",
    icon: TargetIcon,
    tone: "primary",
  },
};

export const METRIC_DEFINITION_KEYS: MetricKey[] = [
  "completionRate",
  "physicalScore",
  "socialScore",
  "emotionalScore",
  "spiritualScore",
  "professionalScore",
  "currentStreak",
  "transformation",
  "stepsForward",
  "strongestCategory",
  "needsAttention",
  "scoreTrend",
];

export function getMetricConfig(key: MetricKey): MetricConfig {
  return METRIC_CONFIG[key];
}

export function getTransformationIcon(value: number): LucideIcon {
  if (value < 0) return TrendingDownIcon;
  return TrendingUpIcon;
}

export function getMetricToneClass(tone: MetricTone): string {
  switch (tone) {
    case "positive":
      return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400";
    case "attention":
      return "bg-amber-500/10 text-amber-600 dark:text-amber-400";
    case "primary":
      return "bg-primary/10 text-primary";
    default:
      return "bg-muted text-muted-foreground";
  }
}

export function getTrendValueClass(value: number): string {
  if (value > 0) return "text-emerald-600 dark:text-emerald-400";
  if (value < 0) return "text-muted-foreground";
  return "text-foreground";
}
