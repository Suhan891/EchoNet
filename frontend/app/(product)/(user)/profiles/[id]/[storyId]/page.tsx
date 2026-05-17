"use client";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { useStories } from "@/hooks/useStory";
import StorySkeleton from "@/pages/Story/Loading";
import ViewStory from "@/pages/Story/ViewStory";
import { CloudAlert } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

export default function OtherStoryViewPage() {
  const params = useParams();
  const storyId = params?.storyId as string;
  const router = useRouter()
  const { data, isSuccess, isLoading, isError, error } = useStories(storyId);
  if (isLoading) <StorySkeleton />;
  if (isError)
    return (
      <Empty className="h-full bg-muted/30">
        <EmptyHeader>
          <EmptyMedia variant={"icon"}>
            <CloudAlert />
          </EmptyMedia>
          <EmptyTitle>Story Media Retrive Failed</EmptyTitle>
          <EmptyDescription>{error.message}</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button variant={"link"} onClick={() => router.back()}>
            Back
          </Button>
        </EmptyContent>
      </Empty>
    );
  if(isSuccess)
    return <ViewStory stories={data.data} isOwn={false} />
}
