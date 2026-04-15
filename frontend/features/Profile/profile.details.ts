"use client";
import { useProfileStore } from "@/stores/ProfileStore";
import { useEffect } from "react";
import { toast } from "sonner";
import { useMyProfile } from "@/hooks/useProfile";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

function removeAuthToken() {
  Cookies.remove("accessToken");
  Cookies.remove("profile");
}

export default function ProfileDetails({ userId }: { userId: string }) {
  const router = useRouter();
  const { data: profile, isSuccess, isError, error } = useMyProfile(userId);

  useEffect(() => {
    if (isError) {
      console.log("Profile", profile);
      console.error(error);
      toast.error(error.message || ' Profile details fetch failed');
      removeAuthToken();
      router.push("/login");
    }
    if (isSuccess) {
      const state = useProfileStore.getState();
      if (state.avatarUrl !== profile.data.avatarUrl)
        state.setAvatar(profile.data.avatarUrl);
      if (state.id !== profile.data.id) state.setId(profile.data.id);
      if (state.followers !== profile.data.followers)
        state.setFollowers(profile.data.followers);
      if (state.followings !== profile.data.followings)
        state.setFollowinngs(profile.data.followings);
      if (state.name !== profile.data.name) state.setName(profile.data.name);
      if (state.bio !== profile.data.bio) state.setBio(profile.data.bio);
    }
  }, [
    isSuccess,
    isError,
    error,
    profile,
  ]);
}
