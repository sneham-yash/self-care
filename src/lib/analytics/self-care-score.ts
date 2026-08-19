/**
 * Self-Care Score — pure functions.
 *
 * Scoring is based solely on assessment intensity (1–3) for visible default items.
 * Daily completion, streaks, and improvement flags never affect these numbers.
 *
 * Unrated items are excluded from averages (not treated as zero), so the score
 * reflects only what has been assessed so far. The assessed count is shown in
 * the UI so users can see how complete their picture is.
 */

import type { DomainSlug } from "@/constants/care";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/**
 * Minimum fraction of a category's items that must be assessed before the
 * category's score is counted. Set to 0 so any single rating triggers a score.
 */
export const ASSESSMENT_COVERAGE_THRESHOLD = 0;

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type AssessmentIntensity = 1 | 2 | 3 | null;

/** Canonical order for tie-breaking and display */
export const DOMAIN_ORDER: DomainSlug[] = [
  "physical",
  "emotional",
  "social",
  "spiritual",
  "professional",
];

export type SelfCarePoint = {
  id: string;
  /** DB slug — UI label is resolved via care-points.ts */
  category: DomainSlug;
  /** null means the user has not assessed this item yet */
  intensity: AssessmentIntensity;
  /** Score-neutral. Stored separately, ignored in all calculations. */
  wantsImprovement: boolean;
  /** Score-neutral. Notes are qualitative only. */
  note: string | null;
};

export type CategoryScore = {
  category: DomainSlug;
  /**
   * Raw [0,100] float (round only at display).
   * null when no items have been assessed at all.
   * Present even when below coverage threshold — the UI decides whether to show it.
   */
  score: number | null;
  assessedCount: number;
  totalCount: number;
  /** assessedCount / totalCount, range [0,1]. 0 when totalCount is 0. */
  coveragePercentage: number;
  /**
   * true when coveragePercentage >= ASSESSMENT_COVERAGE_THRESHOLD.
   * Only eligible categories contribute to the overall score.
   */
  isEligibleForScore: boolean;
  /** true when assessedCount === totalCount (all items answered). */
  isComplete: boolean;
};

export type SelfCareScoreState = {
  /**
   * Overall score computed only from *eligible* (>=50% covered) categories.
   * null when no category is eligible yet.
   */
  overallScore: number | null;
  categoryScores: CategoryScore[];
  /** How many categories are eligible (>=50% covered). */
  eligibleCategoryCount: number;
  /** How many categories are fully complete (100% covered). */
  completeCategoryCount: number;
  totalCategoryCount: number;
  /** Total assessed items across all categories. */
  totalAssessed: number;
  /** Total items across all categories. */
  totalItems: number;
  /**
   * true when all five categories are >= 50% covered.
   * Score is still provisional until all 45 items are answered.
   */
  allCategoriesEligible: boolean;
  /** true when every single item has been assessed (45/45). */
  fullyAssessed: boolean;
  /** true when at least one item across any category has been assessed. */
  hasAnyData: boolean;
};

// ---------------------------------------------------------------------------
// Intensity helpers
// ---------------------------------------------------------------------------

/**
 * Maps a raw DB value to AssessmentIntensity.
 * 0 (not logged) and anything out-of-range becomes null.
 * Never infers intensity from `completed`.
 */
export function toAssessmentIntensity(
  value: number | null | undefined,
): AssessmentIntensity {
  if (value === 1 || value === 2 || value === 3) return value;
  return null;
}

// ---------------------------------------------------------------------------
// Category score
// ---------------------------------------------------------------------------

/**
 * Performance score for a set of items from ONE category.
 *
 * Formula: average(non-null intensities) / 3 × 100
 * Returns null when no items have been assessed.
 * Unanswered items are excluded — NOT treated as zero.
 *
 * Note: this value is the raw performance score regardless of coverage.
 * Use isEligibleForScore to decide whether to show it.
 */
export function calculateCategoryScore(items: SelfCarePoint[]): number | null {
  const answered = items.filter((item) => item.intensity !== null);
  if (answered.length === 0) return null;

  const sum = answered.reduce(
    (acc, item) => acc + (item.intensity as number),
    0,
  );
  return (sum / answered.length / 3) * 100;
}

// ---------------------------------------------------------------------------
// Overall score (equal category weights, eligible only)
// ---------------------------------------------------------------------------

/**
 * Overall Self-Care Score computed from ELIGIBLE categories only.
 *
 * A category is eligible when it has >= ASSESSMENT_COVERAGE_THRESHOLD coverage.
 * Categories below the threshold are excluded — not penalised.
 * Returns null when no category is eligible.
 */
export function calculateOverallScore(
  categoryScores: CategoryScore[],
): number | null {
  const eligible = categoryScores.filter(
    (cs) => cs.isEligibleForScore && cs.score !== null,
  );
  if (eligible.length === 0) return null;
  const sum = eligible.reduce((acc, cs) => acc + (cs.score as number), 0);
  return sum / eligible.length;
}

