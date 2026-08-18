import type { CareItem } from "@/types/database";

function getIsoDayOfWeek(dateString: string): number {
  const date = new Date(`${dateString}T12:00:00.000Z`);
  const day = date.getUTCDay();
  return day === 0 ? 7 : day;
}

export function isItemScheduled(item: CareItem, date: string): boolean {
  if (date < item.start_date) {
    return false;
  }

  if (item.frequency === "daily") {
    return true;
  }

  if (item.frequency === "weekly" || item.frequency === "custom") {
    const days = item.frequency_days ?? [1, 2, 3, 4, 5, 6, 7];
    return days.includes(getIsoDayOfWeek(date));
  }

  return false;
}
