"use client";
import { Spinner } from "@/components/ui/spinner";
import { useState } from "react";
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
import { useUserStore } from "@/stores/UserStore";

export default function StoryLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [open, setOpen] = useState(false);
  const story = useProfileStore((state) => state.story);
  const jobs = useUserStore((state) => state.jobs);
  const activeJob = jobs.find((job) => job.name === "STORY");

  if (!activeJob && !story) {
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
            <Button variant={"link"} onClick={() => setOpen(true)}>
              Create Story
            </Button>
          </EmptyContent>
        </Empty>
        {open && <CreateStory open={open} setOpen={setOpen} />}
      </div>
    );
  }
  if(activeJob?.status === 'FAILED') {
    // Later error page asking for retry
  }

  if (activeJob?.status === 'PROGRESS')
    return (
      <div className="min-w-2xl">
        {" "}
        <Spinner className="size-3" /> Uploading the files...{" "}
      </div>
    );

  return <div className="h-screen">{children}</div>;
}
