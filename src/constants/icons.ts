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
  | "sage"
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
  "book-open": { icon: BookOpen, label: "Book", tone: "sage" },
  brain: { icon: Brain, label: "Mind", tone: "violet" },
  briefcase: { icon: Briefcase, label: "Work", tone: "sky" },
  coffee: { icon: Coffee, label: "Coffee", tone: "amber" },
  dumbbell: { icon: Dumbbell, label: "Fitness", tone: "sage" },
  flame: { icon: Flame, label: "Energy", tone: "amber" },
  "graduation-cap": { icon: GraduationCap, label: "Learning", tone: "sky" },
  handshake: { icon: Handshake, label: "Support", tone: "amber" },
  heart: { icon: Heart, label: "Heart", tone: "rose" },
  "heart-pulse": { icon: HeartPulse, label: "Health", tone: "sage" },
  leaf: { icon: Leaf, label: "Mindfulness", tone: "emerald" },
  "message-circle": { icon: MessageCircle, label: "Talk", tone: "sky" },
  moon: { icon: Moon, label: "Rest", tone: "violet" },
  palette: { icon: Palette, label: "Art", tone: "violet" },
  pencil: { icon: Pencil, label: "Journal", tone: "sage" },
  scale: { icon: Scale, label: "Balance", tone: "sky" },
  smartphone: { icon: Smartphone, label: "Phone", tone: "slate" },
  sparkles: { icon: Sparkles, label: "Growth", tone: "sage" },
  target: { icon: Target, label: "Goal", tone: "sage" },
  trees: { icon: Trees, label: "Nature", tone: "emerald" },
  users: { icon: Users, label: "People", tone: "rose" },
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
  sage: {
    bg: "bg-[color-mix(in_srgb,var(--category-body)_12%,white)] dark:bg-[color-mix(in_srgb,var(--category-body)_20%,black)]",
    text: "text-[var(--category-body)]",
  },
  rose: {
    bg: "bg-[color-mix(in_srgb,var(--category-people)_12%,white)] dark:bg-[color-mix(in_srgb,var(--category-people)_20%,black)]",
    text: "text-[var(--category-people)]",
  },
  emerald: {
    bg: "bg-emerald-100 dark:bg-emerald-950/50",
    text: "text-emerald-600 dark:text-emerald-400",
  },
  sky: {
    bg: "bg-[color-mix(in_srgb,var(--category-work)_12%,white)] dark:bg-[color-mix(in_srgb,var(--category-work)_20%,black)]",
    text: "text-[var(--category-work)]",
  },
  violet: {
    bg: "bg-[color-mix(in_srgb,var(--category-mind)_12%,white)] dark:bg-[color-mix(in_srgb,var(--category-mind)_20%,black)]",
    text: "text-[var(--category-mind)]",
  },
  amber: {
    bg: "bg-[color-mix(in_srgb,var(--category-purpose)_12%,white)] dark:bg-[color-mix(in_srgb,var(--category-purpose)_20%,black)]",
    text: "text-[var(--category-purpose)]",
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
