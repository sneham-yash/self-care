"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  archiveCareItem,
  createCareItem,
  fetchAllManageableItems,
  fetchCareItems,
  hideDefaultItem,
  permanentlyDeleteCareItem,
  unhideDefaultItem,
  updateCareItem,
  type CareItemFormValues,
} from "@/lib/care/api";
import { careKeys, dashboardKeys } from "@/lib/care/keys";
import { insightsKeys } from "@/lib/analytics/keys";
import { categoriesKeys } from "@/lib/categories/keys";

export function useCareItems() {
  return useQuery({
    queryKey: careKeys.all,
    queryFn: fetchCareItems,
  });
}

export function useManageableItems() {
  return useQuery({
    queryKey: careKeys.hidden,
    queryFn: fetchAllManageableItems,
  });
}

export function useCreateCareItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (values: CareItemFormValues) => createCareItem(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: careKeys.all });
      queryClient.invalidateQueries({ queryKey: careKeys.hidden });
      queryClient.invalidateQueries({ queryKey: insightsKeys.all });
      queryClient.invalidateQueries({ queryKey: categoriesKeys.itemCounts });
      queryClient.invalidateQueries({ queryKey: dashboardKeys.all });
    },
  });
}

export function useUpdateCareItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, values }: { id: string; values: CareItemFormValues }) =>
      updateCareItem(id, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: careKeys.all });
      queryClient.invalidateQueries({ queryKey: careKeys.hidden });
      queryClient.invalidateQueries({ queryKey: insightsKeys.all });
      queryClient.invalidateQueries({ queryKey: dashboardKeys.all });
    },
  });
}

export function useArchiveCareItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => archiveCareItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: careKeys.all });
      queryClient.invalidateQueries({ queryKey: careKeys.hidden });
      queryClient.invalidateQueries({ queryKey: insightsKeys.all });
      queryClient.invalidateQueries({ queryKey: dashboardKeys.all });
    },
  });
}

export function usePermanentlyDeleteCareItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => permanentlyDeleteCareItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: careKeys.all });
      queryClient.invalidateQueries({ queryKey: careKeys.hidden });
      queryClient.invalidateQueries({ queryKey: insightsKeys.all });
      queryClient.invalidateQueries({ queryKey: dashboardKeys.all });
    },
  });
}

export function useHideDefaultItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => hideDefaultItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: careKeys.all });
      queryClient.invalidateQueries({ queryKey: careKeys.hidden });
      queryClient.invalidateQueries({ queryKey: dashboardKeys.all });
    },
  });
}

export function useUnhideDefaultItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => unhideDefaultItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: careKeys.all });
      queryClient.invalidateQueries({ queryKey: careKeys.hidden });
      queryClient.invalidateQueries({ queryKey: dashboardKeys.all });
    },
  });
}
