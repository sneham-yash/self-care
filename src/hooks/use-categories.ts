"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createCategory,
  fetchCategories,
  fetchCategory,
  fetchCategoryAnalytics,
  fetchCategoryItemCounts,
  updateCategory,
  deleteCategory,
} from "@/lib/categories/api";
import { categoriesKeys } from "@/lib/categories/keys";

export function useCategories() {
  return useQuery({
    queryKey: categoriesKeys.all,
    queryFn: fetchCategories,
  });
}

export function useCategory(id: string) {
  return useQuery({
    queryKey: categoriesKeys.detail(id),
    queryFn: () => fetchCategory(id),
    enabled: Boolean(id),
  });
}

export function useCategoryAnalytics(id: string) {
  return useQuery({
    queryKey: categoriesKeys.analytics(id),
    queryFn: () => fetchCategoryAnalytics(id),
    enabled: Boolean(id),
  });
}

export function useCategoryItemCounts() {
  return useQuery({
    queryKey: categoriesKeys.itemCounts,
    queryFn: fetchCategoryItemCounts,
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ name, icon }: { name: string; icon?: string | null }) =>
      createCategory(name, icon),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoriesKeys.all });
    },
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      values,
    }: {
      id: string;
      values: { name?: string; icon?: string | null };
    }) => updateCategory(id, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoriesKeys.all });
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoriesKeys.all });
    },
  });
}
