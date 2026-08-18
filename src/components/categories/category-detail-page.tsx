"use client";

import Link from "next/link";
import { ArrowLeftIcon, PlusIcon } from "lucide-react";
import { useMemo, useState } from "react";

import { TodayCareList } from "@/components/dashboard/today-care-list";
import { CareIcon } from "@/components/icons/care-icon";
import { MiniMetricTile, ScoreRing } from "@/components/metrics";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  useCategory,
  useCategoryAnalytics,
} from "@/hooks/use-categories";
import { fetchCareItemsByCategory } from "@/lib/care/api";
import { getTodayDateString } from "@/lib/care/constants";
import type { CareIntensityLevel } from "@/constants/care";
import {
  useTodayCareItems,
  useSetCareIntensity,
  useUpsertCareRemark,
} from "@/hooks/use-dashboard";
import { typography } from "@/lib/typography";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";

type CategoryDetailPageProps = {
  categoryId: string;
};

export function CategoryDetailPage({ categoryId }: CategoryDetailPageProps) {
  const today = getTodayDateString();
  const { data: category, isLoading: categoryLoading } = useCategory(categoryId);
  const { data: analytics, isLoading: analyticsLoading } =
    useCategoryAnalytics(categoryId);
  const { data: items } = useQuery({
    queryKey: ["care-items", "category", categoryId],
    queryFn: () => fetchCareItemsByCategory(categoryId),
  });
  const { data: todayItems } = useTodayCareItems(today);
  const setIntensity = useSetCareIntensity(today);
  const saveRemark = useUpsertCareRemark(today);
  const [pendingItemId, setPendingItemId] = useState<string>();

  const categoryTodayItems = useMemo(() => {
    const ids = new Set((items ?? []).map((item) => item.id));
    return (todayItems ?? []).filter((item) => ids.has(item.id));
  }, [items, todayItems]);

  if (categoryLoading) {
    return <p className={typography.bodyMuted}>Loading category…</p>;
  }

  if (!category) {
    return <p className="text-destructive text-sm">Category not found.</p>;
  }

  return (
    <div className="space-y-6">
      <Link
        href="/categories"
        className={cn(
          typography.bodyText,
          "text-muted-foreground inline-flex items-center gap-1 hover:text-foreground",
        )}
      >
        <ArrowLeftIcon className="size-4" />
        Categories
      </Link>

      <div className="flex items-start gap-3">
        <CareIcon icon={category.icon} categoryName={category.name} />
        <div className="min-w-0 flex-1">
          <h1 className={typography.screenTitle}>{category.name}</h1>
          <p className={typography.screenSubtitle}>
            {(items?.length ?? 0)} items in this domain
          </p>
        </div>
        <Button size="sm" asChild>
          <Link href={`/create?category=${category.id}`}>
            <PlusIcon />
            Add
          </Link>
        </Button>
      </div>

      <Card className="py-4">
        <CardContent className="flex items-center gap-4">
          <ScoreRing score={analytics?.completion_rate ?? 0} size="md" />
          <div className="grid flex-1 grid-cols-2 gap-2">
            <MiniMetricTile
              metricKey="completionRate"
              value={`${analytics?.completion_rate ?? 0}%`}
              align="left"
              compact
            />
            <MiniMetricTile
              metricKey="stepsForward"
              value={analytics?.completed_days ?? 0}
              align="left"
              compact
            />
          </div>
        </CardContent>
      </Card>

      {analyticsLoading ? (
        <p className={typography.bodyMuted}>Loading analytics…</p>
      ) : null}

      <TodayCareList
        items={categoryTodayItems}
        pendingItemId={pendingItemId}
        onSetIntensity={async (itemId, intensity: CareIntensityLevel) => {
          setPendingItemId(itemId);
          try {
            await setIntensity.mutateAsync({ itemId, intensity });
          } finally {
            setPendingItemId(undefined);
          }
        }}
        onSaveRemark={(itemId, remark) => saveRemark.mutate({ itemId, remark })}
        showSectionTitle={false}
      />
    </div>
  );
}
