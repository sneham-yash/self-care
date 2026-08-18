"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOutIcon } from "lucide-react";

import { signOut } from "@/app/(auth)/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { settingsNavItems } from "@/constants/settings";
import { typography } from "@/lib/typography";
import { cn } from "@/lib/utils";

export function SettingsNavPanel() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:block md:w-72 md:shrink-0 lg:w-80">
      <div className="sticky top-20 space-y-4">
        <div className="space-y-1">
          <h2 className={typography.screenTitleLg}>Settings</h2>
          <p className={typography.screenSubtitle}>Configuration</p>
        </div>

        <Card className="gap-0 py-0">
          <CardContent className="divide-border divide-y p-0">
            {settingsNavItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                pathname === item.href || pathname.startsWith(`${item.href}/`);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-4 py-2.5 transition-colors",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "hover:bg-muted/50",
                  )}
                >
                  <Icon
                    className={cn(
                      "size-5 shrink-0",
                      isActive ? "text-primary" : "text-muted-foreground",
                    )}
                    aria-hidden
                  />
                  <div className="min-w-0 flex-1">
                    <p
                      className={cn(
                        typography.bodyText,
                        isActive && "font-medium",
                      )}
                    >
                      {item.label}
                    </p>
                    <p className={cn(typography.bodyMuted, "text-xs")}>
                      {item.description}
                    </p>
                  </div>
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
    </aside>
  );
}
