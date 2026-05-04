"use client";
import { Spinner } from "@/components/ui/spinner";
import { useOwnStory } from "@/hooks/useStory";
import StorySkeleton from "@/pages/Story/Loading";
import ViewStory from "@/pages/Story/ViewStory";
import { useProfileStore } from "@/stores/ProfileStore";

export default function StoryPage() {
  const profileId = useProfileStore((state) => state.id);
  const { data } = useOwnStory(profileId);
  return (
      <ViewStory />
  );
}
