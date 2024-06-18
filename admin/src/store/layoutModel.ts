import { create } from "zustand";

interface LayoutModel {
  isSidebarOpen: boolean;
  onToggleSideBar: () => void;
}

export const layoutModel = create<LayoutModel>((set) => ({
  isSidebarOpen: false,
  onToggleSideBar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
}));
