import { FollowRequest, GetFollow } from "@/service/follow";
import { ErrorResponse, SuccessResponse } from "@/types/common";
import { FollowData, FollowDto } from "@/types/follow.type";
import { queryKeys } from "@/utils/query.key";
import { useMutation, useQuery } from "@tanstack/react-query";

export function useCreateFolllow() {
  return useMutation<SuccessResponse<null>, ErrorResponse, string>({
    mutationFn: (payload) => FollowRequest(payload),
  });
}

export function useFollow(profileId: string, payload: FollowDto) {
    return useQuery<SuccessResponse<FollowData[]>,ErrorResponse>({
        queryKey: [queryKeys.FOLLOW, payload.id, payload.type],
        queryFn: () => GetFollow(payload),
        enabled: !!payload.id && !!payload.type
    })
}
