import {
  BarChart3Icon,
  CheckSquareIcon,
  HomeIcon,
  PlusCircleIcon,
  SettingsIcon,
} from "lucide-react";

export const mainNavItems = [
  { href: "/dashboard", label: "Home", icon: HomeIcon },
  { href: "/check-in", label: "Check-in", icon: CheckSquareIcon },
  { href: "/create", label: "Create", icon: PlusCircleIcon },
  { href: "/insights", label: "Insights", icon: BarChart3Icon },
  { href: "/settings", label: "Settings", icon: SettingsIcon },
] as const;

export function isNavItemActive(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}
