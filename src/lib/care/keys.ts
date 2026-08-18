export const careKeys = {
  all: ["care-items"] as const,
  detail: (id: string) => ["care-items", id] as const,
  hidden: ["care-items", "hidden"] as const,
};

export const dashboardKeys = {
  all: ["dashboard"] as const,
  today: (date: string) => ["dashboard", "today", date] as const,
  calendar: (year: number, month: number) =>
    ["dashboard", "calendar", year, month] as const,
};
