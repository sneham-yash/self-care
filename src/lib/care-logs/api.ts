import {
  toCareIntensity,
  type CareIntensity,
  type CareIntensityLevel,
} from "@/constants/care";
import { fetchCareItems } from "@/lib/care/api";
import { isItemScheduled } from "@/lib/care/schedule";
import { createClient } from "@/lib/supabase/client";
import type { CareItem } from "@/types/database";

export type TodayCareItem = CareItem & {
  completed: boolean;
  intensity: CareIntensity;
  remark: string | null;
  category_slug: string;
  category_name: string;
};

export async function fetchTodayCareItems(
  date: string,
): Promise<TodayCareItem[]> {
  const items = await fetchCareItems();
  const scheduled = items.filter((item) => isItemScheduled(item, date));

  const supabase = createClient();
  const [{ data: logs, error: logsError }, { data: categories, error: catError }] =
    await Promise.all([
      scheduled.length === 0
        ? Promise.resolve({ data: [], error: null })
        : supabase
            .from("care_logs")
            .select("item_id, completed, intensity, remark")
            .eq("log_date", date)
            .in(
              "item_id",
              scheduled.map((item) => item.id),
            ),
      supabase.from("categories").select("id, name, slug"),
    ]);

  if (logsError) {
    throw new Error(logsError.message);
  }
  if (catError) {
    throw new Error(catError.message);
  }

  const logByItem = new Map(
    (logs ?? []).map((log) => [log.item_id, log]),
  );
  const categoryById = new Map(
    (categories ?? []).map((category) => [category.id, category]),
  );

  return scheduled.map((item) => {
    const log = logByItem.get(item.id);
    const category = categoryById.get(item.category_id);
    return {
      ...item,
      completed: log?.completed ?? false,
      intensity: toCareIntensity(log?.intensity, log?.completed ?? false),
      remark: log?.remark ?? null,
      category_slug: category?.slug ?? "physical",
      category_name: category?.name ?? "Care",
    };
  });
}

export async function setCareIntensity(
  itemId: string,
  date: string,
  intensity: CareIntensityLevel,
): Promise<CareIntensity> {
  const supabase = createClient();
  const { data, error } = await supabase.rpc("set_care_intensity", {
    p_item_id: itemId,
    p_intensity: intensity,
    p_date: date,
  });

  if (error) {
    throw new Error(error.message);
  }

  return toCareIntensity(data);
}

export async function upsertCareRemark(
  itemId: string,
  date: string,
  remark: string,
): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.rpc("upsert_care_remark", {
    p_item_id: itemId,
    p_date: date,
    p_remark: remark,
  });

  if (error) {
    throw new Error(error.message);
  }
}

export type CalendarDay = {
  calendar_date: string;
  scheduled_count: number;
  completed_count: number;
  completion_rate: number;
};

export async function fetchCareCalendar(
  year: number,
  month: number,
): Promise<CalendarDay[]> {
  const supabase = createClient();
  const { data, error } = await supabase.rpc("get_care_calendar", {
    p_year: year,
    p_month: month,
  });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as CalendarDay[];
}

export type ReportItemRow = TodayCareItem;

export async function fetchReportItems(
  startDate: string,
  endDate: string,
): Promise<{
  items: CareItem[];
  logs: {
    item_id: string;
    log_date: string;
    completed: boolean;
    intensity: number;
    remark: string | null;
  }[];
  categories: { id: string; name: string; slug: string }[];
}> {
  const items = await fetchCareItems();
  const supabase = createClient();
  const [{ data: logs, error: logsError }, { data: categories, error: catError }] =
    await Promise.all([
      supabase
        .from("care_logs")
        .select("item_id, log_date, completed, intensity, remark")
        .gte("log_date", startDate)
        .lte("log_date", endDate),
      supabase.from("categories").select("id, name, slug"),
    ]);

  if (logsError) {
    throw new Error(logsError.message);
  }
  if (catError) {
    throw new Error(catError.message);
  }

  return {
    items,
    logs: logs ?? [],
    categories: (categories ?? []) as { id: string; name: string; slug: string }[],
  };
}
