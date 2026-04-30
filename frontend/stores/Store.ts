import { StoreType } from "@/types/stores";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

export const useStore = create<StoreType>()(
  devtools((set) => ({
    posts: [],
    reels: [],
    savedPosts: [],
    story: [],

    setStore: (data) =>
      set(() => {
        if (data.type === "POST") return { posts: [...data.data] };
        if (data.type === "STORY") return { story: [...data.data] };
        if (data.type === "REEL") return { reels: [...data.data] };
        if (data.type === "SAVED_MEDIA") return { savedPosts: [...data.data] };
        return {};
      }),
  })),
);
