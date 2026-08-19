import Image from "next/image";

import { APP_LOGO_SRC, APP_NAME, APP_TAGLINE } from "@/constants/brand";
import { typography } from "@/lib/typography";
import { cn } from "@/lib/utils";

const sizeClasses = {
  sm: {
    icon: "h-8 w-[2.875rem]",
    name: "text-[1.0625rem] tracking-[0.08em]",
    tagline: "text-[10px]",
    gap: "gap-2",
  },
  md: {
    icon: "h-10 w-[3.6rem]",
    name: "text-2xl tracking-[0.08em]",
    tagline: "text-xs",
    gap: "gap-2.5",
  },
  lg: {
    icon: "h-12 w-[4.3rem]",
    name: "text-3xl tracking-[0.08em]",
    tagline: "text-sm",
    gap: "gap-3",
  },
} as const;

type BrandMarkProps = {
  size?: keyof typeof sizeClasses;
  className?: string;
  /** Show the tagline "Bloom within" below the name */
  showTagline?: boolean;
};

export function BrandMark({
  size = "sm",
  className,
  showTagline = true,
}: BrandMarkProps) {
  const s = sizeClasses[size];

  return (
    <span className={cn("inline-flex items-center", s.gap, className)}>
      <span className={cn("relative shrink-0", s.icon)} aria-hidden>
        <Image
          src={APP_LOGO_SRC}
          alt=""
          fill
          sizes="80px"
          className="pointer-events-none object-contain object-center select-none"
        />
      </span>
      <span className="flex min-w-0 flex-col justify-center">
        <span
          className={cn(
            "font-display leading-none font-semibold text-foreground",
            s.name,
          )}
        >
          {APP_NAME}
        </span>
        {showTagline ? (
          <span
            className={cn(
              typography.brandTagline,
              "-mt-1 leading-none",
              s.tagline,
            )}
          >
            {APP_TAGLINE}
          </span>
        ) : null}
      </span>
    </span>
  );
}
