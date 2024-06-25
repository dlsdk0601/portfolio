import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { isNil } from "lodash";
import { config } from "../config/config";
import { api } from "../api/api";

interface ManagerModelState {
  initialized: boolean;
  pk: number | null;
  id: string;
  name: string;
  email: string;
  phone: string;
  job: string;
  token: string | null;
  refreshToken: string | null;
}

interface ManagerModelAction {
  init: () => Promise<void>;
  setToken: (token: string, refreshToken: string) => void;
  deInit: () => void;
  signOut: () => void;
}

const initialState: ManagerModelState = {
  initialized: false,
  pk: null,
  id: "",
  name: "",
  email: "",
  phone: "",
  job: "",
  token: null,
  refreshToken: null,
};

export const managerModel = create<ManagerModelState & ManagerModelAction>()(
  persist(
    (set, get) => ({
      ...initialState,
      setToken: (token, refreshToken) => {
        set({ token, refreshToken });
      },
      init: async () => {
        if (!get().token) {
          get().deInit();
          return;
        }

        const res = await api.profile({});

        if (isNil(res)) {
          get().deInit();
          return;
        }

        return set({
          initialized: true,
          pk: res.pk,
          id: res.id,
          name: res.name,
          email: res.email,
          phone: res.phone,
          job: res.job,
        });
      },
      deInit: () => set({ ...initialState, initialized: true }),
      signOut: () => get().deInit(),
    }),
    {
      name: config.sessionStorageKey,
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({ token: state.token, refreshToken: state.refreshToken }),
    },
  ),
);
