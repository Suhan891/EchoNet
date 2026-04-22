import { ProfileState } from "@/types/profile.details";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

export const useProfileStore = create<ProfileState>()(
  devtools((set) => ({
    id: "",
    name: "",
    bio: "",
    avatarUrl: "",
    followers: 0,
    followings: 0,
    story: false,
    posts: false,
    savedPosts: false,
    reels: false,
    sentNotifications: [],

    setId: (id) => set({ id }),
    setName: (name) => set({ name }),
    setBio: (bio) => set({ bio }),
    setAvatar: (avatarUrl) => set({ avatarUrl }),
    setFollowers: (followers) => set({ followers }),
    setFollowinngs: (followings) => set({ followings }),
    setStory: (story) => set({ story }),
    setPosts: (posts) => set({ posts }),
    setSavedPosts: (savedPosts) => set({ savedPosts }),
    setReels: (reels) => set({ reels }),

    setNotification: (sentNotifications) => set({ sentNotifications }),
  })),
);
