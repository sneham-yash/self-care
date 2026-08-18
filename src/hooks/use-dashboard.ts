"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { nextCareIntensity, type CareIntensityLevel } from "@/constants/care";
import {
  fetchTodayCareItems,
  setCareIntensity,
  upsertCareRemark,
  fetchCareCalendar,
  type TodayCareItem,
} from "@/lib/care-logs/api";
import { dashboardKeys } from "@/lib/care/keys";
import { insightsKeys } from "@/lib/analytics/keys";
import { getTodayDateString } from "@/lib/care/constants";

export function useTodayCareItems(date = getTodayDateString()) {
  return useQuery({
    queryKey: dashboardKeys.today(date),
    queryFn: () => fetchTodayCareItems(date),
  });
}

export function useSetCareIntensity(date = getTodayDateString()) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      itemId,
      intensity,
    }: {
      itemId: string;
      intensity: CareIntensityLevel;
    }) => setCareIntensity(itemId, date, intensity),
    onMutate: async ({ itemId, intensity }) => {
      await queryClient.cancelQueries({ queryKey: dashboardKeys.today(date) });

      const previous = queryClient.getQueryData<TodayCareItem[]>(
        dashboardKeys.today(date),
      );

      queryClient.setQueryData<TodayCareItem[]>(
        dashboardKeys.today(date),
        (current) =>
          current?.map((item) => {
            if (item.id !== itemId) return item;
            const next = nextCareIntensity(item.intensity, intensity);
            return { ...item, intensity: next, completed: next > 0 };
          }),
      );

      return { previous };
    },
    onError: (_error, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(dashboardKeys.today(date), context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: dashboardKeys.today(date) });
      queryClient.invalidateQueries({ queryKey: insightsKeys.all });
      queryClient.invalidateQueries({ queryKey: dashboardKeys.all });
    },
  });
}

export function useUpsertCareRemark(date = getTodayDateString()) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ itemId, remark }: { itemId: string; remark: string }) =>
      upsertCareRemark(itemId, date, remark),
    onMutate: async ({ itemId, remark }) => {
      await queryClient.cancelQueries({ queryKey: dashboardKeys.today(date) });
      const previous = queryClient.getQueryData<TodayCareItem[]>(
        dashboardKeys.today(date),
      );
      queryClient.setQueryData<TodayCareItem[]>(
        dashboardKeys.today(date),
        (current) =>
          current?.map((item) =>
            item.id === itemId
              ? { ...item, remark: remark.trim() || null }
              : item,
          ),
      );
      return { previous };
    },
    onError: (_error, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(dashboardKeys.today(date), context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: dashboardKeys.today(date) });
    },
  });
}

export function useCareCalendar(year: number, month: number) {
  return useQuery({
    queryKey: dashboardKeys.calendar(year, month),
    queryFn: () => fetchCareCalendar(year, month),
  });
}
