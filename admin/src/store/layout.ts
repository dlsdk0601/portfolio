import { create } from "zustand";

interface LayoutState {
  isSidebarOpen: boolean;
  onToggleSideBar: () => void;
}

export const layoutState = create<LayoutState>((set) => ({
  isSidebarOpen: false,
  onToggleSideBar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
}));
