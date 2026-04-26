"use client";
import { Spinner } from "@/components/ui/spinner";
import { useOwnStories } from "@/hooks/useStory";
import ViewStory from "@/pages/Story/ViewStory";
import { useStoryStore } from "@/stores/StoryStore";
import { useEffect } from "react";
import { toast } from "sonner";

export default function StoryPage() {
  const storyId = useStoryStore((state) => state.story);
  const {
    data: stories,
    isFetching,
    isError,
    error,
    isSuccess,
  } = useOwnStories(storyId);
  useEffect(() => {
    if (isSuccess) {
      const state = useStoryStore.getState();
      state.setStories(stories.data)
      toast.success(stories.message)
    }
    if(isError) {
      toast.error(error.message)
      console.error(error.error)
      // To error page
    }
  }, [stories, isError, error, isSuccess]);
  return isFetching ? (
    <div className="min-w-2xl">
      {" "}
      <Spinner className="size-3" /> Getting Story details...{" "}
    </div>
  ) : (
    <ViewStory />
  );
}
