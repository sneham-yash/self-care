import type { CareFilterTab } from "@/constants/care";
import type { TodayCareItem } from "@/lib/care-logs/api";

export function filterItemsByTab(
  items: TodayCareItem[],
  tab: CareFilterTab,
): TodayCareItem[] {
  if (tab === "all") return items;
  return items.filter((item) => item.category_slug === tab);
}

export function getCareTabCounts(
  items: TodayCareItem[],
): Partial<Record<CareFilterTab, number>> {
  const counts: Partial<Record<CareFilterTab, number>> = {
    all: items.length,
  };

  for (const item of items) {
    const slug = item.category_slug as CareFilterTab;
    counts[slug] = (counts[slug] ?? 0) + 1;
  }

  return counts;
}
