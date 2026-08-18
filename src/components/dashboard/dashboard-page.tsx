"use client";

import Link from "next/link";
import { PlusIcon } from "lucide-react";
import { useMemo, useState } from "react";

import { CarePanel } from "@/components/dashboard/care-panel";
import { CareHeroCard } from "@/components/dashboard/care-hero-card";
import { HomeHeader } from "@/components/dashboard/home-header";
import { TodayCareList } from "@/components/dashboard/today-care-list";
import { WeekCalendarStrip } from "@/components/dashboard/week-calendar-strip";
import { Button } from "@/components/ui/button";
import type { CareIntensityLevel } from "@/constants/care";
import { calculateCareScore } from "@/lib/analytics/care-score";
import { formatTodayLabel } from "@/lib/dates";
import { filterItemsByTab, getCareTabCounts } from "@/lib/care/filter";
import { typography } from "@/lib/typography";
import { cn } from "@/lib/utils";
import { useInsights } from "@/hooks/use-insights";
import { useCareItems } from "@/hooks/use-care-items";
import {
  useTodayCareItems,
  useSetCareIntensity,
  useUpsertCareRemark,
} from "@/hooks/use-dashboard";
import { useUiStore } from "@/stores/ui-store";

type DashboardPageProps = {
  displayName?: string | null;
};

export function DashboardPage({ displayName }: DashboardPageProps) {
  const homeTab = useUiStore((s) => s.homeTab);
  const setHomeTab = useUiStore((s) => s.setHomeTab);
  const selectedDate = useUiStore((s) => s.selectedDate);
  const setSelectedDate = useUiStore((s) => s.setSelectedDate);
  const { data: allItems, isLoading: itemsLoading } = useCareItems();
  const { data: todayItems, isLoading, error } = useTodayCareItems(selectedDate);
  const { data: insightsData } = useInsights();
  const setIntensity = useSetCareIntensity(selectedDate);
  const saveRemark = useUpsertCareRemark(selectedDate);
  const [pendingItemId, setPendingItemId] = useState<string>();

  const filteredItems = useMemo(
    () => filterItemsByTab(todayItems ?? [], homeTab),
    [todayItems, homeTab],
  );

  const allToday = useMemo(() => todayItems ?? [], [todayItems]);
  const allCompletedCount = allToday.filter((item) => item.completed).length;
  const allTotalCount = allToday.length;
  const filteredCount = filteredItems.length;
  const hasAnyItems = (allItems?.length ?? 0) > 0;
  const tabCounts = useMemo(() => getCareTabCounts(allToday), [allToday]);

  const todayCareScore = useMemo(() => {
    if (insightsData?.insights) return insightsData.insights.careScore;
    const rate =
      allToday.length === 0
        ? 0
        : (allToday.filter((item) => item.completed).length / allToday.length) *
          100;
    return calculateCareScore({
      completionRate: rate,
      currentStreak: 0,
      physicalRate: rate,
      socialRate: rate,
      emotionalRate: rate,
      spiritualRate: rate,
      professionalRate: rate,
      growthTrend: 0,
    });
  }, [allToday, insightsData]);

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

  const heroCard =
    hasAnyItems && !isLoading && !itemsLoading && !error ? (
      <CareHeroCard
        careScore={todayCareScore}
        transformation={insightsData?.insights.transformation ?? 0}
        currentStreak={insightsData?.insights.currentStreak ?? 0}
        stepsForward={insightsData?.insights.stepsForward ?? 0}
        completedCount={allCompletedCount}
        totalCount={allTotalCount}
      />
    ) : null;

  const calendarStrip = (
    <WeekCalendarStrip
      selectedDate={selectedDate}
      onSelectDate={setSelectedDate}
    />
  );

  const emptyState =
    !isLoading && !itemsLoading && !error && !hasAnyItems ? (
      <div className="rounded-xl border border-dashed p-8 text-center">
        <p className={typography.bodyText}>Your checklist is ready</p>
        <p className={cn(typography.bodyMuted, "mt-1")}>
          Default self-care items should appear after you sign in. Add your own
          anytime.
        </p>
        <Button className="mt-4" asChild>
          <Link href="/create">
            <PlusIcon />
            Create item
          </Link>
        </Button>
      </div>
    ) : null;

  const filterEmptyState =
    !isLoading &&
    !itemsLoading &&
    !error &&
    hasAnyItems &&
    filteredCount === 0 ? (
      <div className="rounded-xl border border-dashed p-6 text-center">
        <p className={typography.bodyText}>Nothing in this view today</p>
        <p className={cn(typography.bodyMuted, "mt-1")}>
          No items scheduled for this domain today.
        </p>
      </div>
    ) : null;

  const itemList =
    !isLoading && !itemsLoading && !error && filteredCount > 0 ? (
      <TodayCareList
        items={filteredItems}
        pendingItemId={pendingItemId}
        onSetIntensity={handleSetIntensity}
        onSaveRemark={(itemId, remark) =>
          saveRemark.mutate({ itemId, remark })
        }
        layout="compact"
        showSectionTitle={false}
      />
    ) : null;

  return (
    <div className="min-w-0 space-y-4 md:space-y-0">
      <HomeHeader
        displayName={displayName}
        dateLabel={formatTodayLabel(selectedDate)}
        className="md:hidden"
      />

      {isLoading || itemsLoading ? (
        <p className="text-muted-foreground text-sm">
          Loading today&apos;s care…
        </p>
      ) : null}

      {error ? (
        <p className="text-destructive text-sm" role="alert">
          {error.message}
        </p>
      ) : null}

      {emptyState}

      {hasAnyItems && !isLoading && !itemsLoading && !error ? (
        <div className="grid min-w-0 gap-4 md:grid-cols-12 md:items-start md:gap-5 lg:gap-6">
          <div className="min-w-0 space-y-4 md:col-span-5 lg:col-span-4">
            {heroCard}
            <div className="md:hidden">{calendarStrip}</div>
          </div>

          <div className="min-w-0 space-y-4 md:col-span-7 lg:col-span-8">
            <div className="hidden md:block">{calendarStrip}</div>
            <CarePanel
              homeTab={homeTab}
              onTabChange={setHomeTab}
              tabCounts={tabCounts}
            >
              {filterEmptyState}
              {itemList}
            </CarePanel>
          </div>
        </div>
      ) : null}
    </div>
  );
}
