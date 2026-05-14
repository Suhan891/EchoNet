import { AuthState } from "@/types/user.details";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

export const useUserStore = create<AuthState>()(
  devtools((set) => ({
    userId: "",
    email: "",
    username: "",
    profiles: [],
    jobs: [],
    role: "",
    onlineProfiles: [],
    socket: undefined,

    setUserId: (userId) => set({ userId }),
    setEmail: (email) => set({ email }),
    setRole: (role) => set({ role }),
    setUserName: (name) => set({ username: name }),
    setProfile: (profiles) => set({ profiles }),


    setJob: (newJob) => set((state) => ({ jobs: [...state.jobs, newJob] })),
    updateJobStatus: (id, status) =>
      set((state) => ({
        jobs: state.jobs.map((job) =>
          job.id === id ? { ...job, status: status } : job,
        ),
      })),
    removeJob: (id) =>
      set((state) => ({ jobs: state.jobs.filter((job) => job.id != id) })),
    
    setSocket: (socket) => set({ socket }),
    setOnlineProfiles: (profiles) => set({ onlineProfiles: profiles }),
    addOnlineProfile: (profileId) =>
      set((state) => ({
        onlineProfiles: state.onlineProfiles.includes(profileId)
          ? state.onlineProfiles
          : [...state.onlineProfiles, profileId],
      })),
    removeOnlineProfile: (profileId) =>
      set((state) => ({
        onlineProfiles: state.onlineProfiles.filter((id) => id !== profileId),
      })),
  })),
);
