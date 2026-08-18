"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { CareItemForm } from "@/components/care/care-item-form";
import { useCreateCareItem } from "@/hooks/use-care-items";
import { typography } from "@/lib/typography";

export function CreateCareItemPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const createItem = useCreateCareItem();
  const [error, setError] = useState<string | null>(null);
  const [defaultCategoryId, setDefaultCategoryId] = useState<string | null>(
    null,
  );

  useEffect(() => {
    const category = searchParams.get("category");
    if (category) {
      setDefaultCategoryId(category);
    }
  }, [searchParams]);

  async function handleSubmit(
    values: Parameters<typeof createItem.mutateAsync>[0],
  ) {
    setError(null);
    try {
      await createItem.mutateAsync({
        ...values,
        category_id: values.category_id || defaultCategoryId || "",
      });
      router.push("/check-in");
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Failed to create item.",
      );
    }
  }

  return (
    <div className="mx-auto space-y-6 md:max-w-xl">
      <div className="space-y-1 md:hidden">
        <h1 className={typography.screenTitle}>Create item</h1>
        <p className={typography.screenSubtitle}>
          Add a custom self-care practice to any domain.
        </p>
      </div>

      <div className="border-primary/15 bg-card space-y-6 rounded-xl border p-4 shadow-sm md:p-6 lg:p-8">
        <div className="hidden space-y-1 md:block">
          <h1 className={typography.screenTitleLg}>Create item</h1>
          <p className={typography.bodyMuted}>
            Add something that helps you take care of yourself.
          </p>
        </div>

        <CareItemForm
          defaultCategoryId={defaultCategoryId}
          onSubmit={handleSubmit}
          onCancel={() => router.push("/check-in")}
          isPending={createItem.isPending}
          error={error}
        />
      </div>
    </div>
  );
}
