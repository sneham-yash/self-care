import Link from "next/link";

import { BrandMark } from "@/components/brand/brand-mark";
import { APP_NAME } from "@/constants/brand";
import { typography } from "@/lib/typography";
import { cn } from "@/lib/utils";

const copy = {
  login: {
    headline: "Welcome back",
    subcopy:
      "Your space for calm, care, and reflection is ready.",
  },
  signup: {
    headline: "Begin your journey",
    subcopy:
      "A gentle, personal space for self-care. Check in daily, reflect, and watch yourself bloom.",
  },
} as const;

type AuthShellProps = {
  variant: keyof typeof copy;
  children: React.ReactNode;
  footer: React.ReactNode;
};

export function AuthShell({ variant, children, footer }: AuthShellProps) {
  const { headline, subcopy } = copy[variant];

  return (
    <div
      className={cn(
        "relative space-y-8",
        "motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-3 motion-safe:duration-500",
      )}
    >
      <header className="space-y-5 pt-2 text-center">
        <div className="flex justify-center">
          <Link
            href="/"
            className="opacity-95 transition-opacity hover:opacity-100"
            aria-label={`${APP_NAME} home`}
          >
            <BrandMark size="md" />
          </Link>
        </div>
        <div className="space-y-2">
          <h1 className={typography.authHeadline}>{headline}</h1>
          <p className={cn(typography.bodyMuted, "text-pretty")}>{subcopy}</p>
        </div>
      </header>

      <div className="space-y-5">{children}</div>

      <footer className="text-center">{footer}</footer>
    </div>
  );
}
