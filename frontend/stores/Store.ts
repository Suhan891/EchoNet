import { StoreState } from "@/types/stores";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

export const useStore = create<StoreState>()(
  devtools((set) => ({
    follow: undefined,
    like: undefined,
    savePost: undefined,

    setLikeReq: (like) => set({ like }),
    setFollowReq: (follow) => set({ follow }),
    setSavePost: (savePost) => set({ savePost }),
  })),
);
