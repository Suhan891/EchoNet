import Cookies from "js-cookie";
import { CreateProfile, GetAllProfiles, GetOwnprofile, ToggleProfile, UpdateAvatar, UpdateProfile } from "@/service/profile";
import { ErrorResponse, SuccessResponse } from "@/types/common";
import { OwnProfileResponse, UpProfileResult } from "@/types/profile.details";
import { queryKeys } from "@/utils/query.key";
import { UpdateProfileType } from "@/validations/profile/update.profile";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AllProfiles } from "@/types/profiles";

export function useMyProfile(userId: string) {
  return useQuery<SuccessResponse<OwnProfileResponse>, ErrorResponse>({
    queryKey: [userId, queryKeys.PROFILE],
    queryFn: () => GetOwnprofile(),
    enabled: !!userId && !!Cookies.get("profile"),
    staleTime: 1000 * 60 * 5,
  });
}

export function useCreateProfile() {
  return useMutation<SuccessResponse<{ id: string }>, ErrorResponse, FormData>({
    mutationFn: (payload) => CreateProfile(payload),
  });
}

export function useUpdateProfile() {
  return useMutation<
    SuccessResponse<UpProfileResult>,
    ErrorResponse,
    UpdateProfileType
  >({
    mutationFn: (payload) => UpdateProfile(payload),
  });
}

export function useUpdateAvatar() {
  return useMutation<SuccessResponse<null>, ErrorResponse, FormData>({
    mutationFn: (payload) => UpdateAvatar(payload)
  })
}

export function useToggleProfile() {
  return useMutation<SuccessResponse<null>, ErrorResponse, string>({
    mutationFn: (payload) => ToggleProfile(payload)
  })
}

export function useAllProfiles(profileId: string) {
  return useQuery<SuccessResponse<AllProfiles[]>, ErrorResponse>({
    queryKey: [profileId, queryKeys.PROFILE],
    queryFn: () => GetAllProfiles()
  })
}