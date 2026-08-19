"use client";

import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";

import { BrandMark } from "@/components/brand/brand-mark";
import { CreatorCredit } from "@/components/brand/creator-credit";
import { APP_NAME, APP_TAGLINE } from "@/constants/brand";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { typography } from "@/lib/typography";
import { cn } from "@/lib/utils";

type AboutPageProps = {
  version: string;
};

export function AboutPage({ version }: AboutPageProps) {
  return (
    <div className="space-y-6">
      <Link
        href="/settings"
        className={cn(
          typography.bodyText,
          "text-muted-foreground inline-flex items-center gap-1 hover:text-foreground md:hidden",
        )}
      >
        <ArrowLeftIcon className="size-4" />
        Settings
      </Link>

      <div className="space-y-1">
        <h1 className={typography.screenTitle}>About {APP_NAME}</h1>
        <p className={typography.authTagline}>{APP_TAGLINE}</p>
      </div>

      <Card>
        <CardHeader className="items-center text-center">
          <BrandMark size="md" />
        </CardHeader>
        <CardContent className="space-y-2 text-center">
          <p className={typography.bodyText}>Version {version}</p>
          <p className={typography.bodyMuted}>
            A calm personal space for self-care and reflection — with daily
            check-ins, insights, and reports you can keep.
          </p>
        </CardContent>
      </Card>

      <CreatorCredit variant="about" />
    </div>
  );
}
