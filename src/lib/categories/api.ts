import { createClient } from "@/lib/supabase/client";
import { slugifyCategoryName } from "@/constants/categories";
import type { Category, CategoryInsert } from "@/types/database";

export async function fetchCategories(): Promise<Category[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("is_default", { ascending: false })
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as Category[];
}

export async function fetchCategory(id: string): Promise<Category> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as Category;
}

export async function createCategory(
  name: string,
  icon?: string | null,
): Promise<Category> {
  const supabase = createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("You must be signed in to create a category.");
  }

  const trimmed = name.trim();
  const insertData: CategoryInsert = {
    user_id: user.id,
    name: trimmed,
    slug: `${slugifyCategoryName(trimmed)}-${user.id.slice(0, 8)}`,
    icon: icon ?? null,
    is_default: false,
  };

  const { data, error } = await supabase
    .from("categories")
    .insert(insertData)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as Category;
}

export type CategoryAnalytics = {
  category_id: string;
  category_name: string;
  item_count: number;
  scheduled_days: number;
  completed_days: number;
  completion_rate: number;
};

export async function fetchCategoryAnalytics(
  categoryId: string,
): Promise<CategoryAnalytics | null> {
  const supabase = createClient();
  const { data, error } = await supabase.rpc("get_category_analytics", {
    p_category_id: categoryId,
  });

  if (error) {
    throw new Error(error.message);
  }

  return data?.[0] ?? null;
}

export async function fetchCategoryItemCounts(): Promise<Record<string, number>> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("care_items")
    .select("category_id")
    .is("archived_at", null);

  if (error) {
    throw new Error(error.message);
  }

  const counts: Record<string, number> = {};
  for (const row of data ?? []) {
    if (row.category_id) {
      counts[row.category_id] = (counts[row.category_id] ?? 0) + 1;
    }
  }
  return counts;
}

export async function updateCategory(
  id: string,
  values: { name?: string; icon?: string | null },
): Promise<Category> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("categories")
    .update({
      ...(values.name !== undefined
        ? {
            name: values.name.trim(),
            slug: slugifyCategoryName(values.name),
          }
        : {}),
      ...(values.icon !== undefined ? { icon: values.icon } : {}),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as Category;
}

export async function deleteCategory(id: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from("categories").delete().eq("id", id);

  if (error) {
    throw new Error(error.message);
  }
}
