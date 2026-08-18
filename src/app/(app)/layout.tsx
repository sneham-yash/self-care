import { redirect } from "next/navigation";

import { AppShell } from "@/components/layout/app-shell";
import { TutorialProvider } from "@/components/tutorial/tutorial-provider";
import { createClient } from "@/lib/supabase/server";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name, avatar_url, onboarding_completed_at")
    .eq("id", user.id)
    .maybeSingle();

  const profileData = profile as {
    display_name: string | null;
    avatar_url: string | null;
    onboarding_completed_at: string | null;
  } | null;

  const showOnboarding = !profileData?.onboarding_completed_at;

  return (
    <TutorialProvider showOnboarding={showOnboarding}>
      <AppShell
        displayName={profileData?.display_name}
        email={user.email}
        avatarUrl={profileData?.avatar_url}
      >
        {children}
      </AppShell>
    </TutorialProvider>
  );
}
