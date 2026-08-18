"use client";

import { CheckIcon, StarIcon } from "lucide-react";

import {
  CARE_INTENSITY_LABELS,
  CARE_INTENSITY_LEVELS,
  type CareIntensity,
  type CareIntensityLevel,
} from "@/constants/care";
import { cn } from "@/lib/utils";

export const INTENSITY_CELL = "size-8";
export const INTENSITY_CLUSTER =
  "grid w-28 shrink-0 grid-cols-3 place-items-center gap-2";

const HEADER_GRID =
  "flex items-center justify-between gap-2 md:grid md:grid-cols-[minmax(0,1fr)_2rem_7rem] md:gap-x-1.5";

const ROW_GRID =
  "flex flex-col gap-2 md:grid md:grid-cols-[minmax(0,1fr)_2rem_7rem] md:items-center md:gap-x-1.5 md:gap-y-0";

const ACTIONS_ROW =
  "flex items-center justify-end gap-1.5 md:contents";

type CareIntensityPickerProps = {
  value: CareIntensity;
  onChange: (level: CareIntensityLevel) => void;
  disabled?: boolean;
  itemName: string;
};

export function careListHeaderClassName(className?: string) {
  return cn(HEADER_GRID, className);
}

export function careListGridClassName(className?: string) {
  return cn(ROW_GRID, className);
}

export function careListActionsClassName(className?: string) {
  return cn(ACTIONS_ROW, className);
}

function StarCluster({ count }: { count: CareIntensityLevel }) {
  return (
    <span className="flex items-center justify-center gap-px" aria-hidden>
      {Array.from({ length: count }, (_, index) => (
        <StarIcon key={index} className="size-2.5 fill-current" />
      ))}
    </span>
  );
}

export function CareIntensityColumnLabels() {
  return (
    <div
      className={INTENSITY_CLUSTER}
      aria-hidden
    >
      {CARE_INTENSITY_LEVELS.map((level) => (
        <span
          key={level}
          className={cn(
            INTENSITY_CELL,
            "flex items-center justify-center text-current",
          )}
          title={CARE_INTENSITY_LABELS[level]}
        >
          <StarCluster count={level} />
        </span>
      ))}
    </div>
  );
}

export function CareIntensityPicker({
  value,
  onChange,
  disabled,
  itemName,
}: CareIntensityPickerProps) {
  return (
    <div
      role="radiogroup"
      aria-label={`How well you did ${itemName}`}
      className={INTENSITY_CLUSTER}
    >
      {CARE_INTENSITY_LEVELS.map((level) => {
        const selected = value === level;
        const label = CARE_INTENSITY_LABELS[level];

        return (
          <button
            key={level}
            type="button"
            role="radio"
            aria-checked={selected}
            disabled={disabled}
            title={label}
            aria-label={`${label} for ${itemName}`}
            onClick={() => onChange(level)}
            className={cn(
              "flex items-center justify-center rounded-[5px] border transition-all",
              INTENSITY_CELL,
              "focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:outline-none",
              selected
                ? "border-primary bg-primary text-primary-foreground shadow-sm shadow-primary/25"
                : "border-input bg-background hover:border-primary/55 hover:bg-primary/8",
              disabled && "opacity-50",
            )}
          >
            <CheckIcon
              className={cn(
                "size-3.5 stroke-[2.5] transition-transform",
                selected ? "scale-100 opacity-100" : "scale-75 opacity-0",
              )}
            />
          </button>
        );
      })}
    </div>
  );
}
