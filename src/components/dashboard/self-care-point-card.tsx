"use client";

import { MessageSquareTextIcon, SaveIcon } from "lucide-react";
import { useState } from "react";

import { getLucideIcon, resolveIconName } from "@/constants/icons";
import { getCarePointDomain, CARE_POINT_INTENSITY_LABELS } from "@/constants/care-points";
import type { CareIntensityLevel } from "@/constants/care";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type { TodayCareItem } from "@/lib/care-logs/api";

type SelfCarePointCardProps = {
  item: TodayCareItem;
  isPending?: boolean;
  /** Score-neutral flag — does not affect Self-Care Score. */
  wantsImprovement?: boolean;
  onSetIntensity: (itemId: string, intensity: CareIntensityLevel) => void;
  onSaveRemark: (itemId: string, remark: string) => void;
  onToggleImprovement?: (itemId: string, current: boolean) => void;
};

const INTENSITY_STARS: Record<1 | 2 | 3, string> = {
  1: "★",
  2: "★★",
  3: "★★★",
};

export function SelfCarePointCard({
  item,
  isPending,
  wantsImprovement = false,
  onSetIntensity,
  onSaveRemark,
  onToggleImprovement,
}: SelfCarePointCardProps) {
  const [remarkOpen, setRemarkOpen] = useState(false);
  const [draft, setDraft] = useState(item.remark ?? "");

  const domain = getCarePointDomain(item.category_slug);
  const label = domain?.label ?? item.category_name;

  const iconName = resolveIconName(item.icon);
  const LucideIcon = getLucideIcon(iconName);

  function handleIntensityClick(level: CareIntensityLevel) {
    onSetIntensity(item.id, level);
  }

  function handleSave() {
    onSaveRemark(item.id, draft);
    setRemarkOpen(false);
  }

  const prompt = item.description?.trim()
    ? item.description
    : "How often did you do this today?";

  return (
    <article className="rounded-2xl border border-border/70 bg-card p-4 shadow-sm transition-shadow hover:shadow-md dark:border-border/40">
      {/* Header: icon + title + badge */}
      <div className="flex items-start gap-3">
        <div
          className={cn(
            "flex size-11 shrink-0 items-center justify-center rounded-xl",
            domain ? [domain.bgLight, domain.bgDark] : "bg-muted",
          )}
          aria-hidden
        >
          <LucideIcon className="size-5 text-white" />
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold leading-snug">{item.name}</p>
          {domain ? (
            <span
              className={cn(
                "mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-medium",
                domain.badgeBgLight,
                domain.badgeBgDark,
                domain.badgeTextLight,
                domain.badgeTextDark,
              )}
            >
              {label}
            </span>
          ) : null}
        </div>
      </div>

      {/* Prompt text */}
      <p className="mt-3 text-xs text-muted-foreground">{prompt}</p>

      {/* Intensity pills row */}
      <div className="mt-3 flex items-center gap-2">
        <div
          className="flex flex-1 gap-1.5"
          role="radiogroup"
          aria-label={`Intensity for ${item.name}`}
        >
          {([1, 2, 3] as const).map((level) => {
            const selected = item.intensity === level;
            return (
              <button
                key={level}
                type="button"
                role="radio"
                aria-checked={selected}
                disabled={isPending}
                onClick={() => handleIntensityClick(level)}
                className={cn(
                  "flex flex-1 items-center justify-center rounded-full border px-2 py-1.5 text-xs font-medium transition-all",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
                  isPending && "opacity-50",
                  selected && domain
                    ? [
                        domain.bgLight,
                        domain.bgDark,
                        domain.textLight,
                        domain.textDark,
                        "border-transparent shadow-sm",
                      ]
                    : domain
                    ? [
                        domain.borderLight,
                        domain.borderDark,
                        "bg-transparent text-muted-foreground hover:text-foreground",
                      ]
                    : selected
                    ? "border-transparent bg-foreground text-background"
                    : "border-border text-muted-foreground hover:text-foreground",
                )}
              >
                <span className="mr-1 tracking-tight" aria-hidden>
                  {INTENSITY_STARS[level]}
                </span>
                {CARE_POINT_INTENSITY_LABELS[level]}
              </button>
            );
          })}
        </div>

        {/* Note button */}
        <button
          type="button"
          disabled={isPending}
          onClick={() => {
            if (remarkOpen) {
              handleSave();
            } else {
              setDraft(item.remark ?? "");
              setRemarkOpen(true);
            }
          }}
          className={cn(
            "flex size-8 shrink-0 items-center justify-center rounded-lg border transition-colors",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
            remarkOpen
              ? "border-primary bg-primary text-primary-foreground"
              : item.remark
              ? "border-primary/40 bg-primary/8 text-primary"
              : "border-border bg-background text-muted-foreground hover:border-primary/50 hover:text-foreground",
          )}
          aria-label={remarkOpen ? `Save note for ${item.name}` : `Add note for ${item.name}`}
          aria-expanded={remarkOpen}
        >
          {remarkOpen ? (
            <SaveIcon className="size-3.5" />
          ) : (
            <MessageSquareTextIcon className="size-3.5" />
          )}
        </button>
      </div>

      {/* Inline note area */}
      {remarkOpen ? (
        <div className="mt-3 space-y-1">
          <p className="text-xs text-muted-foreground">My note (optional)</p>
          <Textarea
            value={draft}
            rows={2}
            maxLength={200}
            placeholder="Write something…"
            onChange={(e) => setDraft(e.target.value)}
            onBlur={handleSave}
            className="min-h-14 resize-none text-sm"
          />
          <p className="text-right text-xs text-muted-foreground">
            {draft.length}/200
          </p>
        </div>
      ) : item.remark ? (
        <div className="mt-3 rounded-lg bg-muted/60 px-3 py-2">
          <p className="text-xs text-muted-foreground">My note (optional)</p>
          <p className="mt-0.5 text-sm">{item.remark}</p>
        </div>
      ) : null}

      {/* Score-neutral improvement flag — does NOT affect the Self-Care Score */}
      {onToggleImprovement ? (
        <div className="mt-3 border-t border-border/50 pt-3">
          <button
            type="button"
            disabled={isPending}
            onClick={() => onToggleImprovement(item.id, wantsImprovement)}
            className={cn(
              "flex items-center gap-2 text-xs transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 rounded",
              wantsImprovement
                ? "text-primary font-medium"
                : "text-muted-foreground hover:text-foreground",
            )}
            aria-pressed={wantsImprovement}
            aria-label={`I'd like to improve ${item.name}`}
          >
            <span
              className={cn(
                "flex size-4 items-center justify-center rounded border text-[10px] transition-colors",
                wantsImprovement
                  ? "border-primary bg-primary/15"
                  : "border-border",
              )}
              aria-hidden
            >
              {wantsImprovement ? "✓" : ""}
            </span>
            I&apos;d like to improve this
          </button>
        </div>
      ) : null}
    </article>
  );
}
