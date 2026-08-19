"use client";

import Link from "next/link";
import { PlusIcon } from "lucide-react";
import type { ReactNode } from "react";

import { CareFilterTabs } from "@/components/dashboard/care-filter-tabs";
import { Button } from "@/components/ui/button";
import type { CareFilterTab } from "@/constants/care";
import { cn } from "@/lib/utils";

type CarePanelProps = {
  homeTab: CareFilterTab;
  onTabChange: (tab: CareFilterTab) => void;
  tabCounts: Partial<Record<CareFilterTab, number>>;
  children: ReactNode;
  className?: string;
};

export function CarePanel({
  homeTab,
  onTabChange,
  tabCounts,
  children,
  className,
}: CarePanelProps) {
  return (
    <div className={cn("min-w-0 space-y-4", className)}>
      <div className="md:hidden">
        <CareFilterTabs
          variant="pills"
          value={homeTab}
          onChange={onTabChange}
          counts={tabCounts}
        />
      </div>

      <div className="hidden items-center gap-3 md:flex">
        <CareFilterTabs
          variant="pills"
          value={homeTab}
          onChange={onTabChange}
          counts={tabCounts}
          className="flex-1"
        />
        <Button className="shrink-0" size="sm" asChild>
          <Link href="/create">
            <PlusIcon />
            New item
          </Link>
        </Button>
      </div>

      {children}

      <div className="md:hidden">
        <Button className="w-full" asChild>
          <Link href="/create">
            <PlusIcon />
            New item
          </Link>
        </Button>
      </div>
    </div>
  );
}
