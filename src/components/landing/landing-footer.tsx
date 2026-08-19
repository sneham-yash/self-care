import Link from "next/link";

import { BrandMark } from "@/components/brand/brand-mark";
import { CreatorCredit } from "@/components/brand/creator-credit";
import { LandingReveal } from "@/components/landing/landing-reveal";

export function LandingFooter() {
  return (
    <LandingReveal variant="fade-in">
      <footer className="border-border/40 border-t">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-10 sm:flex-row">
          <div className="flex justify-center sm:justify-start">
            <BrandMark size="sm" />
          </div>

          <div className="flex items-center gap-6">
            <Link
              href="/login"
              className="text-muted-foreground hover:text-foreground text-sm transition-colors"
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className="text-primary text-sm font-medium transition-colors hover:underline"
            >
              Get Started
            </Link>
          </div>
        </div>

        <div className="border-border/40 border-t">
          <CreatorCredit variant="landing" />
        </div>
      </footer>
    </LandingReveal>
  );
}
