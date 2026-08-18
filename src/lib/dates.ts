/** Fixed locale so SSR and client hydration produce identical date strings. */
export const DISPLAY_LOCALE = "en-US";

export function formatDisplayDate(
  dateString: string,
  options: Intl.DateTimeFormatOptions,
): string {
  const date = new Date(`${dateString}T12:00:00.000Z`);
  return date.toLocaleDateString(DISPLAY_LOCALE, options);
}

export function formatTodayLabel(dateString: string): string {
  return formatDisplayDate(dateString, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

export function addDays(dateString: string, days: number): string {
  const date = new Date(`${dateString}T12:00:00.000Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().split("T")[0]!;
}

/** Returns Mon–Sun week containing the given date. */
export function getWeekDaysAround(dateString: string): string[] {
  const date = new Date(`${dateString}T12:00:00.000Z`);
  const day = date.getUTCDay();
  const mondayOffset = day === 0 ? -6 : 1 - day;
  const monday = addDays(dateString, mondayOffset);
  return Array.from({ length: 7 }, (_, index) => addDays(monday, index));
}

export function formatWeekdayLetter(dateString: string): string {
  return formatDisplayDate(dateString, { weekday: "narrow" });
}

export function formatDayNumber(dateString: string): string {
  return formatDisplayDate(dateString, { day: "numeric" });
}

export function isFutureDate(dateString: string, today: string): boolean {
  return dateString > today;
}

export function getMonthGrid(year: number, month: number): (string | null)[] {
  const first = new Date(Date.UTC(year, month - 1, 1));
  const isoDow = first.getUTCDay() === 0 ? 7 : first.getUTCDay();
  const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();
  const cells: (string | null)[] = [];

  for (let i = 1; i < isoDow; i += 1) {
    cells.push(null);
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    const date = new Date(Date.UTC(year, month - 1, day));
    cells.push(date.toISOString().split("T")[0]!);
  }

  while (cells.length % 7 !== 0) {
    cells.push(null);
  }

  return cells;
}

export function getIsoWeekRange(dateString: string): { start: string; end: string } {
  const days = getWeekDaysAround(dateString);
  return { start: days[0]!, end: days[6]! };
}

export function getMonthRange(dateString: string): { start: string; end: string } {
  const date = new Date(`${dateString}T12:00:00.000Z`);
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth();
  const start = new Date(Date.UTC(year, month, 1)).toISOString().split("T")[0]!;
  const end = new Date(Date.UTC(year, month + 1, 0)).toISOString().split("T")[0]!;
  return { start, end };
}

export function formatMonthLabel(dateString: string): string {
  return formatDisplayDate(dateString, { month: "long", year: "numeric" });
}
