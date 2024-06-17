import { create } from "zustand";

interface IsDarkState {
  isDark: boolean;
  setIsDark: (value: boolean) => void;
}

export const isDarkState = create<IsDarkState>((set) => ({
  isDark: false,
  setIsDark: (value) => set(() => ({ isDark: value })),
}));
