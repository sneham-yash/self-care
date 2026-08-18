"use client";

import { useEffect, useRef, type RefObject } from "react";
import {
  formatDayNumber,
  formatTodayLabel,
  formatWeekdayLetter,
  getWeekDaysAround,
  isFutureDate,
} from "@/lib/dates";
import { getTodayDateString } from "@/lib/care/constants";
import { typography } from "@/lib/typography";
import { cn } from "@/lib/utils";

type WeekCalendarStripProps = {
  selectedDate: string;
  onSelectDate: (date: string) => void;
};

export function WeekCalendarStrip({
  selectedDate,
  onSelectDate,
}: WeekCalendarStripProps) {
  const today = getTodayDateString();
  const weekDays = getWeekDaysAround(selectedDate);
  const selectedButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    selectedButtonRef.current?.scrollIntoView({
      behavior: "instant",
      inline: "nearest",
      block: "nearest",
    });
  }, [selectedDate]);

  return (
    <div className="min-w-0 overflow-hidden rounded-xl border border-border/60 bg-card/50 p-2">
      <p
        className={cn(
          typography.bodyMuted,
          "mb-2 hidden px-1 text-xs md:block",
        )}
      >
        {formatTodayLabel(selectedDate)}
      </p>

      {/* Mobile: horizontal scroll */}
      <div
        className="flex gap-2 overflow-x-auto overscroll-x-contain pb-1 md:hidden"
        role="group"
        aria-label="Select day"
      >
        {weekDays.map((date) => (
          <DayButton
            key={date}
            date={date}
            today={today}
            isSelected={date === selectedDate}
            isFuture={isFutureDate(date, today)}
            onSelect={onSelectDate}
            buttonRef={date === selectedDate ? selectedButtonRef : undefined}
            compact={false}
          />
        ))}
      </div>

      {/* Tablet/desktop: 7-column grid */}
      <div
        className="hidden grid-cols-7 gap-1 md:grid"
        role="group"
        aria-label="Select day"
      >
        {weekDays.map((date) => (
          <DayButton
            key={date}
            date={date}
            today={today}
            isSelected={date === selectedDate}
            isFuture={isFutureDate(date, today)}
            onSelect={onSelectDate}
            buttonRef={date === selectedDate ? selectedButtonRef : undefined}
            compact
          />
        ))}
      </div>
    </div>
  );
}

type DayButtonProps = {
  date: string;
  today: string;
  isSelected: boolean;
  isFuture: boolean;
  onSelect: (date: string) => void;
  buttonRef?: RefObject<HTMLButtonElement | null>;
  compact: boolean;
};

function DayButton({
  date,
  today,
  isSelected,
  isFuture,
  onSelect,
  buttonRef,
  compact,
}: DayButtonProps) {
  const isToday = date === today;

  return (
    <button
      ref={buttonRef}
      type="button"
      disabled={isFuture}
      onClick={() => onSelect(date)}
      className={cn(
        "flex flex-col items-center gap-1 rounded-full transition-colors",
        compact ? "min-w-0 px-1 py-1.5" : "min-w-[3rem] shrink-0 px-2 py-2",
        isSelected
          ? "bg-primary text-primary-foreground"
          : "text-muted-foreground hover:text-foreground",
        isFuture && "cursor-not-allowed opacity-40 hover:text-muted-foreground",
      )}
      aria-label={date}
      aria-pressed={isSelected}
      aria-current={isToday ? "date" : undefined}
    >
      <span className="font-sans text-xs font-medium uppercase tracking-wide">
        {formatWeekdayLetter(date)}
      </span>
      <span
        className={cn(
          "font-sans flex items-center justify-center rounded-full font-semibold",
          compact ? "size-7 text-xs" : "size-8 text-sm",
          isSelected && "text-primary-foreground",
          !isSelected && isToday && "ring-primary/40 ring-1",
        )}
      >
        {formatDayNumber(date)}
      </span>
    </button>
  );
}
