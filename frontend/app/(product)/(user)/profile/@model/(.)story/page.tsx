"use client";
import { Spinner } from "@/components/ui/spinner";
import ViewStory from "@/pages/Story/ViewStory";
import { useStoryStore } from "@/stores/StoryStore";
import { useEffect } from "react";
import { toast } from "sonner";

export default function StoryOverlayPage() {
  // Hook which shall call with the existing
  const storyId = useStoryStore((state) => state.story);

  return (
    <ViewStory />
  );
}
