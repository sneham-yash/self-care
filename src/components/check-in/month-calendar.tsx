"use client";

import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  formatDayNumber,
  formatMonthLabel,
  getMonthGrid,
  isFutureDate,
} from "@/lib/dates";
import { getTodayDateString } from "@/lib/care/constants";
import { typography } from "@/lib/typography";
import { cn } from "@/lib/utils";
import type { CalendarDay } from "@/lib/care-logs/api";

type MonthCalendarProps = {
  selectedDate: string;
  onSelectDate: (date: string) => void;
  days?: CalendarDay[];
};

const WEEKDAYS = ["M", "T", "W", "T", "F", "S", "S"];

export function MonthCalendar({
  selectedDate,
  onSelectDate,
  days,
}: MonthCalendarProps) {
  const today = getTodayDateString();
  const selected = new Date(`${selectedDate}T12:00:00.000Z`);
  const year = selected.getUTCFullYear();
  const month = selected.getUTCMonth() + 1;
  const grid = getMonthGrid(year, month);
  const dayMap = new Map((days ?? []).map((day) => [day.calendar_date, day]));

  function shiftMonth(delta: number) {
    const next = new Date(Date.UTC(year, month - 1 + delta, 1));
    const nextDate = next.toISOString().split("T")[0]!;
    onSelectDate(nextDate > today ? today : nextDate);
  }

  return (
    <div className="rounded-xl border border-border/60 bg-card/50 p-3">
      <div className="mb-3 flex items-center justify-between">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => shiftMonth(-1)}
          aria-label="Previous month"
        >
          <ChevronLeftIcon className="size-4" />
        </Button>
        <p className={cn(typography.sectionTitle, "text-base")}>
          {formatMonthLabel(selectedDate)}
        </p>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => shiftMonth(1)}
          aria-label="Next month"
        >
          <ChevronRightIcon className="size-4" />
        </Button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center">
        {WEEKDAYS.map((label, index) => (
          <span
            key={`${label}-${index}`}
            className={cn(typography.metricLabel, "py-1 text-[10px]")}
          >
            {label}
          </span>
        ))}
        {grid.map((date, index) => {
          if (!date) {
            return <span key={`empty-${index}`} />;
          }

          const isSelected = date === selectedDate;
          const isFuture = isFutureDate(date, today);
          const isToday = date === today;
          const stats = dayMap.get(date);
          const rate = stats?.completion_rate ?? 0;

          return (
            <button
              key={date}
              type="button"
              disabled={isFuture}
              onClick={() => onSelectDate(date)}
              className={cn(
                "flex flex-col items-center rounded-lg py-1.5 text-sm transition-colors",
                isSelected
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted",
                isFuture && "cursor-not-allowed opacity-40",
                !isSelected && isToday && "ring-primary/40 ring-1",
              )}
              aria-pressed={isSelected}
            >
              <span className="font-medium">{formatDayNumber(date)}</span>
              <span
                className={cn(
                  "mt-0.5 size-1.5 rounded-full",
                  rate >= 70
                    ? isSelected
                      ? "bg-primary-foreground"
                      : "bg-emerald-500"
                    : rate > 0
                      ? isSelected
                        ? "bg-primary-foreground/70"
                        : "bg-primary/60"
                      : "bg-transparent",
                )}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
