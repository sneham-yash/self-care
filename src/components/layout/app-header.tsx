"use client";

import Link from "next/link";

import { BrandMark } from "@/components/brand/brand-mark";
import { UserAvatar } from "@/components/layout/user-avatar";
import { APP_NAME } from "@/constants/brand";

type AppHeaderProps = {
  displayName?: string | null;
  email?: string | null;
  avatarUrl?: string | null;
};

export function AppHeader({ displayName, email, avatarUrl }: AppHeaderProps) {
  return (
    <header className="border-border/60 bg-background/90 fixed inset-x-0 top-0 z-50 border-b backdrop-blur-md supports-[backdrop-filter]:bg-background/80 md:hidden">
      <div className="mx-auto flex h-14 max-w-lg items-center justify-between px-4">
        <Link href="/" className="shrink-0" aria-label={`${APP_NAME} home`}>
          <BrandMark size="sm" />
        </Link>

        <Link
          href="/profile"
          className="flex size-11 items-center justify-center rounded-full transition-opacity hover:opacity-80"
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
    </header>
  );
}
