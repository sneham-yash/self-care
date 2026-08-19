"use client";

import Link from "next/link";
import { PlusIcon } from "lucide-react";
import { useMemo, useState } from "react";

import { MonthCalendar } from "@/components/check-in/month-calendar";
import { CareFilterTabs } from "@/components/dashboard/care-filter-tabs";
import { TodayProgress } from "@/components/dashboard/today-progress";
import { SelfCarePointList } from "@/components/dashboard/self-care-point-list";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { filterItemsByTab, getCareTabCounts } from "@/lib/care/filter";
import type { CareIntensityLevel } from "@/constants/care";
import { typography } from "@/lib/typography";
import { cn } from "@/lib/utils";
import {
  useCareCalendar,
  useTodayCareItems,
  useSetCareIntensity,
  useUpsertCareRemark,
} from "@/hooks/use-dashboard";
import { useCareItems } from "@/hooks/use-care-items";
import { useUiStore } from "@/stores/ui-store";

export function CheckInView() {
  const homeTab = useUiStore((s) => s.homeTab);
  const setHomeTab = useUiStore((s) => s.setHomeTab);
  const selectedDate = useUiStore((s) => s.selectedDate);
  const setSelectedDate = useUiStore((s) => s.setSelectedDate);
  const { data: allItems, isLoading: itemsLoading } = useCareItems();
  const { data: todayItems, isLoading, error } = useTodayCareItems(selectedDate);
  const setIntensity = useSetCareIntensity(selectedDate);
  const saveRemark = useUpsertCareRemark(selectedDate);
  const [pendingItemId, setPendingItemId] = useState<string>();

  const selected = new Date(`${selectedDate}T12:00:00.000Z`);
  const { data: calendarDays } = useCareCalendar(
    selected.getUTCFullYear(),
    selected.getUTCMonth() + 1,
  );

  const allToday = useMemo(() => todayItems ?? [], [todayItems]);
  const filteredItems = useMemo(
    () => filterItemsByTab(allToday, homeTab),
    [allToday, homeTab],
  );
  const tabCounts = useMemo(() => getCareTabCounts(allToday), [allToday]);
  const hasAnyItems = (allItems?.length ?? 0) > 0;
  const completedAll = allToday.filter((item) => item.completed).length;

  async function handleSetIntensity(
    itemId: string,
    intensity: CareIntensityLevel,
  ) {
    setPendingItemId(itemId);
    try {
      await setIntensity.mutateAsync({ itemId, intensity });
    } finally {
      setPendingItemId(undefined);
    }
  }

  return (
    <div className="space-y-6">
      {isLoading || itemsLoading ? (
        <p className="text-muted-foreground text-sm">Loading check-in…</p>
      ) : null}

      {error ? (
        <p className="text-destructive text-sm" role="alert">
          {error.message}
        </p>
      ) : null}

      {!isLoading && !itemsLoading && !error && !hasAnyItems ? (
        <div className="rounded-2xl border border-dashed border-border/60 p-8 text-center space-y-3">
          <p className={cn(typography.sectionTitle, "text-base")}>Your journey starts here</p>
          <p className={cn(typography.bodyMuted, "text-sm")}>
            Choose something you&apos;d like to nurture. Small acts of care make a difference.
          </p>
          <Button className="mt-2" asChild>
            <Link href="/create">
              <PlusIcon />
              Add Practice
            </Link>
          </Button>
        </div>
      ) : null}

      {hasAnyItems ? (
        <>
          <Card className="border-primary/15 bg-linear-to-br from-primary/4 to-card gap-0 py-0">
            <CardContent className="space-y-4 p-4 md:p-5">
              <MonthCalendar
                selectedDate={selectedDate}
                onSelectDate={setSelectedDate}
                days={calendarDays}
              />
              <TodayProgress
                completedCount={completedAll}
                totalCount={allToday.length}
                compact
              />
            </CardContent>
          </Card>

          <CareFilterTabs
            variant="pills"
            value={homeTab}
            onChange={setHomeTab}
            counts={tabCounts}
          />

          {filteredItems.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border/60 p-6 text-center space-y-1">
              <p className={cn(typography.sectionTitle, "text-base")}>Nothing here yet</p>
              <p className={cn(typography.bodyMuted, "text-sm")}>No items in this area today.</p>
            </div>
          ) : (
            <SelfCarePointList
              items={filteredItems}
              pendingItemId={pendingItemId}
              onSetIntensity={handleSetIntensity}
              onSaveRemark={(itemId, remark) =>
                saveRemark.mutate({ itemId, remark })
              }
            />
          )}

          <Button className="w-full md:w-auto" asChild>
            <Link href="/create">
              <PlusIcon />
              New item
            </Link>
          </Button>
        </>
      ) : null}
    </div>
  );
}
