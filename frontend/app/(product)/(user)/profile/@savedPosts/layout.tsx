"use client"
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { useProfileStore } from "@/stores/ProfileStore";
import { Amphora } from "lucide-react";

export default function SavedPostsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const savedPosts = useProfileStore((s) => s.savedPosts);
  if (!savedPosts)
    return (
      <Empty className="border border-dashed">
        <EmptyHeader>
          <EmptyMedia variant={"icon"}>
            <Amphora />
          </EmptyMedia>
          <EmptyTitle>Saved Posts Is Empty</EmptyTitle>
          <EmptyDescription>Save a post to view</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button variant={"link"}>Browse Posts</Button>
        </EmptyContent>
      </Empty>
    );
  return { children };
}
