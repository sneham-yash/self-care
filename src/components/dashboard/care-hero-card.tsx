import { TodayProgress } from "@/components/dashboard/today-progress";
import { CareScoreHero } from "@/components/metrics/care-score-hero";

type CareHeroCardProps = {
  careScore: number;
  transformation: number;
  currentStreak: number;
  stepsForward: number;
  completedCount: number;
  totalCount: number;
};

export function CareHeroCard({
  careScore,
  transformation,
  currentStreak,
  stepsForward,
  completedCount,
  totalCount,
}: CareHeroCardProps) {
  return (
    <CareScoreHero
      careScore={careScore}
      transformation={transformation}
      currentStreak={currentStreak}
      stepsForward={stepsForward}
    >
      <TodayProgress completedCount={completedCount} totalCount={totalCount} />
    </CareScoreHero>
  );
}
