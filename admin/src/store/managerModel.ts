import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { config } from "../config/config";

interface ManagerModel {
  initialized: boolean;
  id: string;
  email: string;
  phone: string;
  token: string | null;
  refreshToken: string | null;
  isSigned: boolean;
  setToken: (token: string) => void;
  setId: (id: string) => void;
  init: () => void;
}

export const managerModel = create<ManagerModel>()(
  persist(
    (set, get) => ({
      initialized: false,
      id: "",
      email: "",
      phone: "",
      token: null,
      refreshToken: null,
      isSigned: false,
      setToken: (token) => set({ token }),
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
