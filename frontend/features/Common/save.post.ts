"use client";
import { useSavePost } from "@/hooks/usePost";
import { useStore } from "@/stores/Store";
import { useUserStore } from "@/stores/UserStore";
import { queryKeys } from "@/utils/query.key";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { toast } from "sonner";

export function useSavePostReq() {
  const savePostReq = useStore((state) => state.savePost);
  const setSavePost = useStore((state) => state.setSavePost);
  const queryClient = useQueryClient();
  const savePost = useSavePost();
  const userId = useUserStore((state) => state.userId);

  useEffect(() => {
    if (savePostReq && !savePost.isPending) {
      savePost.mutate(savePostReq.mediaId, {
        onSuccess: (result) => {

          toast.success(result.message);

          queryClient.invalidateQueries({ queryKey: [userId] });
          queryClient.invalidateQueries({ queryKey: [queryKeys.POSTS] });
          queryClient.invalidateQueries({ queryKey: [queryKeys.SAVE_POST] });
          setSavePost(undefined);
        },
        onError: (errors) => {
          console.error(errors.error);
          toast.error(errors.message);
        },
        onSettled: () => setSavePost(undefined)
      });
    }
  }, [savePost, savePostReq, userId, setSavePost, queryClient]);
  return savePost.isPending;
}
