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

export default function ReelsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const reels = useProfileStore((s) => s.reels);
  if (!reels)
    return (
      <Empty className="border border-dashed">
        <EmptyHeader>
          <EmptyMedia variant={"icon"}>
            <Amphora />
          </EmptyMedia>
          <EmptyTitle>No Reel yet uploaded</EmptyTitle>
          <EmptyDescription>Upload a reel to access</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button variant={"link"}>Create Reel</Button>
        </EmptyContent>
      </Empty>
    );
  return { children };
}
