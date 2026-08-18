"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { BrandMark } from "@/components/brand/brand-mark";
import { UserAvatar } from "@/components/layout/user-avatar";
import { mainNavItems } from "@/constants/navigation";
import { APP_NAME } from "@/constants/brand";
import { pageContentPadding, SHELL_HEADER_HEIGHT } from "@/lib/layout";
import {
  formatDisplayName,
  getGreetingTime,
  typography,
} from "@/lib/typography";
import { cn } from "@/lib/utils";

const pageTitles: Record<string, string> = {
  "/dashboard": "Home",
  "/check-in": "Check-in",
  "/create": "Create item",
  "/insights": "Insights",
  "/settings": "Settings",
  "/profile": "Profile",
  "/categories": "Categories",
  "/reports": "Reports",
};

function getPageTitle(pathname: string): string {
  if (pageTitles[pathname]) return pageTitles[pathname];

  for (const item of mainNavItems) {
    if (pathname.startsWith(`${item.href}/`)) {
      return item.label;
    }
  }

  if (pathname.startsWith("/settings/")) return "Settings";
  if (pathname.startsWith("/categories/")) return "Category";

  return APP_NAME;
}

type AppTopBarProps = {
  displayName?: string | null;
  email?: string | null;
  avatarUrl?: string | null;
};

export function AppTopBar({
  displayName,
  email,
  avatarUrl,
}: AppTopBarProps) {
  const pathname = usePathname();
  const pageTitle = getPageTitle(pathname);
  const greeting = getGreetingTime();
  const formattedName = displayName ? formatDisplayName(displayName) : null;

  return (
    <header className="top-0 z-40 hidden md:block">
      {/* Tablet: compact bar with logo */}
      <div
        className={cn(
          SHELL_HEADER_HEIGHT,
          "flex shrink-0 items-center justify-between gap-4 px-6 lg:hidden",
        )}
      >
        <div className="flex min-w-0 items-center gap-4">
          <Link
            href="/dashboard"
            className="shrink-0"
            aria-label={`${APP_NAME} home`}
          >
              <BrandMark size="sm" />
          </Link>
          <div className="min-w-0">
            <p className={cn(typography.greetingTime, "text-xs")}>
              {greeting}
              {formattedName ? `, ${formattedName}` : ""}
            </p>
            <h1 className={cn(typography.sectionTitle, "truncate")}>
              {pageTitle}
            </h1>
          </div>
        </div>

        <Link
          href="/profile"
          className="flex size-10 shrink-0 items-center justify-center rounded-full transition-opacity hover:opacity-80"
          aria-label="Open profile"
        >
          <UserAvatar
            displayName={displayName}
            email={email}
            avatarUrl={avatarUrl}
            size="md"
          />
        </Link>
      </div>

      {/* Desktop: greeting + title, aligned with page content */}
      <div
        className={cn(
          typography.pageContainer,
          pageContentPadding,
          "hidden pb-4 pt-8 lg:block",
        )}
      >
        <p className={typography.greetingTime}>
          {greeting}
          {formattedName ? `, ${formattedName}` : ""}
        </p>
        <h1 className={cn(typography.screenTitle, "mt-1")}>{pageTitle}</h1>
      </div>
    </header>
  );
}
