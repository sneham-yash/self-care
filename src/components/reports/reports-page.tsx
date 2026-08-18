"use client";

import { DownloadIcon } from "lucide-react";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getIsoWeekRange, getMonthRange } from "@/lib/dates";
import { getTodayDateString } from "@/lib/care/constants";
import {
  buildCareReportData,
  downloadCareReportPdf,
} from "@/lib/reports/api";
import type { ReportPeriod } from "@/lib/reports/document";
import { typography } from "@/lib/typography";
import { cn } from "@/lib/utils";

const PERIODS: { value: ReportPeriod; label: string }[] = [
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
];

type ReportsPageProps = {
  displayName?: string | null;
};

export function ReportsPage({ displayName }: ReportsPageProps) {
  const today = getTodayDateString();
  const [period, setPeriod] = useState<ReportPeriod>("daily");
  const [anchorDate, setAnchorDate] = useState(today);
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const range = useMemo(() => {
    if (period === "daily") {
      return { start: anchorDate, end: anchorDate };
    }
    if (period === "weekly") {
      return getIsoWeekRange(anchorDate);
    }
    return getMonthRange(anchorDate);
  }, [period, anchorDate]);

  async function handleDownload() {
    setIsDownloading(true);
    setError(null);
    try {
      const data = await buildCareReportData(
        period,
        range.start,
        range.end,
        displayName || "You",
      );
      await downloadCareReportPdf(data);
    } catch (downloadError) {
      setError(
        downloadError instanceof Error
          ? downloadError.message
          : "Failed to generate the PDF.",
      );
    } finally {
      setIsDownloading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className={typography.screenTitle}>Reports</h1>
        <p className={typography.screenSubtitle}>
          Download a PDF of your daily, weekly, or monthly self-care check-ins.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Choose a period</CardTitle>
          <CardDescription>
            Weekly reports use Monday–Sunday. Monthly reports use the calendar
            month.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {PERIODS.map((option) => (
              <Button
                key={option.value}
                type="button"
                variant={period === option.value ? "default" : "outline"}
                size="sm"
                onClick={() => setPeriod(option.value)}
              >
                {option.label}
              </Button>
            ))}
          </div>

          <div className="space-y-2">
            <Label htmlFor="report-date">
              {period === "daily"
                ? "Date"
                : period === "weekly"
                  ? "Any day in the week"
                  : "Any day in the month"}
            </Label>
            <Input
              id="report-date"
              type="date"
              max={getTodayDateString()}
              value={anchorDate}
              onChange={(event) => setAnchorDate(event.target.value)}
            />
          </div>

          <p className={cn(typography.bodyMuted, "text-sm")}>
            Range: {range.start} → {range.end}
          </p>

          <Button
            type="button"
            className="w-full"
            onClick={handleDownload}
            disabled={isDownloading}
          >
            <DownloadIcon />
            {isDownloading ? "Preparing PDF…" : "Download PDF"}
          </Button>

          {error ? (
            <p className="text-destructive text-sm" role="alert">
              {error}
            </p>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
