import type { ItemFrequency } from "@/types/database";

export const FREQUENCY_OPTIONS: { value: ItemFrequency; label: string }[] = [
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "custom", label: "Custom" },
];

export const WEEKDAYS = [
  { value: 1, label: "Mon" },
  { value: 2, label: "Tue" },
  { value: 3, label: "Wed" },
  { value: 4, label: "Thu" },
  { value: 5, label: "Fri" },
  { value: 6, label: "Sat" },
  { value: 7, label: "Sun" },
] as const;

export function formatFrequencyLabel(
  frequency: ItemFrequency,
  frequencyDays: number[] | null,
): string {
  if (frequency === "daily") {
    return "Daily";
  }

  if (!frequencyDays?.length) {
    return frequency === "weekly" ? "Weekly" : "Custom";
  }

  const dayLabels = frequencyDays
    .slice()
    .sort((a, b) => a - b)
    .map(
      (day) => WEEKDAYS.find((weekday) => weekday.value === day)?.label ?? "",
    )
    .filter(Boolean)
    .join(", ");

  return `${frequency === "weekly" ? "Weekly" : "Custom"} (${dayLabels})`;
}

export function getTodayDateString(): string {
  return new Date().toISOString().split("T")[0]!;
}
