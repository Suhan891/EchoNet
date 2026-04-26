import { AuthState } from "@/types/user.details";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

export const useUserStore = create<AuthState>()(
  devtools((set) => ({
    userId: '',
    email: "",
    username: "",
    profiles: [],
    jobs: [],
    role: '',

    setUserId: (userId) => set({userId}),
    setEmail: (email) => set({ email }),
    setRole: (role) => set({ role }),
    setUserName: (name) => set({ username: name }),
    setProfile: (profiles) => set({ profiles }),
    setJob: (newJob) => set((state) => ({ jobs: [...state.jobs, newJob] })),
    updateJobStatus: (id, status) => set(state => ({jobs: state.jobs.map(job => job.id === id ? {...job, status: status} : job)})),
    removeJob: (id) => set(state => ({jobs: state.jobs.filter(job => job.id != id)}))
  })),
);
