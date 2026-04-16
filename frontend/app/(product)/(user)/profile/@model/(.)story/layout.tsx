"use client";
import DialogModal from "@/components/Modal";
import { Spinner } from "@/components/ui/spinner";
import { useProfileStore } from "@/stores/ProfileStore";
import { useIsFetching } from "@tanstack/react-query";
import { useEffect, useState } from "react";

export default function StoryLayoutOverlay({
  children,
}: Readonly<{ children: React.ReactNode }>) {
//     const [isLoading, setIsLoading] = useState(false)
//   const story = useProfileStore((state) => state.storyId);
//   if (story) {
//     setIsLoading(true)
//     const isFetchingPosts = useIsFetching({ queryKey: ['posts'] })
//   }
//   if(isLoading) return <Spinner />
//   useEffect(() => {}, []);
  return <DialogModal>{children}</DialogModal>;
}
