"use client"
import { Spinner } from "@/components/ui/spinner"
import { useMySavedPosts } from "@/hooks/usePost"
import SavedPost from "@/modules/Posts/SavedPost"

export default function SavedPostPage() {

  const {data, isSuccess, isLoading, error, isError} = useMySavedPosts()

  if(isLoading) return <Spinner className="size-6" />
  if(isError) return <div>Error: {error.message}</div>

  return (
    <>{isSuccess && <SavedPost savePosts={data.data} />}</>
  )
}
