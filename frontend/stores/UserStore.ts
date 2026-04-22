import { AuthState } from "@/types/user.details";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

export const useUserStore = create<AuthState>()(
  devtools((set) => ({
    userId: '',
    email: "",
    username: "",
    profiles: [],
    role: '',

    setUserId: (userId) => set({userId}),
    setEmail: (email) => set({ email }),
    setRole: (role) => set({ role }),
    setUserName: (name) => set({ username: name }),
    setProfile: (profiles) => set({ profiles }),
  })),
);
