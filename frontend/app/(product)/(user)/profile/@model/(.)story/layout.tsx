"use client";
import DialogModal from "@/components/Modal";
import { Spinner } from "@/components/ui/spinner";
import { Badge } from "@/components/ui/badge";
import { useStoryStatus } from "@/hooks/useStory";
import { useStoryStore } from "@/stores/StoryStore";
import { useEffect } from "react";
import { toast } from "sonner";

export default function StoryLayoutOverlay({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const storyId = useStoryStore((state) => state.story);
  const isUploading = useStoryStore((state) => state.isUploaded);
  const state = useStoryStore.getState();

  const { isSuccess, data, isError, error } = useStoryStatus(
    storyId,
    isUploading,
  );

  useEffect(() => {
    if (isSuccess) {
      toast.success(data.message ?? "Data has uploaded");
      state.setIsUploaded(true); // Updating store when upload is complete
    }
    if (isError) {
      toast.error(error.message ?? "File upload unsuccessfull");
      state.setStory(undefined);
      state.setExpiresAt(undefined);
      //return // Error page with => error.error
    }
  }, [isSuccess, data, state, isError, error]);

  if (!storyId) return <div>Upload Story to view</div>;
  return isUploading ? (
    <Badge variant="secondary">
      {" "}
      <Spinner /> Uploading...{" "}
    </Badge>
  ) : (
    <DialogModal>{children}</DialogModal>
  );
}
