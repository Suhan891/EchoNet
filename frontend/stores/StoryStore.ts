import { StoryState } from "@/types/story.detils";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

export const useStoryStore = create<StoryState>()(
  devtools((set) => ({
    stories: [],

    setStories: (stories) => set({ stories }),
    addStory: (story) =>
      set((state) => ({ stories: [...state.stories, story] })),

    deleteStory: (storyId) =>
      set((state) => ({
        stories: state.stories.filter((story) => story.id !== storyId),
      })),
    removeStory: () => set({ stories: [] }),
  })),
);
