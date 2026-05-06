"use client"
import { useUpdateFolllow } from "@/hooks/useFollow";
import { useProfileStore } from "@/stores/ProfileStore";
import { useStore } from "@/stores/Store";
import { useUserStore } from "@/stores/UserStore";
import { queryKeys } from "@/utils/query.key";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { toast } from "sonner";

export function useFollowReq() {
  const followReq = useStore((state) => state.follow);
  const setFollowReq = useStore(state => state.setFollowReq)
  const queryClient = useQueryClient();
  const profileId = useProfileStore((state) => state.id);
  const follow = useUpdateFolllow();
  const userId = useUserStore((state) => state.userId);

  useEffect(() => {
    if (followReq && !follow.isPending) {
      follow.mutate(followReq.profileId, {
        onSuccess: (result) => {
          console.log(result.data);
          toast.success(result.message);

          queryClient.invalidateQueries({ queryKey: [userId] });
          queryClient.invalidateQueries({
            queryKey: [profileId, queryKeys.PROFILE],
          });

          queryClient.invalidateQueries({
            queryKey: [queryKeys.FOLLOW, profileId],
          });
          queryClient.invalidateQueries({
            queryKey: [queryKeys.FOLLOW, profileId],
          });
          queryClient.invalidateQueries({
            queryKey: [queryKeys.SAVE_POST],
          });
        },
        onError: (errors) => {
          console.error(errors.error);
          toast.error(errors.message);
        },
        onSettled: () => setFollowReq(undefined)
      });
    }
  }, [follow, followReq, queryClient, userId, profileId,setFollowReq]);
  return follow.isPending;
}
