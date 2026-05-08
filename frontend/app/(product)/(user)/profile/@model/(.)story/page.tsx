"use client"
import { useStories } from "@/hooks/useStory";
import StorySkeleton from "@/pages/Story/Loading";
import ViewStory from "@/pages/Story/ViewStory";
import { useProfileStore } from "@/stores/ProfileStore";

export default function StoryPage() {
  const storyId = useProfileStore((state) => state.story);
  const { data, isSuccess, isLoading, isError, error } = useStories(storyId);
  if(isLoading) return <StorySkeleton />
  if(isError) return <div>Some Error: {error.message}</div>
  return <>{isSuccess && <ViewStory stories={data.data} isOwn={true} />}</>
}
