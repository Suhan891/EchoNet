import { GetOwnprofile } from "@/service/profile";
import { useUserStore } from "@/stores/UserStore";
import { ErrorResponse, SuccessResponse } from "@/types/common";
import { OwnProfileResponse } from "@/types/profile.details";
import { queryKeys } from "@/utils/query.key";
import { useQuery } from "@tanstack/react-query";

export function useMyProfile() {
  const {userId} = useUserStore()
  return useQuery<SuccessResponse<OwnProfileResponse>, ErrorResponse>({
    queryKey: [queryKeys.PROFILE, userId],
    queryFn: GetOwnprofile,
    enabled: !!userId,
    staleTime: 1000* 60* 5
  });
}
