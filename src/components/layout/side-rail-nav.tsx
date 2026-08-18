"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { isNavItemActive, mainNavItems } from "@/constants/navigation";
import { cn } from "@/lib/utils";

export function SideRailNav() {
  const pathname = usePathname();

  return (
    <nav
      className="border-border/60 bg-card/80 fixed inset-y-0 left-0 z-50 hidden w-16 flex-col items-center border-r py-4 shadow-sm backdrop-blur-md md:flex lg:hidden"
      aria-label="Main navigation"
    >
      <div className="flex flex-1 flex-col items-center gap-1 px-2">
        {mainNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = isNavItemActive(pathname, item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-label={item.label}
              title={item.label}
              className={cn(
                "relative flex size-11 items-center justify-center rounded-xl transition-colors",
                isActive
                  ? "bg-primary/10 text-primary shadow-sm"
                  : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
              )}
            >
              {isActive ? (
                <span
                  className="bg-primary absolute inset-y-2 -left-2 w-0.5 rounded-full"
                  aria-hidden
                />
              ) : null}
              <Icon className="size-5 shrink-0" aria-hidden />
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
