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
import CreatePost from "@/pages/Posts/CreatePost";
import { useProfileStore } from "@/stores/ProfileStore";
import { Amphora } from "lucide-react";
import { useState } from "react";

export default function PostLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const posts = useProfileStore((s) => s.posts);
  const [open, setOpen] = useState(false);
  if(open)
    return <CreatePost open={open} setOpen={setOpen} />
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
          <Button variant={"link"} onClick={() => setOpen(true)}>Create Posts</Button>
        </EmptyContent>
      </Empty>
    );
  return { children };
}
