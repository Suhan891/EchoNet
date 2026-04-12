"use client";
import { useProfileStore } from "@/stores/ProfileStore";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";
import { useMyProfile } from "@/hooks/useProfile";

async function cookieProfile(profileId: string) {
  Cookies.set("profile", profileId, {
    sameSite: "lax",
    secure: false,
  });
}

async function removeAuthToken() {
  Cookies.remove("accessToken");
  Cookies.remove("profile");
}

export function ProfileDetails() {
  const router = useRouter();
  const useStore = useProfileStore();
  const avatarUrl = useProfileStore((state) => state.avatarUrl);
  const bio = useProfileStore((state) => state.bio);
  const followers = useProfileStore((state) => state.followers);
  const followings = useProfileStore((state) => state.followings);
  const name = useProfileStore((state) => state.name);
  const id = useProfileStore((state) => state.id);
  const { data: profile, isSuccess, isError, error } = useMyProfile();
  useEffect(() => {
    if (isError) {
      console.log("Profile", profile);
      console.error(error.error);
      toast.error(error.message || ' Profile details fetch failed');
      removeAuthToken()
      // Forward to error page
      router.push("/login");
    }
    if (isSuccess) {
      if (avatarUrl !== profile.data.avatarUrl)
        useStore.setAvatar(profile.data.avatarUrl);
      if (id !== profile.data.id) useStore.setId(profile.data.id);
      if (followers !== profile.data.followers)
        useStore.setFollowers(profile.data.followers);
      if (followings !== profile.data.followings)
        useStore.setFollowinngs(profile.data.followings);
      if (name !== profile.data.name) useStore.setName(profile.data.name);
      if (bio !== profile.data.bio) useStore.setBio(profile.data.bio);
    }
  }, [
    isSuccess,
    isError,
    error,
    router,
    avatarUrl,
    bio,
    followers,
    followings,
    name,
    id,
    profile,
    useStore,
  ]);

  return true;
}
