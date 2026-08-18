"use client";

import { MessageSquareTextIcon, SaveIcon } from "lucide-react";
import { useMemo, useState } from "react";

import {
  CareIntensityColumnLabels,
  CareIntensityPicker,
  careListActionsClassName,
  careListGridClassName,
  careListHeaderClassName,
} from "@/components/care/care-intensity-picker";
import { CareIcon } from "@/components/icons/care-icon";
import { Textarea } from "@/components/ui/textarea";
import {
  careIntensityLabel,
  DOMAIN_SLUGS,
  type CareIntensityLevel,
  type DomainSlug,
} from "@/constants/care";
import { getCategoryVisuals } from "@/constants/categories";
import { ICON_TONE_CLASSES } from "@/constants/icons";
import type { TodayCareItem } from "@/lib/care-logs/api";
import { typography } from "@/lib/typography";
import { cn } from "@/lib/utils";

type TodayCareListProps = {
  items: TodayCareItem[];
  pendingItemId?: string;
  onSetIntensity: (itemId: string, intensity: CareIntensityLevel) => void;
  onSaveRemark: (itemId: string, remark: string) => void;
  showSectionTitle?: boolean;
  className?: string;
  layout?: "default" | "compact";
};

type CategoryGroup = {
  categoryId: string;
  categoryName: string;
  categorySlug: string;
  items: TodayCareItem[];
};

function groupItemsByCategory(items: TodayCareItem[]): CategoryGroup[] {
  const groups = new Map<string, TodayCareItem[]>();

  for (const item of items) {
    const existing = groups.get(item.category_id);
    if (existing) {
      existing.push(item);
    } else {
      groups.set(item.category_id, [item]);
    }
  }

  const domainOrder = new Map(
    DOMAIN_SLUGS.map((slug, index) => [slug, index]),
  );

  return [...groups.entries()]
    .map(([categoryId, groupItems]) => ({
      categoryId,
      categoryName: groupItems[0]?.category_name ?? "Care",
      categorySlug: groupItems[0]?.category_slug ?? "physical",
      items: groupItems,
    }))
    .sort((a, b) => {
      const aOrder = domainOrder.get(a.categorySlug as DomainSlug) ?? 100;
      const bOrder = domainOrder.get(b.categorySlug as DomainSlug) ?? 100;
      if (aOrder !== bOrder) return aOrder - bOrder;
      return a.categoryName.localeCompare(b.categoryName);
    });
}

export function TodayCareList({
  items,
  pendingItemId,
  onSetIntensity,
  onSaveRemark,
  showSectionTitle = true,
  className,
  layout = "default",
}: TodayCareListProps) {
  const isCompact = layout === "compact";
  const [openRemarkId, setOpenRemarkId] = useState<string>();
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const groups = useMemo(() => groupItemsByCategory(items), [items]);

  return (
    <section className="space-y-3">
      {showSectionTitle ? (
        <h2 className={typography.sectionTitle}>Today&apos;s care</h2>
      ) : null}
      <div className={cn("min-w-0 space-y-4", className)}>
        {groups.map((group) => {
          const visuals = getCategoryVisuals(group.categoryName);
          const tone = ICON_TONE_CLASSES[visuals.tone];

          return (
            <section
              key={group.categoryId}
              className="min-w-0 overflow-hidden rounded-xl border bg-card"
            >
              <div
                className={cn(
                  careListHeaderClassName(),
                  isCompact ? "px-3 py-2" : "px-4 py-2.5",
                  tone.bg,
                  tone.text,
                )}
              >
                <h3 className="min-w-0 truncate font-display text-sm font-semibold">
                  {group.categoryName}
                </h3>
                <span className="hidden md:block" aria-hidden />
                <CareIntensityColumnLabels />
              </div>

              <div className="divide-y">
                {group.items.map((item) => {
                  const isPending = pendingItemId === item.id;
                  const isRemarkOpen = openRemarkId === item.id;
                  const draft = drafts[item.id] ?? item.remark ?? "";
                  const statusLabel =
                    careIntensityLabel(item.intensity) ??
                    (item.remark ? "Remark saved" : null);

                  return (
                    <div
                      key={item.id}
                      className={cn(
                        isCompact ? "px-3 py-2" : "px-4 py-2.5",
                      )}
                    >
                      <div className={careListGridClassName()}>
                        <div className="flex min-h-8 min-w-0 items-center gap-2.5">
                          <CareIcon
                            icon={item.icon}
                            categoryName={item.category_name}
                            size="sm"
                            className="shrink-0"
                          />
                          <div className="min-w-0 flex-1">
                            <p
                              className="text-sm leading-snug font-semibold break-words"
                              title={item.name}
                            >
                              {item.name}
                            </p>
                            {statusLabel ? (
                              <p className="text-muted-foreground mt-0.5 text-xs leading-tight">
                                {statusLabel}
                              </p>
                            ) : null}
                          </div>
                        </div>

                        <div className={careListActionsClassName()}>
                          <button
                            type="button"
                            disabled={isPending}
                            onClick={() => {
                              if (isRemarkOpen) {
                                onSaveRemark(item.id, draft);
                                setOpenRemarkId(undefined);
                                return;
                              }
                              setOpenRemarkId(item.id);
                            }}
                            className={cn(
                              "flex size-8 shrink-0 items-center justify-center rounded-[5px] border transition-colors",
                              "focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:outline-none",
                              isRemarkOpen
                                ? "border-primary bg-primary text-primary-foreground shadow-sm shadow-primary/20"
                                : item.remark
                                  ? "border-primary/40 bg-primary/8 text-primary"
                                  : "border-input bg-background text-muted-foreground hover:border-primary/55 hover:text-foreground",
                            )}
                            aria-label={
                              isRemarkOpen
                                ? `Save remark for ${item.name}`
                                : `Add remark for ${item.name}`
                            }
                            aria-expanded={isRemarkOpen}
                          >
                            {isRemarkOpen ? (
                              <SaveIcon className="size-3.5" />
                            ) : (
                              <MessageSquareTextIcon className="size-3.5" />
                            )}
                          </button>

                          <CareIntensityPicker
                            value={item.intensity}
                            disabled={isPending}
                            itemName={item.name}
                            onChange={(level) => onSetIntensity(item.id, level)}
                          />
                        </div>
                      </div>

                      {isRemarkOpen ? (
                        <Textarea
                          value={draft}
                          rows={2}
                          placeholder="Optional remark"
                          onChange={(event) =>
                            setDrafts((current) => ({
                              ...current,
                              [item.id]: event.target.value,
                            }))
                          }
                          onBlur={() => onSaveRemark(item.id, draft)}
                          className="mt-2 min-h-16"
                        />
                      ) : null}
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </section>
  );
}
