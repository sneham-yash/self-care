"use client";

import type { CareFilterTab } from "@/constants/care";
import { CARE_FILTER_TABS } from "@/constants/care";
import {
  CARE_POINT_DOMAINS,
  CARE_POINT_TABS,
} from "@/constants/care-points";
import { typography } from "@/lib/typography";
import { cn } from "@/lib/utils";

type CareFilterTabsProps = {
  value: CareFilterTab;
  onChange: (value: CareFilterTab) => void;
  counts?: Partial<Record<CareFilterTab, number>>;
  className?: string;
  /** "pills" = SUCHETA dashboard style; default = existing segmented-control style */
  variant?: "default" | "pills";
};

function formatTabLabel(label: string, count: number | undefined): string {
  if (count !== undefined && count > 0) {
    return `${label} (${count})`;
  }
  return label;
}

const domainColors = new Map(CARE_POINT_DOMAINS.map((d) => [d.slug, d]));

export function CareFilterTabs({
  value,
  onChange,
  counts,
  className,
  variant = "default",
}: CareFilterTabsProps) {
  if (variant === "pills") {
    return (
      <div
        className={cn(
          "flex w-full min-w-0 gap-2 overflow-x-auto overscroll-x-contain pb-0.5",
          className,
        )}
        role="tablist"
        aria-label="Filter self-care points"
      >
        {CARE_POINT_TABS.map((tab) => {
          const isActive = value === tab.value;
          const count = counts?.[tab.value];
          const domain = tab.value !== "all" ? domainColors.get(tab.value) : undefined;

          let activeClasses = "bg-foreground text-background";
          let inactiveClasses = "border border-border text-muted-foreground hover:text-foreground hover:border-foreground/40";

          if (domain) {
            activeClasses = cn(domain.bgLight, domain.bgDark, domain.textLight, domain.textDark);
            inactiveClasses = cn(
              "border",
              domain.borderLight,
              domain.borderDark,
              "text-muted-foreground hover:text-foreground",
            );
          }

          return (
            <button
              key={tab.value}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => onChange(tab.value)}
              className={cn(
                "shrink-0 rounded-full px-3.5 py-1.5 text-sm font-medium whitespace-nowrap transition-all",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
                isActive ? activeClasses : inactiveClasses,
              )}
            >
              {formatTabLabel(tab.label, count)}
            </button>
          );
        })}
      </div>
    );
  }

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
