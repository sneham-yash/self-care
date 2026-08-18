export type DomainSlug =
  | "physical"
  | "social"
  | "emotional"
  | "spiritual"
  | "professional";

export type CareFilterTab = "all" | DomainSlug;

export const DOMAIN_SLUGS: DomainSlug[] = [
  "physical",
  "social",
  "emotional",
  "spiritual",
  "professional",
];

export const DOMAIN_LABELS: Record<DomainSlug, string> = {
  physical: "Physical",
  social: "Social",
  emotional: "Emotional",
  spiritual: "Spiritual",
  professional: "Professional",
};

export const CARE_FILTER_TABS: { value: CareFilterTab; label: string }[] = [
  { value: "all", label: "All" },
  { value: "physical", label: "Physical" },
  { value: "social", label: "Social" },
  { value: "emotional", label: "Emotional" },
  { value: "spiritual", label: "Spiritual" },
  { value: "professional", label: "Work" },
];

export const CARE_INTENSITY_LEVELS = [1, 2, 3] as const;

export type CareIntensityLevel = (typeof CARE_INTENSITY_LEVELS)[number];
export type CareIntensity = 0 | CareIntensityLevel;

export const CARE_INTENSITY_LABELS: Record<CareIntensityLevel, string> = {
  1: "Rarely / poorly",
  2: "Sometimes / okay",
  3: "Often / well",
};

export function careIntensityLabel(intensity: CareIntensity): string | null {
  if (intensity === 0) return null;
  return CARE_INTENSITY_LABELS[intensity];
}

export function nextCareIntensity(
  current: CareIntensity,
  tapped: CareIntensityLevel,
): CareIntensity {
  return current === tapped ? 0 : tapped;
}

export function toCareIntensity(
  value: number | null | undefined,
  completed = false,
): CareIntensity {
  if (value === 1 || value === 2 || value === 3) return value;
  return completed ? 3 : 0;
}

export const SYSTEM_CATEGORY_IDS: Record<DomainSlug, string> = {
  physical: "11111111-1111-4111-8111-111111111111",
  social: "22222222-2222-4222-8222-222222222222",
  emotional: "33333333-3333-4333-8333-333333333333",
  spiritual: "44444444-4444-4444-8444-444444444444",
  professional: "55555555-5555-4555-8555-555555555555",
};
