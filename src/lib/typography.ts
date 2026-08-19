export const typography = {
  screenTitle:
    "font-display text-2xl font-semibold tracking-tight text-foreground",
  screenTitleLg:
    "font-display text-3xl font-semibold tracking-tight text-foreground md:text-4xl",
  screenSubtitle: "font-sans text-sm text-muted-foreground leading-relaxed",
  pageContainer:
    "mx-auto w-full min-w-0 max-w-lg md:max-w-4xl lg:max-w-6xl xl:max-w-7xl",
  sectionTitle: "font-display text-lg font-semibold tracking-tight",
  metricLabel:
    "font-display text-[11px] font-medium tracking-wide text-muted-foreground",
  metricValue:
    "font-display text-4xl font-bold tracking-tight text-foreground",
  metricValueSm: "font-display text-2xl font-bold tracking-tight",
  greetingTime: "font-sans text-sm text-muted-foreground",
  greetingName:
    "font-display text-[1.75rem] font-semibold leading-tight tracking-tight",
  bodyText: "font-sans text-sm leading-relaxed text-foreground",
  bodyMuted: "font-sans text-sm leading-relaxed text-muted-foreground",
  navLabel: "font-sans text-xs font-medium",
  formLabel: "font-sans text-sm font-medium leading-none",
  dialogTitle: "font-display text-lg font-semibold leading-none",
  authHeadline:
    "font-display text-[1.625rem] font-semibold tracking-tight leading-tight text-foreground",
  authTagline:
    "font-sans italic text-sm font-normal tracking-wide text-muted-foreground",
  brandTagline:
    "font-sans italic font-normal tracking-wide text-muted-foreground",
  landingHeadline:
    "font-display text-4xl font-semibold tracking-tight leading-[1.1] text-foreground md:text-5xl lg:text-6xl",
  landingSectionTitle:
    "font-display text-3xl font-semibold tracking-tight text-foreground md:text-4xl",
  landingLead:
    "font-sans text-lg leading-relaxed text-muted-foreground md:text-xl",
  landingEyebrow:
    "font-display text-xs font-medium tracking-widest text-primary",
} as const;

export function formatDisplayName(name: string): string {
  const first = name.trim().split(/\s+/)[0] ?? name;
  return first.charAt(0).toUpperCase() + first.slice(1).toLowerCase();
}

export function getGreetingTime(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}
