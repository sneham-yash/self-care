"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createCategory } from "@/lib/categories/api";
import { categoriesKeys } from "@/lib/categories/keys";

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
