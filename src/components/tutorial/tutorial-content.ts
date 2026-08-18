import {
  calculateCareScore,
  CARE_SCORE_WEIGHTS,
} from "@/lib/analytics/care-score";
import { DOMAIN_LABELS } from "@/constants/care";

export const ONBOARDING_STEP_COUNT = 3;

export const ONBOARDING_STEPS = [
  {
    id: "checklist",
    title: "A ready-made checklist",
    description:
      "Nourish starts with five self-care domains. Rate how well you did each item today and add an optional remark.",
    bullets: [
      "Physical, Social, Emotional, Spiritual, and Professional items are ready on day one.",
      "Tap 1, 2, or 3 stars to log how well you did each item. Tap the note icon to add a remark.",
      "Hide items you don’t need under Settings → Manage items.",
    ],
    domains: Object.values(DOMAIN_LABELS),
  },
  {
    id: "custom",
    title: "Add your own practices",
    description:
      "Create extra items in any domain, with daily, weekly, or custom schedules.",
    bullets: [
      "Use Create in the nav to add something that matters to you.",
      "Group custom items into a default domain or a category you create.",
      "Use the month calendar on Check-in to review any past day.",
    ],
  },
  {
    id: "metrics",
    title: "Your Care Score",
    description:
      "Your Care Score (0–100) reflects how consistently you showed up across the five domains over the last 30 days.",
    bullets: [
      "It blends domain averages, your current streak, and recent growth.",
      "Visit Insights for trends, then download a daily, weekly, or monthly PDF.",
      "See the full breakdown anytime under Settings → Tutorial.",
    ],
    previewScore: 72,
    previewMetrics: [
      { metricKey: "completionRate" as const, value: "85%" },
      { metricKey: "currentStreak" as const, value: "12", unit: "days" },
      { metricKey: "growthTrend" as const, value: "+5%", trendValue: 0.05 },
    ],
  },
] as const;

export const METRICS_GUIDE_WEIGHTS = [
  {
    key: "domainAverage",
    label: "Domain average",
    weight: CARE_SCORE_WEIGHTS.domainAverage,
    normalization: "Average of the five domain completion rates",
    colorClass: "bg-primary",
  },
  {
    key: "currentStreak",
    label: "Current Streak",
    weight: CARE_SCORE_WEIGHTS.currentStreak,
    normalization: "Streak ÷ 30 × 100, capped at 100",
    colorClass: "bg-primary/80",
  },
  {
    key: "growthTrend",
    label: "Growth Trend",
    weight: CARE_SCORE_WEIGHTS.growthTrend,
    normalization: "50 + trend × 50 (trend is month-over-month change)",
    colorClass: "bg-muted-foreground/40",
  },
] as const;

export const METRICS_GUIDE_EXAMPLE = {
  completionRate: 80,
  currentStreak: 12,
  physicalRate: 85,
  socialRate: 70,
  emotionalRate: 78,
  spiritualRate: 65,
  professionalRate: 72,
  growthTrend: 0.05,
} as const;

export const METRICS_GUIDE_EXAMPLE_SCORE = calculateCareScore(
  METRICS_GUIDE_EXAMPLE,
);

export const METRIC_DEFINITIONS = [
  {
    title: "Completion Rate",
    description:
      "Completed scheduled days divided by total scheduled days across all visible items in the last 30 days.",
    window: "Rolling 30 days",
  },
  {
    title: "Physical",
    description: "Completion rate for Physical self-care items.",
    window: "Rolling 30 days",
  },
  {
    title: "Social",
    description: "Completion rate for Social self-care items.",
    window: "Rolling 30 days",
  },
  {
    title: "Emotional",
    description: "Completion rate for Psychological / emotional items.",
    window: "Rolling 30 days",
  },
  {
    title: "Spiritual",
    description: "Completion rate for Spiritual self-care items.",
    window: "Rolling 30 days",
  },
  {
    title: "Professional",
    description: "Completion rate for Professional self-care items.",
    window: "Rolling 30 days",
  },
  {
    title: "Current Streak",
    description:
      "Consecutive days with at least one completed care item, counting back from today.",
    window: "All time",
  },
  {
    title: "Transformation",
    description:
      "How your completion rate changed compared to the previous 30-day window.",
    window: "30 days vs prior 30 days",
  },
  {
    title: "Steps Forward",
    description: "Total lifetime completed check-ins.",
    window: "All time",
  },
  {
    title: "Strongest Domain",
    description: "The domain with the highest completion rate in the current window.",
    window: "Rolling 30 days",
  },
  {
    title: "Needs Attention",
    description: "The domain with the lowest completion rate.",
    window: "Rolling 30 days",
  },
  {
    title: "Score Trend",
    description:
      "Your Care Score recalculated each day using a rolling 30-day window.",
    window: "Daily rolling 30 days",
  },
] as const;

export const INSIGHTS_READINESS_NOTE =
  "Insights unlock once you have at least one item and either 3+ total completions or any completion rate above 0%.";
