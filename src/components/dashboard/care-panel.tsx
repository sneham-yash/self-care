"use client";

import Link from "next/link";
import { PlusIcon } from "lucide-react";
import type { ReactNode } from "react";

import { CareFilterTabs } from "@/components/dashboard/care-filter-tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
    <Card
      className={cn(
        "relative min-w-0 gap-0 rounded-2xl border-primary/15 py-0 shadow-sm shadow-primary/5",
        className,
      )}
    >
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl"
        aria-hidden
      >
        <div className="absolute -left-4 -top-4 size-24 rounded-full bg-primary/[0.04] blur-2xl" />
      </div>

      <CardContent className="relative min-w-0 space-y-4 px-4 py-4">
        <div className="md:hidden">
          <CareFilterTabs
            value={homeTab}
            onChange={onTabChange}
            counts={tabCounts}
          />
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <CareFilterTabs
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
      </CardContent>
    </Card>
  );
}
