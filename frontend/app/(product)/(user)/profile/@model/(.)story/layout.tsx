"use client";
import DialogModal from "@/components/Modal";
import { Spinner } from "@/components/ui/spinner";
import { Badge } from "@/components/ui/badge";
import { useAvailStory } from "@/hooks/useStory";
import { useStoryStore } from "@/stores/StoryStore";
import { useEffect } from "react";
import { toast } from "sonner";
import { useProfileStore } from "@/stores/ProfileStore";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Amphora } from "lucide-react";
import { Button } from "@/components/ui/button";
import CreateStory from "@/pages/Story/CreateStory";

export default function StoryLayoutOverlay({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const story = useProfileStore((state) => state.story);
  const setStory = useProfileStore((state) => state.setStory);
  const profileId = useProfileStore((state) => state.id);
  const state = useStoryStore.getState();
  const isUploaded = useStoryStore((state) => state.isUploaded);

  const { isSuccess, isError, error, data, isFetching } =
    useAvailStory(profileId);
  useEffect(() => {
    if (isSuccess) {
      if (data.data.status === "successfull") {
        toast.success(data.message ?? "Story has been uploaded");
        state.setIsUploaded(true);
        if (state.story !== data.data.storyId)
          state.setStory(data.data.storyId);
        if (state.expiresAt !== data.data.expiresAt)
          state.setExpiresAt(data.data.expiresAt);
      }
    }
    if (isError) {
      toast.error(error.message ?? "File upload unsuccessfull");
      state.setStory(undefined);
      state.setExpiresAt(undefined);
      setStory(false);
      //return // Error page with => error.error
    }
  }, [isSuccess, data, state, isError, error, setStory]);
  if (!story) {
    return (
      <div className="h-screen p-10">
        <Empty className="border border-dashed">
          <EmptyHeader>
            <EmptyMedia variant={"icon"}>
              <Amphora />
            </EmptyMedia>
            <EmptyTitle>Story Is Empty</EmptyTitle>
            <EmptyDescription>Upload your story to access</EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button variant={"link"}>Create Story</Button>
          </EmptyContent>
        </Empty>
      </div>
    );
  }

  if (!isUploaded)
    return (
      <div className="min-w-2xl">
        {" "}
        <Spinner className="size-3" /> Uploading the files...{" "}
      </div>
    );

  return isUploaded && !isFetching ? (
    <DialogModal>{children}</DialogModal>
  ) : (
    <Badge variant="secondary">
      {" "}
      <Spinner className="size-3" /> Getting Story...{" "}
    </Badge>
  );
}
