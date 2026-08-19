"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  fetchSelfCareScoreData,
  setWantsImprovement,
} from "@/lib/self-care-score/api";
import { selfCareScoreKeys } from "@/lib/self-care-score/keys";

/** Fetches and caches the current Self-Care Score state. */
export function useSelfCareScore() {
  return useQuery({
    queryKey: selfCareScoreKeys.data(),
    queryFn: fetchSelfCareScoreData,
    staleTime: 30_000,
  });
}

/** Toggles the score-neutral "I'd like to improve this" flag. */
export function useSetWantsImprovement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      itemId,
      wantsImprovement,
    }: {
      itemId: string;
      wantsImprovement: boolean;
    }) => setWantsImprovement(itemId, wantsImprovement),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: selfCareScoreKeys.all });
    },
  });
}
