"use client";

import type { CareFilterTab } from "@/constants/care";
import { CARE_FILTER_TABS } from "@/constants/care";
import { typography } from "@/lib/typography";
import { cn } from "@/lib/utils";

type CareFilterTabsProps = {
  value: CareFilterTab;
  onChange: (value: CareFilterTab) => void;
  counts?: Partial<Record<CareFilterTab, number>>;
  className?: string;
};

function formatTabLabel(label: string, count: number | undefined): string {
  if (count !== undefined && count > 0) {
    return `${label} (${count})`;
  }
  return label;
}

export function CareFilterTabs({
  value,
  onChange,
  counts,
  className,
}: CareFilterTabsProps) {
  return (
    <div
      className={cn(
        "bg-muted/50 flex w-full min-w-0 gap-0.5 overflow-x-auto overscroll-x-contain rounded-xl border border-border/60 p-0.5",
        className,
      )}
      role="tablist"
      aria-label="Filter care items"
    >
      {CARE_FILTER_TABS.map((tab) => {
        const isActive = value === tab.value;
        const count = counts?.[tab.value];

        return (
          <button
            key={tab.value}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.value)}
            className={cn(
              typography.navLabel,
              "flex-1 rounded-lg px-2 py-2 text-sm whitespace-nowrap transition-colors md:py-1.5 md:text-xs",
              isActive
                ? "bg-background text-foreground shadow-sm ring-1 ring-primary/10"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {formatTabLabel(tab.label, count)}
          </button>
        );
      })}
    </div>
  );
}
