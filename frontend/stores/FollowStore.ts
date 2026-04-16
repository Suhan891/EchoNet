import { FollowState } from "@/types/follow.type";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

export const useFollowStore = create<FollowState>()(
  devtools((set) => ({
    followers: [],
    followings: [],

    setFollowers: (followers) => set({ followers }),
    setFollowings: (followings) => set({ followings }),

    addfollowing: (following) =>
      set((state) => ({ followings: [following, ...state.followings] })),
    removefollowing: (followingId) =>
      set((state) => ({
        followings: state.followings.filter(
          (following) => following.id !== followingId,
        ),
      })),
  })),
);
