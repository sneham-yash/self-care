"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { BrandMark } from "@/components/brand/brand-mark";
import { UserAvatar } from "@/components/layout/user-avatar";
import { isNavItemActive, mainNavItems } from "@/constants/navigation";
import { APP_NAME } from "@/constants/brand";
import { shellHeaderClass } from "@/lib/layout";
import { typography } from "@/lib/typography";
import { cn } from "@/lib/utils";

type SidebarNavProps = {
  displayName?: string | null;
  email?: string | null;
  avatarUrl?: string | null;
};

export function SidebarNav({
  displayName,
  email,
  avatarUrl,
}: SidebarNavProps) {
  const pathname = usePathname();

  return (
      <nav
      className="border-border bg-card/90 fixed inset-y-0 left-0 z-50 hidden w-48 flex-col border-r backdrop-blur-md desktop:w-60 lg:flex shadow-[2px_0_20px_var(--shadow)]"
      aria-label="Main navigation"
    >
      <div className={cn(shellHeaderClass, "px-4 desktop:px-5")}>
        <Link href="/dashboard" aria-label={`${APP_NAME} home`}>
          <BrandMark size="sm" />
        </Link>
      </div>

      <div className="flex flex-1 flex-col gap-0.5 px-2 py-3 desktop:gap-1 desktop:px-3 desktop:py-4">
        {mainNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = isNavItemActive(pathname, item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                typography.navLabel,
                "relative flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-sm transition-colors desktop:gap-3 desktop:px-3 desktop:py-2.5",
                isActive
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
              )}
            >
              {isActive ? (
                <span
                  className="bg-primary absolute inset-y-2 left-0 w-0.5 rounded-full"
                  aria-hidden
                />
              ) : null}
              <Icon className="size-5 shrink-0" aria-hidden />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>

      <div className="border-border/60 border-t p-2 desktop:p-3">
        <Link
          href="/profile"
          className="hover:bg-muted/60 flex items-center gap-2.5 rounded-xl px-2.5 py-2 transition-colors desktop:gap-3 desktop:px-3 desktop:py-2.5"
        >
          <UserAvatar
            displayName={displayName}
            email={email}
            avatarUrl={avatarUrl}
            size="sm"
          />
          <div className="min-w-0 flex-1">
            <p className={cn(typography.bodyText, "truncate text-sm font-medium")}>
              {displayName?.trim() || "Profile"}
            </p>
            <p className={cn(typography.bodyMuted, "truncate text-xs")}>
              {email}
            </p>
          </div>
        </Link>
      </div>
    </nav>
  );
}
