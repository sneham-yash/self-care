"use client";

import Link from "next/link";

import { BrandMark } from "@/components/brand/brand-mark";
import { ThemeModePicker } from "@/components/theme/theme-mode-picker";
import { Button } from "@/components/ui/button";
import { LandingReveal } from "@/components/landing/landing-reveal";
import { LANDING_DASHBOARD_CTA } from "@/constants/landing";
import { APP_NAME } from "@/constants/brand";

type LandingNavProps = {
  isAuthenticated: boolean;
};

export function LandingNav({ isAuthenticated }: LandingNavProps) {
  return (
    <LandingReveal immediate variant="fade-in" delay={0}>
      <header className="border-border/40 bg-background/80 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 border-b backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-6">
          <Link
            href="/"
            className="shrink-0 opacity-90 transition-opacity hover:opacity-100"
            aria-label={`${APP_NAME} home`}
          >
            <BrandMark size="sm" />
          </Link>

          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeModePicker />
            {isAuthenticated ? (
              <Button size="sm" asChild>
                <Link href="/dashboard">{LANDING_DASHBOARD_CTA}</Link>
              </Button>
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  asChild
                  className="hidden sm:inline-flex"
                >
                  <Link href="/login">Log in</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link href="/signup">Get Started</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </header>
    </LandingReveal>
  );
}
