/**
 * Self-Care Score data fetching.
 *
 * Uses latest intensity per item (not date-scoped) to answer
 * "how am I currently doing?" independently of calendar browsing.
 */

import {
  toAssessmentIntensity,
  buildSelfCareScoreState,
  type SelfCarePoint,
  type SelfCareScoreState,
} from "@/lib/analytics/self-care-score";
import { createClient } from "@/lib/supabase/client";
import type { DomainSlug } from "@/constants/care";
import { SYSTEM_CATEGORY_IDS } from "@/constants/care";

/** System domain slugs indexed by category id for quick lookup */
const CATEGORY_ID_TO_SLUG = Object.fromEntries(
  Object.entries(SYSTEM_CATEGORY_IDS).map(([slug, id]) => [id, slug]),
) as Record<string, DomainSlug>;

export type SelfCareScoreData = {
  state: SelfCareScoreState;
  /** Raw points — useful for per-item improvement toggle display */
  points: SelfCarePoint[];
  /** Previous snapshot 30 days ago — null when no history exists */
  previousState: SelfCareScoreState | null;
};

/**
 * Fetches all data required to render the Self-Care Score card.
 *
 * - Only visible default items in the five system domains are included.
 * - Custom items are not scored (they feed Care Consistency only).
 * - Hidden items are excluded from both numerator and denominator.
 */
export async function fetchSelfCareScoreData(): Promise<SelfCareScoreData> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Not authenticated");

  const systemCategoryIds = Object.values(SYSTEM_CATEGORY_IDS);

  // Fetch: default items in system domains, hidden set, latest intensities,
  //        30-day-ago intensities, and improvement flags — in one batch.
  const [
    { data: rawItems, error: itemsError },
    { data: hidden, error: hiddenError },
    { data: currentIntensities, error: ciError },
    { data: previousIntensities, error: piError },
    { data: flags, error: flagsError },
  ] = await Promise.all([
    supabase
      .from("care_items")
      .select("id, category_id, is_default, archived_at")
      .in("category_id", systemCategoryIds)
      .eq("is_default", true)
      .is("archived_at", null),

    supabase
      .from("user_hidden_items")
      .select("item_id")
      .eq("user_id", user.id),

    // Latest intensity with no date cutoff
    supabase.rpc("get_latest_item_intensities", { p_as_of: null }),

    // Latest intensity as of 30 days ago for trend comparison
    supabase.rpc("get_latest_item_intensities", {
      p_as_of: formatDateOffset(-30),
    }),

    supabase
      .from("user_item_flags")
      .select("item_id, wants_improvement")
      .eq("user_id", user.id),
  ]);

  if (itemsError) throw new Error(itemsError.message);
  if (hiddenError) throw new Error(hiddenError.message);
  if (ciError) throw new Error(ciError.message);
  if (piError) throw new Error(piError.message);
  if (flagsError) throw new Error(flagsError.message);

  const hiddenIds = new Set((hidden ?? []).map((h) => h.item_id));
  const visibleItems = (rawItems ?? []).filter(
    (item) => !hiddenIds.has(item.id),
  );

  const currentMap = new Map(
    (currentIntensities ?? []).map((row) => [row.item_id, row.intensity]),
  );
  const previousMap = new Map(
    (previousIntensities ?? []).map((row) => [row.item_id, row.intensity]),
  );
  const flagMap = new Map(
    (flags ?? []).map((f) => [f.item_id, f.wants_improvement]),
  );

  function toPoints(intensityMap: Map<string, number>): SelfCarePoint[] {
    return visibleItems.map((item) => {
      const slug = CATEGORY_ID_TO_SLUG[item.category_id];
      return {
        id: item.id,
        category: slug,
        intensity: toAssessmentIntensity(intensityMap.get(item.id)),
        wantsImprovement: flagMap.get(item.id) ?? false,
        note: null, // notes are on care_logs; not needed for scoring
      };
    });
  }

  const currentPoints = toPoints(currentMap);
  const previousPoints = toPoints(previousMap);

  const state = buildSelfCareScoreState(currentPoints);
  const previousState = buildSelfCareScoreState(previousPoints);

  // Only expose previous state when it actually has data
  const hasPreviousData = previousState.hasAnyData;

  return {
    state,
    points: currentPoints,
    previousState: hasPreviousData ? previousState : null,
  };
}

export async function setWantsImprovement(
  itemId: string,
  wantsImprovement: boolean,
): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.rpc("set_wants_improvement", {
    p_item_id: itemId,
    p_wants_improvement: wantsImprovement,
  });
  if (error) throw new Error(error.message);
}

function formatDateOffset(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}
