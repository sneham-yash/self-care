import type { DomainSlug, CareFilterTab } from "@/constants/care";

/**
 * Dashboard-only display mapping for the SUCHETA Self-Care Points section.
 * DB slugs (physical/social/emotional/spiritual/professional) are kept unchanged
 * so analytics RPCs and Insights continue to work. Only UI labels and colors differ.
 */

export type CarePointDomain = {
  slug: DomainSlug;
  label: string;
  /** CSS variable for the category color (background on filled elements) */
  colorVar: string;
  /** Tailwind inline style background for filled pills */
  bgStyle: string;
  /** Tailwind inline style for badge background (soft tint) */
  badgeBgStyle: string;
  /** Legacy classes still used in care-filter-tabs pill variant */
  bgLight: string;
  bgDark: string;
  textLight: string;
  textDark: string;
  borderLight: string;
  borderDark: string;
  badgeBgLight: string;
  badgeBgDark: string;
  badgeTextLight: string;
  badgeTextDark: string;
};

export const CARE_POINT_DOMAINS: CarePointDomain[] = [
  {
    slug: "physical",
    label: "Body",
    colorVar: "--category-body",
    bgStyle: "bg-[var(--category-body)]",
    badgeBgStyle: "bg-[color-mix(in_srgb,var(--category-body)_15%,transparent)]",
    bgLight: "bg-[var(--category-body)]",
    bgDark: "dark:bg-[var(--category-body)]",
    textLight: "text-white",
    textDark: "dark:text-white",
    borderLight: "border-[var(--category-body)]",
    borderDark: "dark:border-[var(--category-body)]",
    badgeBgLight: "bg-[color-mix(in_srgb,var(--category-body)_12%,white)]",
    badgeBgDark: "dark:bg-[color-mix(in_srgb,var(--category-body)_20%,black)]",
    badgeTextLight: "text-[var(--category-body)]",
    badgeTextDark: "dark:text-[var(--category-body)]",
  },
  {
    slug: "emotional",
    label: "Mind",
    colorVar: "--category-mind",
    bgStyle: "bg-[var(--category-mind)]",
    badgeBgStyle: "bg-[color-mix(in_srgb,var(--category-mind)_15%,transparent)]",
    bgLight: "bg-[var(--category-mind)]",
    bgDark: "dark:bg-[var(--category-mind)]",
    textLight: "text-white",
    textDark: "dark:text-white",
    borderLight: "border-[var(--category-mind)]",
    borderDark: "dark:border-[var(--category-mind)]",
    badgeBgLight: "bg-[color-mix(in_srgb,var(--category-mind)_12%,white)]",
    badgeBgDark: "dark:bg-[color-mix(in_srgb,var(--category-mind)_20%,black)]",
    badgeTextLight: "text-[var(--category-mind)]",
    badgeTextDark: "dark:text-[var(--category-mind)]",
  },
  {
    slug: "social",
    label: "People",
    colorVar: "--category-people",
    bgStyle: "bg-[var(--category-people)]",
    badgeBgStyle: "bg-[color-mix(in_srgb,var(--category-people)_15%,transparent)]",
    bgLight: "bg-[var(--category-people)]",
    bgDark: "dark:bg-[var(--category-people)]",
    textLight: "text-white",
    textDark: "dark:text-white",
    borderLight: "border-[var(--category-people)]",
    borderDark: "dark:border-[var(--category-people)]",
    badgeBgLight: "bg-[color-mix(in_srgb,var(--category-people)_12%,white)]",
    badgeBgDark: "dark:bg-[color-mix(in_srgb,var(--category-people)_20%,black)]",
    badgeTextLight: "text-[var(--category-people)]",
    badgeTextDark: "dark:text-[var(--category-people)]",
  },
  {
    slug: "spiritual",
    label: "Purpose",
    colorVar: "--category-purpose",
    bgStyle: "bg-[var(--category-purpose)]",
    badgeBgStyle: "bg-[color-mix(in_srgb,var(--category-purpose)_15%,transparent)]",
    bgLight: "bg-[var(--category-purpose)]",
    bgDark: "dark:bg-[var(--category-purpose)]",
    textLight: "text-white",
    textDark: "dark:text-white",
    borderLight: "border-[var(--category-purpose)]",
    borderDark: "dark:border-[var(--category-purpose)]",
    badgeBgLight: "bg-[color-mix(in_srgb,var(--category-purpose)_12%,white)]",
    badgeBgDark: "dark:bg-[color-mix(in_srgb,var(--category-purpose)_20%,black)]",
    badgeTextLight: "text-[var(--category-purpose)]",
    badgeTextDark: "dark:text-[var(--category-purpose)]",
  },
  {
    slug: "professional",
    label: "Work",
    colorVar: "--category-work",
    bgStyle: "bg-[var(--category-work)]",
    badgeBgStyle: "bg-[color-mix(in_srgb,var(--category-work)_15%,transparent)]",
    bgLight: "bg-[var(--category-work)]",
    bgDark: "dark:bg-[var(--category-work)]",
    textLight: "text-white",
    textDark: "dark:text-white",
    borderLight: "border-[var(--category-work)]",
    borderDark: "dark:border-[var(--category-work)]",
    badgeBgLight: "bg-[color-mix(in_srgb,var(--category-work)_12%,white)]",
    badgeBgDark: "dark:bg-[color-mix(in_srgb,var(--category-work)_20%,black)]",
    badgeTextLight: "text-[var(--category-work)]",
    badgeTextDark: "dark:text-[var(--category-work)]",
  },
];

const domainBySlug = new Map(CARE_POINT_DOMAINS.map((d) => [d.slug, d]));

export function getCarePointDomain(slug: string): CarePointDomain | undefined {
  return domainBySlug.get(slug as DomainSlug);
}

export function getCarePointLabel(slug: string): string {
  return domainBySlug.get(slug as DomainSlug)?.label ?? slug;
}

/** Pill tabs for the dashboard Self-Care Points section. */
export type CarePointTab = { value: CareFilterTab; label: string };

export const CARE_POINT_TABS: CarePointTab[] = [
  { value: "all", label: "All" },
  { value: "physical", label: "Body" },
  { value: "emotional", label: "Mind" },
  { value: "social", label: "People" },
  { value: "spiritual", label: "Purpose" },
  { value: "professional", label: "Work" },
];

/** SUCHETA intensity labels */
export const CARE_POINT_INTENSITY_LABELS: Record<1 | 2 | 3, string> = {
  1: "Rarely",
  2: "Sometimes",
  3: "Often",
};
