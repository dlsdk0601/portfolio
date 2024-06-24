import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { config } from "../config/config";

interface ManagerModelState {
  initialized: boolean;
  id: string;
  email: string;
  phone: string;
  token: string | null;
  refreshToken: string | null;
}

interface ManagerModelAction {
  setToken: (token: string, refreshToken: string) => void;
  setId: (id: string) => void;
  init: () => void;
}

export const managerModel = create<ManagerModelState & ManagerModelAction>()(
  persist(
    (set, get) => ({
      initialized: false,
      id: "",
      email: "",
      phone: "",
      token: null,
      refreshToken: null,
      setToken: (token, refreshToken) => {
        set({ token, refreshToken });
      },
      setId: (id) => set({ id }),
      init: () => {
        return set({ initialized: true });
      },
    }),
    {
      name: config.sessionStorageKey,
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({ token: state.token, refreshToken: state.refreshToken }),
    },
  ),
);
