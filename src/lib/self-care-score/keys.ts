export const selfCareScoreKeys = {
  all: ["self-care-score"] as const,
  data: () => [...selfCareScoreKeys.all, "data"] as const,
};
