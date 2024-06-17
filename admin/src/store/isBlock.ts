import { create } from "zustand";

interface IsBlockState {
  counter: number;
  isLock: () => boolean;
  up: () => void;
  down: () => void;
}

export const isBlock = create<IsBlockState>((set, get) => ({
  counter: 0,
  isLock: () => get().counter > 0,
  up: () => set((state) => ({ counter: state.counter + 1 })),
  down: () => set((state) => ({ counter: state.counter - 1 })),
}));
