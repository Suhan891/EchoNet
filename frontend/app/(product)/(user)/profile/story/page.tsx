"use client";
import { Spinner } from "@/components/ui/spinner";
import { useOwnStory } from "@/hooks/useStory";
import StorySkeleton from "@/pages/Story/Loading";
import ViewStory from "@/pages/Story/ViewStory";
import { useProfileStore } from "@/stores/ProfileStore";
import { useStore } from "@/stores/Store";
import { useStoryStore } from "@/stores/StoryStore";
import { Suspense, useEffect } from "react";
import { toast } from "sonner";

export default function StoryPage() {
  const profileId = useProfileStore((state) => state.id);
  const setStore = useStore((state) => state.setStore);
  const { data } = useOwnStory(profileId);
  useEffect(() => {
    setStore({ type: "STORY", data: data.data });
  }, [data, setStore]);
  return (
    <Suspense fallback={<StorySkeleton />}>
      <ViewStory />
    </Suspense>
  );
}
