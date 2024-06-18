import { create } from "zustand";

interface BlockModel {
  counter: number;
  isLock: boolean;
  up: () => void;
  down: () => void;
}

export const blockModel = create<BlockModel>((set, get) => ({
  counter: 0,
  isLock: false,
  up: () =>
    set((state) => {
      const counter = state.counter + 1;
      return { counter, isLock: counter > 0 };
    }),
  down: () =>
    set((state) => {
      const counter = state.counter - 1;
      return { counter, isLock: counter > 0 };
    }),
}));
