import { create } from "zustand";

interface LayoutState {
  isSidebarOpen: boolean;
  toggle: () => void;
}

export const layoutState = create<LayoutState>((set) => ({
  isSidebarOpen: false,
  toggle: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
}));
