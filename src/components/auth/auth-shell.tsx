import Link from "next/link";

import { BrandMark } from "@/components/brand/brand-mark";
import { APP_NAME, APP_TAGLINE } from "@/constants/brand";
import { typography } from "@/lib/typography";
import { cn } from "@/lib/utils";

const copy = {
  login: {
    headline: "Welcome back",
    subcopy:
      "Continue taking care of yourself. Every day, one check at a time.",
  },
  signup: {
    headline: "Your next step starts here",
    subcopy:
      "A ready-made self-care checklist. Check in, add remarks, notice patterns.",
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
      <header className="space-y-3 pt-2 text-center">
        <div className="flex justify-center opacity-90">
          <Link href="/" aria-label={`${APP_NAME} home`}>
            <BrandMark size="sm" />
          </Link>
        </div>
        <p className={typography.authTagline}>{APP_TAGLINE}</p>
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
