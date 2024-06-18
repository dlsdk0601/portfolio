import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { config } from "../config/config";

interface Manager {
  id: string;
  email: string;
  phone: string;
  token: string | null;
  refreshToken: string | null;
  isSigned: boolean;
  setToken: (token: string) => void;
  setId: (id: string) => void;
}

export const mangerModel = create<Manager>()(
  persist(
    (set, get) => ({
      id: "",
      email: "",
      phone: "",
      token: null,
      refreshToken: null,
      isSigned: false,
      setToken: (token) => set({ token }),
      setId: (id) => set({ id }),
    }),
    {
      name: config.sessionStorageKey,
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({ token: state.token, refreshToken: state.refreshToken }),
    },
  ),
);
