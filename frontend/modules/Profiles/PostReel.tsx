import { useOthersPost } from "@/hooks/usePost";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Amphora } from "lucide-react";
import ViewPost from "../Posts/ViewPost";
import PostsSkeleton from "../Posts/Skeleton";
interface PostReelProps {
  profileId: string;
  type: "POST" | "REEL";
  count: number;
}

export default function PostAndReel({
  profileId,
  type,
  count,
}: PostReelProps) {
  const posts = useOthersPost({ type, count, profileId });
  if (!count)
    return (
      <Empty className="border border-dashed">
        <EmptyHeader>
          <EmptyMedia variant={"icon"}>
            <Amphora />
          </EmptyMedia>
          <EmptyTitle>{type} Is Empty</EmptyTitle>
          <EmptyDescription>No available {type.toLowerCase()}</EmptyDescription>
        </EmptyHeader>
        <EmptyContent></EmptyContent>
      </Empty>
    );
  if(posts.isLoading)
    return <PostsSkeleton posts={count} />
  if(posts.isSuccess)
    return <ViewPost posts={posts.data.data} isOwn={false} />
}
