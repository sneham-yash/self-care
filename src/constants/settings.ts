import {
  BellIcon,
  DownloadIcon,
  FolderOpenIcon,
  GraduationCapIcon,
  InfoIcon,
  ListChecksIcon,
  PaletteIcon,
} from "lucide-react";

export const settingsNavItems = [
  {
    href: "/settings/tutorial",
    label: "Tutorial",
    description: "Learn the app and how scores work",
    icon: GraduationCapIcon,
  },
  {
    href: "/settings/manage-items",
    label: "Manage items",
    description: "Hide defaults or edit your custom items",
    icon: ListChecksIcon,
  },
  {
    href: "/settings/categories",
    label: "Manage categories",
    description: "Organize self-care domains",
    icon: FolderOpenIcon,
  },
  {
    href: "/settings/appearance",
    label: "Appearance",
    description: "Light, dark, or system theme",
    icon: PaletteIcon,
  },
  {
    href: "/settings/notifications",
    label: "Notifications",
    description: "Reminder preferences",
    icon: BellIcon,
  },
  {
    href: "/reports",
    label: "Reports",
    description: "Download daily, weekly, or monthly PDFs",
    icon: DownloadIcon,
  },
  {
    href: "/settings/about",
    label: "About Nourish",
    description: "App info and version",
    icon: InfoIcon,
  },
] as const;
