"use client";

import { useState } from "react";

import { IconPicker } from "@/components/icons/icon-picker";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DEFAULT_CARE_ICON, type IconName } from "@/constants/icons";
import { useCreateCategory } from "@/hooks/use-categories";

type CreateCategoryDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function CreateCategoryDialog({
  open,
  onOpenChange,
}: CreateCategoryDialogProps) {
  const createCategory = useCreateCategory();
  const [name, setName] = useState("");
  const [icon, setIcon] = useState<IconName>(DEFAULT_CARE_ICON);
  const [error, setError] = useState<string | null>(null);

  function resetForm() {
    setName("");
    setIcon(DEFAULT_CARE_ICON);
    setError(null);
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    try {
      await createCategory.mutateAsync({ name, icon });
      resetForm();
      onOpenChange(false);
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Failed to create category.",
      );
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) resetForm();
        onOpenChange(nextOpen);
      }}
    >
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Create category</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="category_name">Category name</Label>
            <Input
              id="category_name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="e.g. Creative"
              required
            />
          </div>

          <IconPicker value={icon} onChange={setIcon} />

          {error ? (
            <p className="text-destructive text-sm" role="alert">
              {error}
            </p>
          ) : null}

          <Button
            type="submit"
            className="w-full"
            disabled={createCategory.isPending}
          >
            {createCategory.isPending ? "Creating…" : "Create category"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
