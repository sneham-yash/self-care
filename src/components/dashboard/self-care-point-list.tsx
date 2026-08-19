"use client";

import { SelfCarePointCard } from "@/components/dashboard/self-care-point-card";
import type { CareIntensityLevel } from "@/constants/care";
import type { TodayCareItem } from "@/lib/care-logs/api";

type SelfCarePointListProps = {
  items: TodayCareItem[];
  pendingItemId?: string;
  flagsByItemId?: Map<string, boolean>;
  onSetIntensity: (itemId: string, intensity: CareIntensityLevel) => void;
  onSaveRemark: (itemId: string, remark: string) => void;
  onToggleImprovement?: (itemId: string, current: boolean) => void;
};

export function SelfCarePointList({
  items,
  pendingItemId,
  flagsByItemId,
  onSetIntensity,
  onSaveRemark,
  onToggleImprovement,
}: SelfCarePointListProps) {
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <SelfCarePointCard
          key={item.id}
          item={item}
          isPending={pendingItemId === item.id}
          wantsImprovement={flagsByItemId?.get(item.id) ?? false}
          onSetIntensity={onSetIntensity}
          onSaveRemark={onSaveRemark}
          onToggleImprovement={onToggleImprovement}
        />
      ))}
    </div>
  );
}
