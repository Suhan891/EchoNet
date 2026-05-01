import { getProfiles } from "@/service/likes";
import { ErrorResponse, SuccessResponse } from "@/types/common";
import { LikeRequest, LikesData } from "@/types/like&comment";
import { queryKeys } from "@/utils/query.key";
import { useQuery } from "@tanstack/react-query";

export function useLikeViews(profileId: string, data: LikeRequest) {
  return useQuery<SuccessResponse<LikesData[]>, ErrorResponse>({
    queryKey: [profileId, queryKeys.LIKE],
    queryFn: () => getProfiles(data),
  });
}
