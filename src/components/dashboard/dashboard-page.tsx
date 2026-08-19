"use client";

import Link from "next/link";
import { PlusIcon } from "lucide-react";
import { useMemo, useState } from "react";

import { CarePanel } from "@/components/dashboard/care-panel";
import { HomeHeader } from "@/components/dashboard/home-header";
import { SelfCarePointList } from "@/components/dashboard/self-care-point-list";
import { SelfCareScoreCard } from "@/components/dashboard/self-care-score-card";
import { TodayProgress } from "@/components/dashboard/today-progress";
import { WeekCalendarStrip } from "@/components/dashboard/week-calendar-strip";
import { Button } from "@/components/ui/button";
import type { CareIntensityLevel } from "@/constants/care";
import { formatTodayLabel } from "@/lib/dates";
import { filterItemsByTab, getCareTabCounts } from "@/lib/care/filter";
import { formatStreakDays } from "@/lib/analytics/care-score";
import { typography } from "@/lib/typography";
import { cn } from "@/lib/utils";
import { useInsights } from "@/hooks/use-insights";
import { useCareItems } from "@/hooks/use-care-items";
import { useSelfCareScore, useSetWantsImprovement } from "@/hooks/use-self-care-score";
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
  const { data: selfCareScoreData } = useSelfCareScore();
  const setWantsImprovement = useSetWantsImprovement();

  const flagsByItemId = useMemo(() => {
    const map = new Map<string, boolean>();
    selfCareScoreData?.points.forEach((p) => {
      map.set(p.id, p.wantsImprovement);
    });
    return map;
  }, [selfCareScoreData]);

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

  const currentStreak = insightsData?.insights.currentStreak ?? 0;
  const stepsForward = insightsData?.insights.stepsForward ?? 0;

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

  const calendarStrip = (
    <WeekCalendarStrip
      selectedDate={selectedDate}
      onSelectDate={setSelectedDate}
    />
  );

  const emptyState =
    !isLoading && !itemsLoading && !error && !hasAnyItems ? (
      <div className="rounded-2xl border border-dashed border-border/60 p-8 text-center space-y-3">
        <p className={cn(typography.sectionTitle, "text-base")}>Your journey starts here</p>
        <p className={cn(typography.bodyMuted, "text-sm")}>
          Choose something you&apos;d like to nurture. Small, consistent acts of care
          add up over time.
        </p>
        <Button className="mt-2" asChild>
          <Link href="/create">
            <PlusIcon />
            Add Practice
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
      <div className="rounded-2xl border border-dashed border-border/60 p-6 text-center space-y-1">
        <p className={cn(typography.sectionTitle, "text-base")}>Nothing here yet</p>
        <p className={cn(typography.bodyMuted, "text-sm")}>
          No items in this area today. Every beginning is a seed.
        </p>
      </div>
    ) : null;

  const itemList =
    !isLoading && !itemsLoading && !error && filteredCount > 0 ? (
      <SelfCarePointList
        items={filteredItems}
        pendingItemId={pendingItemId}
        flagsByItemId={flagsByItemId}
        onSetIntensity={handleSetIntensity}
        onSaveRemark={(itemId, remark) =>
          saveRemark.mutate({ itemId, remark })
        }
        onToggleImprovement={(itemId, current) =>
          setWantsImprovement.mutate({ itemId, wantsImprovement: !current })
        }
      />
    ) : null;

  return (
    <div className="min-w-0 space-y-4">
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

      {/* Self-Care Score card — full width, the single headline number */}
      {hasAnyItems && !isLoading && !itemsLoading && !error && selfCareScoreData ? (
        <SelfCareScoreCard
          state={selfCareScoreData.state}
          previousState={selfCareScoreData.previousState}
        />
      ) : null}

      {hasAnyItems && !isLoading && !itemsLoading && !error ? (
        <div className="grid min-w-0 gap-4 md:grid-cols-12 md:items-start md:gap-5 lg:gap-6">
          {/* Left column: today's progress + streak + calendar (mobile) */}
          <div className="min-w-0 space-y-3 md:col-span-5 lg:col-span-4">
            <TodayProgress
              completedCount={allCompletedCount}
              totalCount={allTotalCount}
            />
            {currentStreak > 0 ? (
              <p className="text-xs text-muted-foreground">
                {formatStreakDays(currentStreak)} streak
                {stepsForward > 0 ? ` · ${stepsForward} steps forward` : ""}
              </p>
            ) : null}
            <div className="md:hidden">{calendarStrip}</div>
          </div>

          {/* Right column: calendar (desktop) + filters + item list */}
          <div className="min-w-0 space-y-4 md:col-span-7 lg:col-span-8">
            <div className="hidden md:block">{calendarStrip}</div>
            <CarePanel
              homeTab={homeTab}
              onTabChange={setHomeTab}
              tabCounts={tabCounts}
            >
              {filterEmptyState}
              {/* Anchor for "Start Assessment" CTA */}
              <div id="self-care-points" />
              {itemList}
            </CarePanel>
          </div>
        </div>
      ) : null}
    </div>
  );
}
