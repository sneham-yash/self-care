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
import {
  METRICS_GUIDE_EXAMPLE,
  METRICS_GUIDE_EXAMPLE_SCORE,
  METRICS_GUIDE_WEIGHTS,
} from "@/components/tutorial/tutorial-content";

export const LANDING_SEO_DESCRIPTION =
  "Track daily self-care across physical, social, emotional, spiritual, and professional domains. Check in, add remarks, and download PDF reports.";

export const LANDING_DASHBOARD_CTA = "Go to Dashboard";

export const LANDING_HERO = {
  eyebrow: APP_TAGLINE,
  headline: "Take care of yourself, one check at a time.",
  subcopy:
    "A ready-made self-care checklist, optional remarks, and a calendar that helps you notice patterns — without starting from a blank page.",
  primaryCta: "Get Started",
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
        "Physical, social, emotional, spiritual, and professional items are ready the moment you sign in.",
    },
    {
      title: "Make it yours",
      description:
        "Hide what doesn’t fit. Add your own practices. Leave an optional remark on any point.",
    },
    {
      title: "See the pattern",
      description:
        "Week and month calendars, a Care Score, and downloadable reports keep the bigger picture in view.",
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
      "Physical, Social, Emotional, Spiritual, and Professional — plus custom items you create.",
  },
  {
    icon: BarChart3,
    title: "Care Score",
    description:
      "A 0–100 score from domain averages, streak, and growth, with a 30-day trend.",
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
  eyebrow: "Your Metrics",
  headline: "Know how you’re caring for yourself.",
  subcopy:
    "Your Care Score blends the five domain rates, your current streak, and recent growth into one number over a rolling 30-day window.",
  demoScore: METRICS_GUIDE_EXAMPLE_SCORE,
  demoMetrics: METRICS_GUIDE_EXAMPLE,
  weights: METRICS_GUIDE_WEIGHTS,
  supporting: [
    {
      title: "Steps Forward",
      description: "Every completed check-in counts toward a lifetime total.",
    },
    {
      title: "Transformation",
      description:
        "Month-over-month completion change. See whether you’re improving or need a gentler week.",
    },
    {
      title: "Domain highlights",
      description:
        "See which area of life is strongest and which deserves a little more attention.",
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
  headline: "Your next check-in starts here.",
  subcopy: "Show up for yourself today. The rest compounds.",
  primaryCta: "Start Your Journey",
  secondaryCta: "Log in",
} as const;

export const LANDING_FOOTER = {
  tagline: APP_TAGLINE,
} as const;
