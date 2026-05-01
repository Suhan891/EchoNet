"use client"
import { useOwnPosts } from "@/hooks/usePost";
import PostsSkeleton from "@/pages/Posts/Skeleton";
import ViewPost from "@/pages/Posts/ViewPost";
import { useProfileStore } from "@/stores/ProfileStore";

export default function Postpage() {
  const posts = useProfileStore((state) => state.posts) ?? 1;
  const profileId = useProfileStore(state => state.id)
  const {data, isSuccess, isError, isLoading} = useOwnPosts(profileId)

  if(isLoading)
    return <PostsSkeleton posts={posts} />

  if(isError) return <div>Something went wrong</div>
  return <>{isSuccess && (<ViewPost posts={data.data} isOwn={true} />)}</>
}
