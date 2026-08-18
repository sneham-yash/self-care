"use client";

import { useState } from "react";

import { IconPicker } from "@/components/icons/icon-picker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useCategories } from "@/hooks/use-categories";
import { getCategoryVisuals } from "@/constants/categories";
import { DEFAULT_CARE_ICON, type IconName } from "@/constants/icons";
import {
  type CareItemFormValues,
  validateCareItemForm,
} from "@/lib/care/api";
import { FREQUENCY_OPTIONS, WEEKDAYS } from "@/lib/care/constants";
import type { CareItem, ItemFrequency } from "@/types/database";
import { cn } from "@/lib/utils";

type CareItemFormProps = {
  item?: CareItem;
  defaultCategoryId?: string | null;
  onSubmit: (values: CareItemFormValues) => Promise<void>;
  onCancel: () => void;
  isPending?: boolean;
  error?: string | null;
};

function getInitialValues(
  item?: CareItem,
  defaultCategoryId?: string | null,
): CareItemFormValues {
  if (item) {
    return {
      name: item.name,
      description: item.description ?? "",
      frequency: item.frequency,
      frequency_days: item.frequency_days,
      start_date: item.start_date,
      category_id: item.category_id,
      icon: item.icon,
    };
  }

  return {
    name: "",
    description: "",
    frequency: "daily",
    frequency_days: null,
    start_date: new Date().toISOString().split("T")[0]!,
    category_id: defaultCategoryId ?? "",
    icon: DEFAULT_CARE_ICON,
  };
}

export function CareItemForm({
  item,
  defaultCategoryId,
  onSubmit,
  onCancel,
  isPending = false,
  error,
}: CareItemFormProps) {
  const { data: categories } = useCategories();
  const [values, setValues] = useState<CareItemFormValues>(() =>
    getInitialValues(item, defaultCategoryId),
  );
  const [validationError, setValidationError] = useState<string | null>(null);
  const showDayPicker =
    values.frequency === "weekly" || values.frequency === "custom";

  function updateField<K extends keyof CareItemFormValues>(
    key: K,
    value: CareItemFormValues[K],
  ) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  function toggleDay(day: number) {
    setValues((current) => {
      const selected = current.frequency_days ?? [];
      const next = selected.includes(day)
        ? selected.filter((value) => value !== day)
        : [...selected, day];
      return { ...current, frequency_days: next };
    });
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const message = validateCareItemForm(values);
    if (message) {
      setValidationError(message);
      return;
    }
    setValidationError(null);
    await onSubmit(values);
  }

  const displayError = validationError ?? error;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Item name</Label>
        <Input
          id="name"
          value={values.name}
          onChange={(event) => updateField("name", event.target.value)}
          placeholder="e.g. Evening walk"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={values.description ?? ""}
          onChange={(event) => updateField("description", event.target.value)}
          placeholder="Optional details"
          rows={2}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Domain</Label>
        <Select
          value={values.category_id}
          onValueChange={(value) => {
            const category = categories?.find((entry) => entry.id === value);
            const visuals = category
              ? getCategoryVisuals(category.name, category.icon)
              : null;
            setValues((current) => ({
              ...current,
              category_id: value,
              icon: visuals?.iconName ?? current.icon,
            }));
          }}
        >
          <SelectTrigger id="category" className="w-full">
            <SelectValue placeholder="Select a domain" />
          </SelectTrigger>
          <SelectContent>
            {(categories ?? []).map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <IconPicker
        value={(values.icon as IconName) ?? null}
        onChange={(icon) => updateField("icon", icon)}
      />

      <div className="space-y-2">
        <Label htmlFor="frequency">Repeat</Label>
        <Select
          value={values.frequency}
          onValueChange={(value: ItemFrequency) => {
            setValues((current) => ({
              ...current,
              frequency: value,
              frequency_days:
                value === "daily" ? null : current.frequency_days ?? [],
            }));
          }}
        >
          <SelectTrigger id="frequency" className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {FREQUENCY_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {showDayPicker ? (
        <div className="space-y-2">
          <Label>Repeat days</Label>
          <div className="flex flex-wrap gap-2">
            {WEEKDAYS.map((day) => {
              const selected = values.frequency_days?.includes(day.value);
              return (
                <Button
                  key={day.value}
                  type="button"
                  variant={selected ? "default" : "outline"}
                  size="sm"
                  className={cn("min-w-12")}
                  onClick={() => toggleDay(day.value)}
                >
                  {day.label}
                </Button>
              );
            })}
          </div>
        </div>
      ) : null}

      {displayError ? (
        <p className="text-destructive text-sm" role="alert">
          {displayError}
        </p>
      ) : null}

      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          className="flex-1"
          onClick={onCancel}
          disabled={isPending}
        >
          Cancel
        </Button>
        <Button type="submit" className="flex-1" disabled={isPending}>
          {isPending ? "Saving…" : item ? "Save changes" : "Create item"}
        </Button>
      </div>
    </form>
  );
}
