import { APP_NAME } from "@/constants/brand";
import { cn } from "@/lib/utils";

const sizeClasses = {
  sm: "text-lg",
  md: "text-2xl",
  lg: "text-3xl",
} as const;

type BrandMarkProps = {
  size?: keyof typeof sizeClasses;
  className?: string;
};

export function BrandMark({ size = "sm", className }: BrandMarkProps) {
  return (
    <span
      className={cn(
        "font-display font-semibold tracking-tight text-foreground",
        sizeClasses[size],
        className,
      )}
    >
      {APP_NAME}
    </span>
  );
}
