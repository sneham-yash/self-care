import {
  isInsightsReady,
  mapMetricsToInsights,
  mapTrendRowToScore,
  type CareInsights,
  type CareMetricsRow,
  type CareScoreTrendPoint,
  type CareScoreTrendRow,
} from "@/lib/analytics/care-score";
import { createClient } from "@/lib/supabase/client";

const EMPTY_METRICS: CareMetricsRow = {
  completion_rate: 0,
  current_streak: 0,
  growth_trend: 0,
  steps_forward: 0,
  longest_streak: 0,
  physical_rate: 0,
  social_rate: 0,
  emotional_rate: 0,
  spiritual_rate: 0,
  professional_rate: 0,
  strongest_category_id: null,
  strongest_category_name: null,
  needs_attention_category_id: null,
  needs_attention_category_name: null,
};

export type InsightsPayload = {
  insights: CareInsights;
  isReady: boolean;
  itemCount: number;
  metrics: CareMetricsRow;
  scoreTrend: CareScoreTrendPoint[];
};

async function fetchActiveItemCount(): Promise<number> {
  const supabase = createClient();
  const { count, error } = await supabase
    .from("care_items")
    .select("*", { count: "exact", head: true })
    .is("archived_at", null);

  if (error) {
    throw new Error(error.message);
  }

  return count ?? 0;
}

async function fetchCareScoreTrend(days = 30): Promise<CareScoreTrendPoint[]> {
  const supabase = createClient();
  const { data, error } = await supabase.rpc("get_care_score_trend", {
    p_days: days,
  });

  if (error) {
    throw new Error(error.message);
  }

  return ((data ?? []) as CareScoreTrendRow[]).map(mapTrendRowToScore);
}

export async function fetchCareInsights(): Promise<InsightsPayload> {
  const supabase = createClient();
  const [metricsResult, itemCount, scoreTrend] = await Promise.all([
    supabase.rpc("get_care_metrics"),
    fetchActiveItemCount(),
    fetchCareScoreTrend().catch(() => [] as CareScoreTrendPoint[]),
  ]);

  if (metricsResult.error) {
    throw new Error(metricsResult.error.message);
  }

  const metrics = (metricsResult.data?.[0] ?? EMPTY_METRICS) as CareMetricsRow;
  const insights = mapMetricsToInsights(metrics);
  const isReady = isInsightsReady(metrics, itemCount);

  return {
    insights,
    isReady,
    itemCount,
    metrics,
    scoreTrend: isReady ? scoreTrend : [],
  };
}
