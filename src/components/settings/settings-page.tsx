"use client";

import Link from "next/link";
import { ChevronRightIcon, LogOutIcon } from "lucide-react";

import { signOut } from "@/app/(auth)/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { settingsNavItems } from "@/constants/settings";
import { typography } from "@/lib/typography";
import { cn } from "@/lib/utils";

export function SettingsPage() {
  return (
    <>
      <div className="space-y-6 md:hidden">
        <div className="space-y-1">
          <h1 className={typography.screenTitle}>Settings</h1>
          <p className={typography.screenSubtitle}>Configuration</p>
        </div>

        <Card className="gap-0 py-0">
          <CardContent className="divide-border divide-y p-0">
            {settingsNavItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="hover:bg-muted/50 flex items-center gap-3 px-4 py-2.5 transition-colors"
                >
                  <Icon
                    className="text-muted-foreground size-5 shrink-0"
                    aria-hidden
                  />
                  <div className="min-w-0 flex-1">
                    <p className={typography.bodyText}>{item.label}</p>
                    <p className={cn(typography.bodyMuted, "text-xs")}>
                      {item.description}
                    </p>
                  </div>
                  <ChevronRightIcon
                    className="text-muted-foreground size-4 shrink-0"
                    aria-hidden
                  />
                </Link>
              );
            })}
          </CardContent>
        </Card>

        <form action={signOut}>
          <Button type="submit" variant="outline" className="w-full">
            <LogOutIcon />
            Logout
          </Button>
        </form>
      </div>

      <div className="hidden md:block">
        <Card className="border-primary/15 bg-gradient-to-br from-primary/[0.04] to-card">
          <CardContent className="space-y-2 p-6 lg:p-8">
            <h1 className={typography.screenTitleLg}>Welcome to Settings</h1>
            <p className={cn(typography.bodyText, "max-w-lg leading-relaxed")}>
              Manage your items, categories, appearance, and account from the
              panel on the left. Every option from the mobile app is available
              here.
            </p>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
