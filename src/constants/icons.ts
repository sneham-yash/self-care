import type { LucideIcon } from "lucide-react";
import {
  Apple,
  BookOpen,
  Brain,
  Briefcase,
  Coffee,
  Dumbbell,
  Flame,
  GraduationCap,
  Handshake,
  Heart,
  HeartPulse,
  Leaf,
  MessageCircle,
  Moon,
  Palette,
  Pencil,
  Scale,
  Smartphone,
  Sparkles,
  Target,
  Trees,
  Users,
  Zap,
  type LucideProps,
} from "lucide-react";

export type IconName =
  | "apple"
  | "book-open"
  | "brain"
  | "briefcase"
  | "coffee"
  | "dumbbell"
  | "flame"
  | "graduation-cap"
  | "handshake"
  | "heart"
  | "heart-pulse"
  | "leaf"
  | "message-circle"
  | "moon"
  | "palette"
  | "pencil"
  | "scale"
  | "smartphone"
  | "sparkles"
  | "target"
  | "trees"
  | "users"
  | "zap";

export type IconTone =
  | "orange"
  | "rose"
  | "emerald"
  | "sky"
  | "violet"
  | "amber"
  | "slate";

export const ICON_REGISTRY: Record<
  IconName,
  { icon: LucideIcon; label: string; tone: IconTone }
> = {
  apple: { icon: Apple, label: "Food", tone: "emerald" },
  "book-open": { icon: BookOpen, label: "Book", tone: "orange" },
  brain: { icon: Brain, label: "Mind", tone: "violet" },
  briefcase: { icon: Briefcase, label: "Work", tone: "sky" },
  coffee: { icon: Coffee, label: "Coffee", tone: "amber" },
  dumbbell: { icon: Dumbbell, label: "Fitness", tone: "rose" },
  flame: { icon: Flame, label: "Energy", tone: "orange" },
  "graduation-cap": { icon: GraduationCap, label: "Learning", tone: "sky" },
  handshake: { icon: Handshake, label: "Support", tone: "amber" },
  heart: { icon: Heart, label: "Heart", tone: "rose" },
  "heart-pulse": { icon: HeartPulse, label: "Health", tone: "rose" },
  leaf: { icon: Leaf, label: "Mindfulness", tone: "emerald" },
  "message-circle": { icon: MessageCircle, label: "Talk", tone: "sky" },
  moon: { icon: Moon, label: "Rest", tone: "violet" },
  palette: { icon: Palette, label: "Art", tone: "violet" },
  pencil: { icon: Pencil, label: "Journal", tone: "orange" },
  scale: { icon: Scale, label: "Balance", tone: "sky" },
  smartphone: { icon: Smartphone, label: "Phone", tone: "slate" },
  sparkles: { icon: Sparkles, label: "Growth", tone: "orange" },
  target: { icon: Target, label: "Goal", tone: "orange" },
  trees: { icon: Trees, label: "Nature", tone: "emerald" },
  users: { icon: Users, label: "People", tone: "sky" },
  zap: { icon: Zap, label: "Energy", tone: "sky" },
};

export const ICON_PICKER_OPTIONS = Object.entries(ICON_REGISTRY).map(
  ([name, meta]) => ({
    name: name as IconName,
    ...meta,
  }),
);

export const DEFAULT_CARE_ICON: IconName = "sparkles";

export const ICON_TONE_CLASSES: Record<
  IconTone,
  { bg: string; text: string }
> = {
  orange: {
    bg: "bg-orange-100 dark:bg-orange-950/50",
    text: "text-orange-600 dark:text-orange-400",
  },
  rose: {
    bg: "bg-rose-100 dark:bg-rose-950/50",
    text: "text-rose-600 dark:text-rose-400",
  },
  emerald: {
    bg: "bg-emerald-100 dark:bg-emerald-950/50",
    text: "text-emerald-600 dark:text-emerald-400",
  },
  sky: {
    bg: "bg-sky-100 dark:bg-sky-950/50",
    text: "text-sky-600 dark:text-sky-400",
  },
  violet: {
    bg: "bg-violet-100 dark:bg-violet-950/50",
    text: "text-violet-600 dark:text-violet-400",
  },
  amber: {
    bg: "bg-amber-100 dark:bg-amber-950/50",
    text: "text-amber-600 dark:text-amber-400",
  },
  slate: {
    bg: "bg-slate-100 dark:bg-slate-800/60",
    text: "text-slate-600 dark:text-slate-300",
  },
};

export function resolveIconName(
  icon: string | null | undefined,
): IconName {
  if (icon && icon in ICON_REGISTRY) {
    return icon as IconName;
  }
  return DEFAULT_CARE_ICON;
}

export function getLucideIcon(
  icon: string | null | undefined,
): LucideIcon {
  return ICON_REGISTRY[resolveIconName(icon)].icon;
}

export type IconDisplayProps = LucideProps;
