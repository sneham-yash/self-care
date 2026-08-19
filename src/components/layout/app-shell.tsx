import { AppHeader } from "@/components/layout/app-header";
import { AppTopBar } from "@/components/layout/app-top-bar";
import { BottomNav } from "@/components/layout/bottom-nav";
import { SideRailNav } from "@/components/layout/side-rail-nav";
import { SidebarNav } from "@/components/layout/sidebar-nav";
import { pageContentPadding } from "@/lib/layout";
import { typography } from "@/lib/typography";
import { cn } from "@/lib/utils";

type AppShellProps = {
  children: React.ReactNode;
  displayName?: string | null;
  email?: string | null;
  avatarUrl?: string | null;
};

export function AppShell({
  children,
  displayName,
  email,
  avatarUrl,
}: AppShellProps) {
  return (
    <div className="bg-background min-h-svh overflow-x-clip pb-20 pt-14 md:pb-8 md:pl-16 md:pt-0 lg:pl-48 desktop:pl-60">
      <AppHeader
        displayName={displayName}
        email={email}
        avatarUrl={avatarUrl}
      />

      <SideRailNav />
      <SidebarNav
        displayName={displayName}
        email={email}
        avatarUrl={avatarUrl}
      />

      <div className="flex min-h-svh min-w-0 flex-col md:min-h-[100svh]">
        <AppTopBar
          displayName={displayName}
          email={email}
          avatarUrl={avatarUrl}
        />
        <main
          className={cn(
            typography.pageContainer,
            pageContentPadding,
            "min-h-[calc(100svh-3.5rem-5rem)] min-w-0 flex-1 py-6 md:min-h-0 md:py-6 lg:pt-0 lg:pb-8",
          )}
        >
          {children}
        </main>
      </div>

      <BottomNav />
    </div>
  );
}