// ---------------------------------------------------------------------------
// Progress helpers
// ---------------------------------------------------------------------------

export type AssessmentProgress = {
  assessed: number;
  total: number;
};

/** Across all items regardless of category */
export function getAssessmentProgress(
  items: SelfCarePoint[],
): AssessmentProgress {
  return {
    assessed: items.filter((item) => item.intensity !== null).length,
    total: items.length,
  };
}

/** For a single category */
export function getCategoryAssessmentProgress(
  items: SelfCarePoint[],
): AssessmentProgress {
  return getAssessmentProgress(items);
}

// ---------------------------------------------------------------------------
// Build full CategoryScore
// ---------------------------------------------------------------------------

function buildCategoryScore(
  category: DomainSlug,
  items: SelfCarePoint[],
): CategoryScore {
  const assessedCount = items.filter((i) => i.intensity !== null).length;
  const totalCount = items.length;
  const coveragePercentage = totalCount > 0 ? assessedCount / totalCount : 0;
  const isEligibleForScore = coveragePercentage >= ASSESSMENT_COVERAGE_THRESHOLD;
  const isComplete = totalCount > 0 && assessedCount === totalCount;
  const score = calculateCategoryScore(items);

  return {
    category,
    score,
    assessedCount,
    totalCount,
    coveragePercentage,
    isEligibleForScore,
    isComplete,
  };
}

// ---------------------------------------------------------------------------
// Build full state from flat item list
// ---------------------------------------------------------------------------

/**
 * Builds the complete SelfCareScoreState from a flat list of visible default
 * SelfCarePoints.
 */
export function buildSelfCareScoreState(
  items: SelfCarePoint[],
): SelfCareScoreState {
  const categoryScores: CategoryScore[] = DOMAIN_ORDER.map((category) => {
    const categoryItems = items.filter((item) => item.category === category);
    return buildCategoryScore(category, categoryItems);
  });

  const overallScore = calculateOverallScore(categoryScores);
  const eligibleCategoryCount = categoryScores.filter(
    (cs) => cs.isEligibleForScore,
  ).length;
  const completeCategoryCount = categoryScores.filter(
    (cs) => cs.isComplete,
  ).length;
  const totalAssessed = categoryScores.reduce(
    (acc, cs) => acc + cs.assessedCount,
    0,
  );
  const totalItems = categoryScores.reduce(
    (acc, cs) => acc + cs.totalCount,
    0,
  );
  const allCategoriesEligible =
    eligibleCategoryCount === DOMAIN_ORDER.length;
  const fullyAssessed = totalItems > 0 && totalAssessed === totalItems;
  const hasAnyData = totalAssessed > 0;

  return {
    overallScore,
    categoryScores,
    eligibleCategoryCount,
    completeCategoryCount,
    totalCategoryCount: DOMAIN_ORDER.length,
    totalAssessed,
    totalItems,
    allCategoriesEligible,
    fullyAssessed,
    hasAnyData,
  };
}

// ---------------------------------------------------------------------------
// Insight helpers
// ---------------------------------------------------------------------------

export type CategoryHighlight = {
  category: DomainSlug;
  score: number;
  /** Human label for the insight */
  label: "strongest area" | "area to nurture";
};

/**
 * Returns the highest scoring *eligible* category.
 * Tie-break: first in DOMAIN_ORDER wins.
 */
export function getHighestCategory(
  categoryScores: CategoryScore[],
): CategoryHighlight | null {
  const eligible = categoryScores.filter(
    (cs): cs is CategoryScore & { score: number } =>
      cs.isEligibleForScore && cs.score !== null,
  );
  if (eligible.length === 0) return null;

  const best = eligible.reduce((a, b) => (a.score >= b.score ? a : b));
  return { category: best.category, score: best.score, label: "strongest area" };
}

/**
 * Returns the lowest scoring *eligible* category.
 * Tie-break: first in DOMAIN_ORDER wins.
 */
export function getLowestCategory(
  categoryScores: CategoryScore[],
): CategoryHighlight | null {
  const eligible = categoryScores.filter(
    (cs): cs is CategoryScore & { score: number } =>
      cs.isEligibleForScore && cs.score !== null,
  );
  if (eligible.length === 0) return null;

  const worst = eligible.reduce((a, b) => (a.score <= b.score ? a : b));
  return {
    category: worst.category,
    score: worst.score,
    label: "area to nurture",
  };
}

// ---------------------------------------------------------------------------
// Trend
// ---------------------------------------------------------------------------

export type ScoreTrend = {
  delta: number; // positive = improvement, negative = decline
};

/**
 * Computes the delta between a current and previous score snapshot.
 * Returns null when no real previous data exists (show "Your baseline" instead).
 */
export function getScoreTrend(
  current: number | null,
  previous: number | null,
): ScoreTrend | null {
  if (current === null || previous === null) return null;
  return { delta: Math.round(current) - Math.round(previous) };
}
