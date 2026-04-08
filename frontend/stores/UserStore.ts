import { AuthState } from "@/types/user.details";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

export const useUserStore = create<AuthState>()(
  devtools((set) => ({
    email: "",
    username: "",
    profiles: [],
    role: '',

    setEmail: (email) => set({ email }),
    setRole: (role) => set({ role }),
    setUserName: (name) => ({ username: name }),
    setProfile: (profiles) => set({ profiles }),
  })),
);
