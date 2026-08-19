export const ONBOARDING_STEP_COUNT = 3;

export const ONBOARDING_STEPS = [
  {
    id: "checklist",
    title: "A ready-made checklist",
    description:
      "SUCHETA starts with five self-care areas. Rate each item and add an optional reflection note.",
    bullets: [
      "Body, Mind, People, Purpose, and Work items are ready on day one.",
      "Tap ★, ★★, or ★★★ to rate how often you practice each item. Tap the note icon to add a reflection.",
      "Hide items you don't need under Settings → Manage items.",
    ],
    domains: ["Body", "Mind", "People", "Purpose", "Work"],
  },
  {
    id: "custom",
    title: "Add your own practices",
    description:
      "Create extra items in any domain, with daily, weekly, or custom schedules.",
    bullets: [
      "Use Create in the nav to add something that matters to you.",
      "Group custom items into a default domain or a category you create.",
      "Use the month calendar on Check-in to review any past day.",
    ],
  },
  {
    id: "metrics",
    title: "Your Self-Care Score",
    description:
      "One score — based on how often you practice self-care across each area.",
    bullets: [
      "Rate items ★ (Rarely), ★★ (Sometimes), or ★★★ (Often) to build your score.",
      "Body, Mind, People, Purpose, and Work each contribute equally — 20% each.",
      "Your streak and daily progress are shown as supporting context, not part of the score.",
      "Improvement flags and notes never change your score. They are for reflection only.",
    ],
    previewScore: 72,
    previewMetrics: [
      { metricKey: "completionRate" as const, value: "85%" },
      { metricKey: "currentStreak" as const, value: "12", unit: "days" },
      { metricKey: "growthTrend" as const, value: "+5%", trendValue: 0.05 },
    ],
  },
] as const;

export const METRIC_DEFINITIONS = [
  {
    title: "Completion Rate",
    description:
      "Completed scheduled days divided by total scheduled days across all visible items in the last 30 days.",
    window: "Rolling 30 days",
  },
  {
    title: "Body",
    description: "Completion rate for Body self-care items.",
    window: "Rolling 30 days",
  },
  {
    title: "People",
    description: "Completion rate for People / social items.",
    window: "Rolling 30 days",
  },
  {
    title: "Mind",
    description: "Completion rate for Mind / emotional items.",
    window: "Rolling 30 days",
  },
  {
    title: "Purpose",
    description: "Completion rate for Purpose / spiritual items.",
    window: "Rolling 30 days",
  },
  {
    title: "Work",
    description: "Completion rate for Work / professional items.",
    window: "Rolling 30 days",
  },
  {
    title: "Current Streak",
    description:
      "Consecutive days with at least one completed care item, counting back from today.",
    window: "All time",
  },
  {
    title: "Transformation",
    description:
      "How your completion rate changed compared to the previous 30-day window.",
    window: "30 days vs prior 30 days",
  },
  {
    title: "Steps Forward",
    description: "Total lifetime completed check-ins.",
    window: "All time",
  },
  {
    title: "Strongest Domain",
    description: "The domain with the highest completion rate in the current window.",
    window: "Rolling 30 days",
  },
  {
    title: "Needs Attention",
    description: "The domain with the lowest completion rate.",
    window: "Rolling 30 days",
  },
  {
    title: "Score Trend",
    description:
      "Your care consistency trend recalculated each day using a rolling 30-day window.",
    window: "Daily rolling 30 days",
  },
] as const;

export const INSIGHTS_READINESS_NOTE =
  "Insights unlock once you have at least one item and either 3+ total completions or any completion rate above 0%.";
