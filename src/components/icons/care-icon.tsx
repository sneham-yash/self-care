"use client";

import {
  getLucideIcon,
  ICON_REGISTRY,
  ICON_TONE_CLASSES,
  resolveIconName,
  type IconName,
} from "@/constants/icons";
import { getCategoryVisuals } from "@/constants/categories";
import { cn } from "@/lib/utils";

type CareIconProps = {
  icon?: string | null;
  categoryName?: string | null;
  size?: "sm" | "md" | "lg";
  className?: string;
};

const sizeClasses = {
  sm: "size-9 rounded-lg [&_svg]:size-4",
  md: "size-11 rounded-xl [&_svg]:size-5",
  lg: "size-14 rounded-2xl [&_svg]:size-6",
};

export function CareIcon({
  icon,
  categoryName,
  size = "md",
  className,
}: CareIconProps) {
  let iconName: IconName;

  if (categoryName) {
    const visuals = getCategoryVisuals(categoryName, icon);
    iconName = resolveIconName(visuals.iconName);
  } else {
    iconName = resolveIconName(icon);
  }

  const tone = ICON_TONE_CLASSES[ICON_REGISTRY[iconName]?.tone ?? "sage"];
  const LucideIcon = getLucideIcon(iconName);

  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center",
        sizeClasses[size],
        tone.bg,
        tone.text,
        className,
      )}
      aria-hidden
    >
      <LucideIcon />
    </div>
  );
}
