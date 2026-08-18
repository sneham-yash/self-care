"use client";

import { pdf } from "@react-pdf/renderer";

import { APP_NAME } from "@/constants/brand";
import { careIntensityLabel, toCareIntensity } from "@/constants/care";
import { fetchReportItems } from "@/lib/care-logs/api";
import { isItemScheduled } from "@/lib/care/schedule";
import { calculateCareScore } from "@/lib/analytics/care-score";
import {
  CareReportDocument,
  type CareReportData,
  type ReportItemEntry,
  type ReportPeriod,
} from "@/lib/reports/document";

function datesInRange(start: string, end: string): string[] {
  const dates: string[] = [];
  let current = start;
  while (current <= end) {
    dates.push(current);
    const next = new Date(`${current}T12:00:00.000Z`);
    next.setUTCDate(next.getUTCDate() + 1);
    current = next.toISOString().split("T")[0]!;
  }
  return dates;
}

export async function buildCareReportData(
  period: ReportPeriod,
  startDate: string,
  endDate: string,
  displayName: string,
): Promise<CareReportData> {
  const { items, logs, categories } = await fetchReportItems(startDate, endDate);
  const dates = datesInRange(startDate, endDate);
  const categoryById = new Map(
    categories.map((category) => [category.id, category]),
  );

  const logsByItemDate = new Map(
    logs.map((log) => [`${log.item_id}:${log.log_date}`, log]),
  );

  const grouped = new Map<string, CareReportData["domains"][number]>();

  let scheduledTotal = 0;
  let completedTotal = 0;
  const domainRates: Record<string, { scheduled: number; completed: number }> =
    {};

  for (const item of items) {
    const category = categoryById.get(item.category_id);
    const domainName = category?.name ?? "Other";
    const slug = category?.slug ?? "other";
    if (!grouped.has(domainName)) {
      grouped.set(domainName, {
        name: domainName,
        completionRate: 0,
        items: [],
      });
    }

    let scheduledCount = 0;
    let completedCount = 0;
    const entries: ReportItemEntry[] = [];

    for (const date of dates) {
      if (!isItemScheduled(item, date)) continue;
      scheduledCount += 1;
      scheduledTotal += 1;
      domainRates[slug] ??= { scheduled: 0, completed: 0 };
      domainRates[slug].scheduled += 1;
      const log = logsByItemDate.get(`${item.id}:${date}`);
      if (log?.completed) {
        completedCount += 1;
        completedTotal += 1;
        domainRates[slug].completed += 1;
      }
      const intensityLabel = log
        ? careIntensityLabel(toCareIntensity(log.intensity, log.completed))
        : null;
      const remark = log?.remark?.trim() || null;
      if (intensityLabel || remark) {
        entries.push({
          date,
          intensityLabel,
          remark,
        });
      }
    }

    grouped.get(domainName)!.items.push({
      name: item.name,
      completedCount,
      scheduledCount,
      entries,
    });
  }

  for (const domain of grouped.values()) {
    const scheduled = domain.items.reduce(
      (sum, item) => sum + item.scheduledCount,
      0,
    );
    const completed = domain.items.reduce(
      (sum, item) => sum + item.completedCount,
      0,
    );
    domain.completionRate =
      scheduled === 0 ? 0 : Math.round((completed / scheduled) * 1000) / 10;
  }

  const rate = (slug: string) => {
    const entry = domainRates[slug];
    if (!entry || entry.scheduled === 0) return 0;
    return (entry.completed / entry.scheduled) * 100;
  };

  const overallRate =
    scheduledTotal === 0
      ? 0
      : Math.round((completedTotal / scheduledTotal) * 1000) / 10;

  const overallScore = calculateCareScore({
    completionRate: overallRate,
    currentStreak: 0,
    physicalRate: rate("physical"),
    socialRate: rate("social"),
    emotionalRate: rate("emotional"),
    spiritualRate: rate("spiritual"),
    professionalRate: rate("professional"),
    growthTrend: 0,
  });

  return {
    appName: APP_NAME,
    displayName,
    period,
    startDate,
    endDate,
    overallScore,
    overallRate,
    domains: [...grouped.values()],
  };
}

export async function downloadCareReportPdf(
  data: CareReportData,
): Promise<void> {
  const blob = await pdf(<CareReportDocument data={data} />).toBlob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `nourish-${data.period}-${data.startDate}.pdf`;
  link.click();
  URL.revokeObjectURL(url);
}
