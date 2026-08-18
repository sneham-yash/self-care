import type { IconName, IconTone } from "@/constants/icons";
import type { DomainSlug } from "@/constants/care";

export type CategoryDefault = {
  name: string;
  slug: DomainSlug;
  icon: IconName;
  tone: IconTone;
};

export const DEFAULT_DOMAINS: CategoryDefault[] = [
  { name: "Physical", slug: "physical", icon: "heart-pulse", tone: "rose" },
  { name: "Social", slug: "social", icon: "users", tone: "sky" },
  { name: "Emotional", slug: "emotional", icon: "brain", tone: "violet" },
  { name: "Spiritual", slug: "spiritual", icon: "leaf", tone: "emerald" },
  { name: "Professional", slug: "professional", icon: "briefcase", tone: "amber" },
];

const categoryLookup = new Map<string, CategoryDefault>();

for (const category of DEFAULT_DOMAINS) {
  categoryLookup.set(category.name.toLowerCase(), category);
  categoryLookup.set(category.slug, category);
}

export function getCategoryVisuals(
  name: string,
  icon?: string | null,
): { iconName: IconName; tone: IconTone } {
  const match =
    categoryLookup.get(name.toLowerCase()) ??
    categoryLookup.get(name.toLowerCase().replace(/\s+/g, "-"));

  if (icon && icon.length > 0) {
    return {
      iconName: icon as IconName,
      tone: match?.tone ?? "orange",
    };
  }

  if (match) {
    return { iconName: match.icon, tone: match.tone };
  }

  return { iconName: "sparkles", tone: "orange" };
}

export function slugifyCategoryName(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
