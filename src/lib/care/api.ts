import { DEFAULT_CARE_ICON } from "@/constants/icons";
import { createClient } from "@/lib/supabase/client";
import { slugifyCategoryName } from "@/constants/categories";
import type {
  CareItem,
  CareItemInsert,
  Category,
  ItemFrequency,
} from "@/types/database";

export type CareItemFormValues = {
  name: string;
  description?: string;
  icon?: string | null;
  frequency: ItemFrequency;
  frequency_days?: number[] | null;
  start_date: string;
  category_id: string;
};

function normalizeFormValues(values: CareItemFormValues) {
  const frequencyDays =
    values.frequency === "daily" ? null : values.frequency_days ?? null;

  return {
    name: values.name.trim(),
    description: values.description?.trim() || null,
    icon: values.icon ?? DEFAULT_CARE_ICON,
    frequency: values.frequency,
    frequency_days: frequencyDays,
    start_date: values.start_date,
    category_id: values.category_id,
  };
}

export async function fetchCareItems(): Promise<CareItem[]> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("You must be signed in.");
  }

  const [{ data: items, error: itemsError }, { data: hidden, error: hiddenError }] =
    await Promise.all([
      supabase
        .from("care_items")
        .select("*")
        .is("archived_at", null)
        .order("sort_order", { ascending: true })
        .order("name", { ascending: true }),
      supabase
        .from("user_hidden_items")
        .select("item_id")
        .eq("user_id", user.id),
    ]);

  if (itemsError) {
    throw new Error(itemsError.message);
  }
  if (hiddenError) {
    throw new Error(hiddenError.message);
  }

  const hiddenIds = new Set((hidden ?? []).map((row) => row.item_id));
  return ((items ?? []) as CareItem[]).filter((item) => !hiddenIds.has(item.id));
}

export async function fetchAllManageableItems(): Promise<{
  items: CareItem[];
  hiddenIds: string[];
}> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("You must be signed in.");
  }

  const [{ data: items, error: itemsError }, { data: hidden, error: hiddenError }] =
    await Promise.all([
      supabase
        .from("care_items")
        .select("*")
        .is("archived_at", null)
        .order("is_default", { ascending: false })
        .order("sort_order", { ascending: true })
        .order("name", { ascending: true }),
      supabase
        .from("user_hidden_items")
        .select("item_id")
        .eq("user_id", user.id),
    ]);

  if (itemsError) {
    throw new Error(itemsError.message);
  }
  if (hiddenError) {
    throw new Error(hiddenError.message);
  }

  return {
    items: (items ?? []) as CareItem[],
    hiddenIds: (hidden ?? []).map((row) => row.item_id),
  };
}

export async function fetchCareItemsByCategory(
  categoryId: string,
): Promise<CareItem[]> {
  const items = await fetchCareItems();
  return items.filter((item) => item.category_id === categoryId);
}

export async function createCareItem(
  values: CareItemFormValues,
): Promise<CareItem> {
  const supabase = createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("You must be signed in to create an item.");
  }

  const payload = normalizeFormValues(values);
  const insertData: CareItemInsert = {
    ...payload,
    user_id: user.id,
    is_default: false,
  };

  const { data, error } = await supabase
    .from("care_items")
    .insert(insertData)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as CareItem;
}

export async function updateCareItem(
  id: string,
  values: CareItemFormValues,
): Promise<CareItem> {
  const supabase = createClient();
  const payload = normalizeFormValues(values);

  const { data, error } = await supabase
    .from("care_items")
    .update(payload)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as CareItem;
}

export async function archiveCareItem(id: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase
    .from("care_items")
    .update({ archived_at: new Date().toISOString() })
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }
}

export async function permanentlyDeleteCareItem(id: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from("care_items").delete().eq("id", id);

  if (error) {
    throw new Error(error.message);
  }
}

export async function hideDefaultItem(itemId: string): Promise<void> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("You must be signed in.");
  }

  const { error } = await supabase.from("user_hidden_items").insert({
    user_id: user.id,
    item_id: itemId,
  });

  if (error) {
    throw new Error(error.message);
  }
}

export async function unhideDefaultItem(itemId: string): Promise<void> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("You must be signed in.");
  }

  const { error } = await supabase
    .from("user_hidden_items")
    .delete()
    .eq("user_id", user.id)
    .eq("item_id", itemId);

  if (error) {
    throw new Error(error.message);
  }
}

export function validateCareItemForm(
  values: CareItemFormValues,
): string | null {
  if (!values.name.trim()) {
    return "Name is required.";
  }

  if (!values.category_id) {
    return "Choose a category.";
  }

  if (
    (values.frequency === "weekly" || values.frequency === "custom") &&
    (!values.frequency_days || values.frequency_days.length === 0)
  ) {
    return "Select at least one day for weekly or custom items.";
  }

  if (!values.start_date) {
    return "Start date is required.";
  }

  return null;
}

export { slugifyCategoryName };
export type { Category };
