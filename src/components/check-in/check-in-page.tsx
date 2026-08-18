"use client";

import { CheckInView } from "@/components/check-in/check-in-view";
import { typography } from "@/lib/typography";

export function CheckInPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-1 md:hidden">
        <h1 className={typography.screenTitle}>Check-in</h1>
        <p className={typography.screenSubtitle}>How did you take care of yourself?</p>
      </div>
      <CheckInView />
    </div>
  );
}
