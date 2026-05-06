"use client";
import { useToggleLike } from "@/hooks/useLike";
import { useStore } from "@/stores/Store";
import { queryKeys } from "@/utils/query.key";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

export function useLikeReq() {
  const likeReq = useStore((state) => state.like);
  const setLike = useStore((state) => state.setLikeReq);
  const like = useToggleLike();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (likeReq && !like.isPending) {
      like.mutate(likeReq, {
        onSuccess: (result) => {
          if (likeReq.type === "POST") {
            // Later key proper handing
            queryClient.invalidateQueries({ queryKey: [queryKeys.POSTS] });
            queryClient.invalidateQueries({ queryKey: [queryKeys.ALL_POSTS] });
          }
          console.log(result);
        },
        onError: (errors) => {
          console.error(errors.error);
          console.error(errors);
        },
        onSettled: () => setLike(undefined),
      });
    }
  }, [likeReq, like, queryClient, setLike]);

  return like.isPending;
}
