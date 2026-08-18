export const categoriesKeys = {
  all: ["categories"] as const,
  detail: (id: string) => ["categories", id] as const,
  analytics: (id: string) => ["categories", id, "analytics"] as const,
  itemCounts: ["categories", "item-counts"] as const,
};
