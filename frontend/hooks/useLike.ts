import { getProfiles, toggleLike } from "@/service/likes";
import { ErrorResponse, SuccessResponse } from "@/types/common";
import { LikeRequest, LikesData } from "@/types/like&comment";
import { queryKeys } from "@/utils/query.key";
import { useMutation, useQuery } from "@tanstack/react-query";

export function useLikeViews(profileId: string, data: LikeRequest, count: number) {
  return useQuery<SuccessResponse<LikesData[]>, ErrorResponse>({
    queryKey: [profileId, queryKeys.LIKE],
    queryFn: () => getProfiles(data),
    enabled: count > 1,
  });
}

export function useToggleLike() {
  return useMutation<SuccessResponse<null>, ErrorResponse, LikeRequest>({
    mutationFn: (payload) => toggleLike(payload)
  })
}
