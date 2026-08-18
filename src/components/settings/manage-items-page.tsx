"use client";

import Link from "next/link";
import { ArrowLeftIcon, EyeIcon, EyeOffIcon, PencilIcon, Trash2Icon } from "lucide-react";
import { useMemo, useState } from "react";

import { CareItemForm } from "@/components/care/care-item-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Card, CardContent } from "@/components/ui/card";
import { CareFilterTabs } from "@/components/dashboard/care-filter-tabs";
import type { CareFilterTab } from "@/constants/care";
import {
  useArchiveCareItem,
  useHideDefaultItem,
  useManageableItems,
  useUnhideDefaultItem,
  useUpdateCareItem,
} from "@/hooks/use-care-items";
import { useCategories } from "@/hooks/use-categories";
import { typography } from "@/lib/typography";
import { cn } from "@/lib/utils";
import type { CareItem } from "@/types/database";

export function ManageItemsPage() {
  const { data, isLoading, error } = useManageableItems();
  const { data: categories } = useCategories();
  const updateItem = useUpdateCareItem();
  const archiveItem = useArchiveCareItem();
  const hideItem = useHideDefaultItem();
  const unhideItem = useUnhideDefaultItem();
  const [tab, setTab] = useState<CareFilterTab>("all");
  const [editing, setEditing] = useState<CareItem>();
  const [archiving, setArchiving] = useState<CareItem>();

  const categoryById = useMemo(
    () => new Map((categories ?? []).map((category) => [category.id, category])),
    [categories],
  );
  const hiddenIds = new Set(data?.hiddenIds ?? []);
  const items = data?.items ?? [];

  const filtered = items.filter((item) => {
    if (tab === "all") return true;
    return categoryById.get(item.category_id)?.slug === tab;
  });

  return (
    <div className="space-y-4">
      <Link
        href="/settings"
        className={cn(
          typography.bodyText,
          "text-muted-foreground inline-flex items-center gap-1 hover:text-foreground md:hidden",
        )}
      >
        <ArrowLeftIcon className="size-4" />
        Settings
      </Link>

      <div className="space-y-1">
        <h1 className={typography.screenTitle}>Manage items</h1>
        <p className={typography.screenSubtitle}>
          Hide default checklist items you don&apos;t need, or edit the ones you
          created.
        </p>
      </div>

      <CareFilterTabs value={tab} onChange={setTab} />

      {isLoading ? (
        <p className={typography.bodyMuted}>Loading items…</p>
      ) : null}
      {error ? (
        <p className="text-destructive text-sm">{error.message}</p>
      ) : null}

      <div className="space-y-2">
        {filtered.map((item) => {
          const hidden = hiddenIds.has(item.id);
          const categoryName = categoryById.get(item.category_id)?.name ?? "Care";
          return (
            <Card key={item.id} className="py-0">
              <CardContent className="flex items-center gap-3 px-4 py-3">
                <div className="min-w-0 flex-1">
                  <p className={cn(typography.bodyText, hidden && "line-through")}>
                    {item.name}
                  </p>
                  <p className={typography.bodyMuted}>
                    {categoryName}
                    {item.is_default ? " · Default" : " · Custom"}
                  </p>
                </div>
                {item.is_default ? (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                      hidden
                        ? unhideItem.mutate(item.id)
                        : hideItem.mutate(item.id)
                    }
                    aria-label={hidden ? "Show item" : "Hide item"}
                  >
                    {hidden ? (
                      <EyeOffIcon className="size-4" />
                    ) : (
                      <EyeIcon className="size-4" />
                    )}
                  </Button>
                ) : (
                  <>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => setEditing(item)}
                      aria-label="Edit item"
                    >
                      <PencilIcon className="size-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => setArchiving(item)}
                      aria-label="Archive item"
                    >
                      <Trash2Icon className="size-4" />
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Dialog open={Boolean(editing)} onOpenChange={() => setEditing(undefined)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit item</DialogTitle>
          </DialogHeader>
          {editing ? (
            <CareItemForm
              item={editing}
              onCancel={() => setEditing(undefined)}
              isPending={updateItem.isPending}
              onSubmit={async (values) => {
                await updateItem.mutateAsync({ id: editing.id, values });
                setEditing(undefined);
              }}
            />
          ) : null}
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={Boolean(archiving)}
        onOpenChange={() => setArchiving(undefined)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Archive this item?</AlertDialogTitle>
            <AlertDialogDescription>
              It will leave your daily checklist. You can create it again later.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (archiving) archiveItem.mutate(archiving.id);
                setArchiving(undefined);
              }}
            >
              Archive
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
