import { create } from "zustand";

interface DarkModeModel {
  isDark: boolean;
  setIsDark: (value: boolean) => void;
}

export const darkModeModel = create<DarkModeModel>((set) => ({
  isDark: false,
  setIsDark: (value) => set({ isDark: value }),
}));
