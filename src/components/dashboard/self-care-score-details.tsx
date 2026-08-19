"use client";

import { useState } from "react";
import { ChevronDownIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { typography } from "@/lib/typography";

export function SelfCareScoreDetails() {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-t border-border/50 pt-3">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between text-left text-xs text-muted-foreground hover:text-foreground transition-colors"
        aria-expanded={open}
      >
        <span>How your score works</span>
        <ChevronDownIcon
          className={cn(
            "size-3.5 shrink-0 transition-transform duration-200",
            open && "rotate-180",
          )}
          aria-hidden
        />
      </button>

      {open ? (
        <div className="mt-3 space-y-3 text-xs text-muted-foreground leading-relaxed">
          <p className={cn(typography.bodyMuted, "text-xs")}>
            Your Self-Care Score reflects how often you currently practice
            different areas of self-care.
          </p>

          <div className="grid grid-cols-3 gap-2">
            {(
              [
                { stars: "★", label: "Rarely", value: "= 1" },
                { stars: "★★", label: "Sometimes", value: "= 2" },
                { stars: "★★★", label: "Often", value: "= 3" },
              ] as const
            ).map(({ stars, label, value }) => (
              <div
                key={label}
                className="rounded-lg bg-muted/60 px-2 py-1.5 text-center"
              >
                <p className="font-medium text-foreground tracking-tight">
                  {stars}
                </p>
                <p className="text-[10px] mt-0.5">{label}</p>
                <p className="text-[10px] text-muted-foreground">{value}</p>
              </div>
            ))}
          </div>

          <p className={cn(typography.bodyMuted, "text-xs")}>
            Each of the five areas — Body, Mind, People, Purpose, and Work —
            contributes equally to your overall score. Items you haven&apos;t
            assessed yet are not counted as zero.
          </p>
        </div>
      ) : null}
    </div>
  );
}
