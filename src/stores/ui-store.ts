import type { CareFilterTab } from "@/constants/care";
import { create } from "zustand";

type UiState = {
  homeTab: CareFilterTab;
  selectedDate: string;
  setHomeTab: (tab: CareFilterTab) => void;
  setSelectedDate: (date: string) => void;
};

export const useUiStore = create<UiState>((set) => ({
  homeTab: "all",
  selectedDate: new Date().toISOString().split("T")[0]!,
  setHomeTab: (homeTab) => set({ homeTab }),
  setSelectedDate: (selectedDate) => set({ selectedDate }),
}));
