"use client";
import { useProfileStore } from "@/stores/ProfileStore";
import { useEffect } from "react";
import { toast } from "sonner";
import { useMyProfile } from "@/hooks/useProfile";
import { useRouter } from "next/navigation";
import { deleteCookie } from "@/service/common/cookies";

export function useProfileDetails(userId: string| undefined) {
  const router = useRouter();

  const setAvatar = useProfileStore((s) => s.setAvatar);
  const setId = useProfileStore((s) => s.setId);
  const setFollowers = useProfileStore((s) => s.setFollowers);
  const setFollowings = useProfileStore((s) => s.setFollowinngs);
  const setName = useProfileStore((s) => s.setName);
  const setBio = useProfileStore((s) => s.setBio);
  const setStory = useProfileStore((s) => s.setStory);

  const storeAvatar = useProfileStore((s) => s.avatarUrl);
  const storeId = useProfileStore((s) => s.id);
  const storeFollowers = useProfileStore((s) => s.followers);
  const storeFollowings = useProfileStore((s) => s.followings);
  const storeName = useProfileStore((s) => s.name);
  const storeBio = useProfileStore((s) => s.bio);
  const storeStory = useProfileStore((s) => s.story);

  const { data: profile, isSuccess, isError, error } = useMyProfile(userId!);

  useEffect(() => {
    if (!userId) return;

    if (isError) {
      console.error(error);
      toast.error(error?.message ?? "Profile details fetch failed");
      deleteCookie();
      router.push("/login");
      return;
    }

    if (isSuccess) {
      if (storeAvatar !== profile.data.avatarUrl)
        setAvatar(profile.data.avatarUrl);
      if (storeId !== profile.data.id) setId(profile.data.id);
      if (storeFollowers !== profile.data._count.followers)
        setFollowers(profile.data._count.followers);
      if (storeFollowings !== profile.data._count.followings)
        setFollowings(profile.data._count.followings);
      if (storeName !== profile.data.name) setName(profile.data.name);
      if (storeBio !== profile.data.bio) setBio(profile.data.bio);
      if (storeStory !== !!profile.data.story) setStory(!!profile.data.story);
    }
  }, [
    userId,
    isSuccess,
    isError,
    error,
    profile,
    router,
    storeAvatar,
    storeId,
    storeFollowers,
    storeFollowings,
    storeName,
    storeBio,
    storeStory,
    setAvatar,
    setId,
    setFollowers,
    setFollowings,
    setName,
    setBio,
    setStory,
  ]);
}
