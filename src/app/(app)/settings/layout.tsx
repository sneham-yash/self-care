import { SettingsNavPanel } from "@/components/settings/settings-nav-panel";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="md:flex md:items-start md:gap-8 lg:gap-10">
      <SettingsNavPanel />
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
