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

export default function PostLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const posts = useProfileStore((s) => s.posts);
  if (!posts)
    return (
      <Empty className="border border-dashed">
        <EmptyHeader>
          <EmptyMedia variant={"icon"}>
            <Amphora />
          </EmptyMedia>
          <EmptyTitle>Post Is Empty</EmptyTitle>
          <EmptyDescription>Upload a post to access</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button variant={"link"}>Create Posts</Button>
        </EmptyContent>
      </Empty>
    );
  return { children };
}
