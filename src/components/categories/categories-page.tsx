"use client";

import Link from "next/link";
import {
  ArrowLeftIcon,
  ChevronRightIcon,
  PencilIcon,
  PlusIcon,
  Trash2Icon,
} from "lucide-react";
import { useState } from "react";

import { CreateCategoryDialog } from "@/components/categories/create-category-dialog";
import { DeleteCategoryDialog } from "@/components/categories/delete-category-dialog";
import { EditCategoryDialog } from "@/components/categories/edit-category-dialog";
import { CareIcon } from "@/components/icons/care-icon";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  useCategories,
  useCategoryItemCounts,
} from "@/hooks/use-categories";
import { typography } from "@/lib/typography";
import { cn } from "@/lib/utils";
import type { Category } from "@/types/database";

type CategoriesPageProps = {
  showBackLink?: boolean;
};

export function CategoriesPage({ showBackLink = false }: CategoriesPageProps) {
  const { data: categories, isLoading, error } = useCategories();
  const { data: itemCounts } = useCategoryItemCounts();
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  );

  const defaultCategories = categories?.filter((category) => category.is_default) ?? [];
  const customCategories = categories?.filter((category) => !category.is_default) ?? [];

  return (
    <div className="space-y-8">
      {showBackLink ? (
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
      ) : null}

      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <h1 className={typography.screenTitle}>Manage categories</h1>
          <p className={typography.screenSubtitle}>
            Five self-care domains come ready. Add your own if you need another
            grouping.
          </p>
        </div>
        <Button onClick={() => setCreateOpen(true)}>
          <PlusIcon />
          New
        </Button>
      </div>

      {isLoading ? (
        <p className={typography.bodyMuted}>Loading categories…</p>
      ) : null}
      {error ? (
        <p className="text-destructive text-sm">{error.message}</p>
      ) : null}

      <section className="space-y-3">
        <h2 className={typography.sectionTitle}>Domains</h2>
        {defaultCategories.map((category) => (
          <CategoryRow
            key={category.id}
            category={category}
            count={itemCounts?.[category.id] ?? 0}
          />
        ))}
      </section>

      {customCategories.length > 0 ? (
        <section className="space-y-3">
          <h2 className={typography.sectionTitle}>Your categories</h2>
          {customCategories.map((category) => (
            <CategoryRow
              key={category.id}
              category={category}
              count={itemCounts?.[category.id] ?? 0}
              onEdit={() => {
                setSelectedCategory(category);
                setEditOpen(true);
              }}
              onDelete={() => {
                setSelectedCategory(category);
                setDeleteOpen(true);
              }}
            />
          ))}
        </section>
      ) : null}

      <CreateCategoryDialog open={createOpen} onOpenChange={setCreateOpen} />
      <EditCategoryDialog
        category={selectedCategory}
        open={editOpen}
        onOpenChange={setEditOpen}
      />
      <DeleteCategoryDialog
        category={selectedCategory}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
      />
    </div>
  );
}

function CategoryRow({
  category,
  count,
  onEdit,
  onDelete,
}: {
  category: Category;
  count: number;
  onEdit?: () => void;
  onDelete?: () => void;
}) {
  return (
    <Card className="py-0">
      <CardContent className="flex items-center gap-3 px-4 py-3">
        <CareIcon icon={category.icon} categoryName={category.name} size="sm" />
        <Link href={`/categories/${category.id}`} className="min-w-0 flex-1">
          <p className={typography.bodyText}>{category.name}</p>
          <p className={typography.bodyMuted}>
            {count} {count === 1 ? "item" : "items"}
          </p>
        </Link>
        {onEdit ? (
          <Button type="button" variant="ghost" size="icon" onClick={onEdit}>
            <PencilIcon className="size-4" />
          </Button>
        ) : null}
        {onDelete ? (
          <Button type="button" variant="ghost" size="icon" onClick={onDelete}>
            <Trash2Icon className="size-4" />
          </Button>
        ) : null}
        <ChevronRightIcon className="text-muted-foreground size-4" />
      </CardContent>
    </Card>
  );
}
