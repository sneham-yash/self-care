export type CareScoreInput = {
  completionRate: number;
  currentStreak: number;
  physicalRate: number;
  socialRate: number;
  emotionalRate: number;
  spiritualRate: number;
  professionalRate: number;
  growthTrend: number;
};

export const CARE_SCORE_WEIGHTS = {
  domainAverage: 0.7,
  currentStreak: 0.25,
  growthTrend: 0.05,
} as const;

const MAX_STREAK_FOR_SCORE = 30;

function clamp(value: number, min = 0, max = 100): number {
  return Math.min(max, Math.max(min, value));
}

function normalizeStreak(streak: number): number {
  if (streak <= 0) return 0;
  return clamp((streak / MAX_STREAK_FOR_SCORE) * 100);
}

function normalizeTrend(trend: number): number {
  return clamp(50 + trend * 50);
}

export function calculateCareScore(input: CareScoreInput): number {
  const domainAverage =
    (input.physicalRate +
      input.socialRate +
      input.emotionalRate +
      input.spiritualRate +
      input.professionalRate) /
    5;

  const score =
    clamp(domainAverage) * CARE_SCORE_WEIGHTS.domainAverage +
    normalizeStreak(input.currentStreak) * CARE_SCORE_WEIGHTS.currentStreak +
    normalizeTrend(input.growthTrend) * CARE_SCORE_WEIGHTS.growthTrend;

  return Math.round(clamp(score));
}

export type CareMetricsRow = {
  completion_rate: number;
  current_streak: number;
  growth_trend: number;
  steps_forward: number;
  longest_streak: number;
  physical_rate: number;
  social_rate: number;
  emotional_rate: number;
  spiritual_rate: number;
  professional_rate: number;
  strongest_category_id: string | null;
  strongest_category_name: string | null;
  needs_attention_category_id: string | null;
  needs_attention_category_name: string | null;
};

export type CareInsights = {
  careScore: number;
  transformation: number;
  currentStreak: number;
  completionRate: number;
  stepsForward: number;
  longestStreak: number;
  physicalRate: number;
  socialRate: number;
  emotionalRate: number;
  spiritualRate: number;
  professionalRate: number;
  strongestCategoryName: string | null;
  needsAttentionCategoryName: string | null;
};

export type CareScoreTrendRow = {
  score_date: string;
  completion_rate: number;
  current_streak: number;
  physical_rate: number;
  social_rate: number;
  emotional_rate: number;
  spiritual_rate: number;
  professional_rate: number;
  growth_trend: number;
};

export type CareScoreTrendPoint = {
  date: string;
  score: number;
};

export function formatTransformation(value: number): string {
  const rounded = Math.round(value * 10) / 10;
  if (rounded > 0) return `+${rounded}%`;
  if (rounded < 0) return `${rounded}%`;
  return "0%";
}

export function formatStreakDays(streak: number): string {
  return `${streak} ${streak === 1 ? "Day" : "Days"}`;
}

export function mapTrendRowToScore(
  row: CareScoreTrendRow,
): CareScoreTrendPoint {
  return {
    date: row.score_date,
    score: calculateCareScore({
      completionRate: row.completion_rate,
      currentStreak: row.current_streak,
      physicalRate: row.physical_rate,
      socialRate: row.social_rate,
      emotionalRate: row.emotional_rate,
      spiritualRate: row.spiritual_rate,
      professionalRate: row.professional_rate,
      growthTrend: row.growth_trend,
    }),
  };
}

export function mapMetricsToInsights(metrics: CareMetricsRow): CareInsights {
  return {
    careScore: calculateCareScore({
      completionRate: metrics.completion_rate,
      currentStreak: metrics.current_streak,
      physicalRate: metrics.physical_rate,
      socialRate: metrics.social_rate,
      emotionalRate: metrics.emotional_rate,
      spiritualRate: metrics.spiritual_rate,
      professionalRate: metrics.professional_rate,
      growthTrend: metrics.growth_trend,
    }),
    transformation: Math.round(metrics.growth_trend * 100 * 10) / 10,
    currentStreak: metrics.current_streak,
    completionRate: metrics.completion_rate,
    stepsForward: metrics.steps_forward,
    longestStreak: metrics.longest_streak,
    physicalRate: metrics.physical_rate,
    socialRate: metrics.social_rate,
    emotionalRate: metrics.emotional_rate,
    spiritualRate: metrics.spiritual_rate,
    professionalRate: metrics.professional_rate,
    strongestCategoryName: metrics.strongest_category_name,
    needsAttentionCategoryName: metrics.needs_attention_category_name,
  };
}

export function isInsightsReady(
  metrics: CareMetricsRow,
  itemCount: number,
): boolean {
  return (
    itemCount > 0 &&
    (metrics.steps_forward >= 3 || metrics.completion_rate > 0)
  );
}
