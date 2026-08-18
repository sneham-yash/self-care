"use client";

import {
  formatDisplayName,
  getGreetingTime,
  typography,
} from "@/lib/typography";
import { cn } from "@/lib/utils";

type HomeHeaderProps = {
  greetingTime?: string;
  displayName?: string | null;
  dateLabel: string;
  className?: string;
};

export function HomeHeader({
  greetingTime = getGreetingTime(),
  displayName,
  dateLabel,
  className,
}: HomeHeaderProps) {
  const formattedName = displayName ? formatDisplayName(displayName) : null;

  return (
    <header className={cn("space-y-1.5", className)}>
      <p className={typography.greetingTime}>{greetingTime},</p>
      {formattedName ? (
        <h1 className={cn(typography.greetingName, "break-words")}>
          {formattedName} 👋
        </h1>
      ) : (
        <h1 className={cn(typography.greetingName, "break-words")}>
          {greetingTime} 👋
        </h1>
      )}
      <p className={cn(typography.greetingTime, "text-muted-foreground/80")}>
        {dateLabel}
      </p>
    </header>
  );
}

export { getGreetingTime };

