import {
  BarChart3,
  CalendarDays,
  CheckSquare,
  Download,
  Layers,
  Moon,
  type LucideIcon,
} from "lucide-react";

import { APP_NAME, APP_TAGLINE } from "@/constants/brand";
export const LANDING_SEO_DESCRIPTION =
  "SUCHETA — Bloom within. A calm personal space for daily self-care across Body, Mind, People, Purpose, and Work. Check in, reflect, and watch yourself grow.";

export const LANDING_DASHBOARD_CTA = "Go to Dashboard";

export const LANDING_HERO = {
  eyebrow: APP_TAGLINE,
  headline: "Bloom within. One gentle act of care at a time.",
  subcopy:
    "A calm, personal space for self-care and reflection — with a ready-made checklist, optional remarks, and a quiet view of how your care evolves.",
  primaryCta: "Begin Your Journey",
  secondaryCta: "Log in",
} as const;

export const LANDING_PHILOSOPHY = {
  eyebrow: "Our Philosophy",
  headline: "Self-care is a practice, not a test.",
  paragraphs: [
    "There are no right or wrong answers. Checking something off simply means you showed up for yourself that day.",
    `${APP_NAME} gives you a starting checklist across five domains, room for remarks, and a quiet place to see how your care changes over time.`,
  ],
  pillars: [
    {
      title: "Start with a checklist",
      description:
        "Body, Mind, People, Purpose, and Work — five areas of self-care ready the moment you sign in.",
    },
    {
      title: "Make it yours",
      description:
        "Hide what doesn’t fit. Add your own practices. Leave an optional remark on any point.",
    },
    {
      title: "See the pattern",
      description:
        "Week and month calendars, a Self-Care Score, and downloadable reports keep the bigger picture in view.",
    },
  ],
} as const;

export type LandingFeature = {
  icon: LucideIcon;
  title: string;
  description: string;
};

export const LANDING_FEATURES: LandingFeature[] = [
  {
    icon: CheckSquare,
    title: "Daily check-in",
    description:
      "Tap through a five-domain checklist. Add an optional remark on any item without slowing down.",
  },
  {
    icon: CalendarDays,
    title: "Week and month views",
    description:
      "A week strip on Home and a month calendar on Check-in so you can revisit any day.",
  },
  {
    icon: Layers,
    title: "Five domains",
    description:
      "Body, Mind, People, Purpose, and Work — plus custom practices you create.",
  },
  {
    icon: BarChart3,
    title: "Self-Care Score",
    description:
      "A 0–100 score based on how often you practice each area of self-care, drawn from your ★ intensity ratings.",
  },
  {
    icon: Download,
    title: "PDF reports",
    description:
      "Download daily, weekly, or monthly reports with completion and remarks.",
  },
  {
    icon: Moon,
    title: "Designed for daily use",
    description:
      "Light and dark modes, a mobile-first layout, and installable as a PWA.",
  },
];

export const LANDING_METRICS = {
  eyebrow: 'Your Metrics',
  headline: "Know how you're caring for yourself.",
  subcopy:
    "Your Self-Care Score reflects how often you currently practice each area of self-care — drawn from your ★ intensity ratings across Body, Mind, People, Purpose, and Work.",
  demoScore: 72,
  weights: [
    {
      key: "physical",
      label: "Body",
      weight: 0.2,
      colorClass: "bg-[var(--category-body)]",
    },
    {
      key: "emotional",
      label: "Mind",
      weight: 0.2,
      colorClass: "bg-[var(--category-mind)]",
    },
    {
      key: "social",
      label: "People",
      weight: 0.2,
      colorClass: "bg-[var(--category-people)]",
    },
    {
      key: "spiritual",
      label: "Purpose",
      weight: 0.2,
      colorClass: "bg-[var(--category-purpose)]",
    },
    {
      key: "professional",
      label: "Work",
      weight: 0.2,
      colorClass: "bg-[var(--category-work)]",
    },
  ],
  supporting: [
    {
      title: 'Steps Forward',
      description: 'Every completed check-in counts toward a lifetime total.',
    },
    {
      title: 'Transformation',
      description:
        "Month-over-month completion change. See whether you're improving or need a gentler week.",
    },
    {
      title: 'Domain highlights',
      description:
        'See which area of life is strongest and which deserves a little more attention.',
    },
  ],
} as const;

export const LANDING_BENEFITS = {
  eyebrow: `Why ${APP_NAME}`,
  headline: "Built for the long game.",
  items: [
    {
      title: "A starting point, not a blank page",
      description:
        "Forty-five self-care items are ready on day one. You decide which ones matter.",
    },
    {
      title: "Remarks when you need them",
      description:
        "Optional notes on each point help you remember why a day felt the way it did.",
    },
    {
      title: "Reports you can keep",
      description:
        "Download a daily, weekly, or monthly PDF of completions and remarks.",
    },
    {
      title: "Your data, your account",
      description:
        "Private check-ins on your own Supabase account, with light and dark themes.",
    },
  ],
} as const;

export const LANDING_CTA = {
  headline: "Your care journey starts here.",
  subcopy: "Show up for yourself today. Growth is patient.",
  primaryCta: "Begin Your Journey",
  secondaryCta: "Log in",
} as const;
