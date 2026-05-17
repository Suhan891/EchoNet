"use client";
import { useProfileStore } from "@/stores/ProfileStore";
import { useEffect } from "react";
import { toast } from "sonner";
import { useMyProfile } from "@/hooks/useProfile";
import { useRouter } from "next/navigation";
import { deleteCookie } from "@/service/common/cookies";
import { useUserStore } from "@/stores/UserStore";

export function useProfileDetails(): boolean {
  const router = useRouter();

  const userId = useUserStore((s) => s.userId);

  const setAvatar = useProfileStore((s) => s.setAvatar);
  const setId = useProfileStore((s) => s.setId);
  const setFollowers = useProfileStore((s) => s.setFollowers);
  const setFollowings = useProfileStore((s) => s.setFollowinngs);
  const setName = useProfileStore((s) => s.setName);
  const setBio = useProfileStore((s) => s.setBio);
  const setStory = useProfileStore((s) => s.setStory);
  const setPosts = useProfileStore((s) => s.setPosts);
  const setReels = useProfileStore((s) => s.setReels);
  const setSavedPosts = useProfileStore((s) => s.setSavedPosts);
  const setIsPrivate = useProfileStore((state) => state.setIsPrivate);
  const setJob = useUserStore((s) => s.setJob);
  const upJob = useUserStore((s) => s.updateJobStatus);

  const storeAvatar = useProfileStore((s) => s.avatarUrl);
  const storeId = useProfileStore((s) => s.id);
  const storeFollowers = useProfileStore((s) => s.followers);
  const storeFollowings = useProfileStore((s) => s.followings);
  const storeName = useProfileStore((s) => s.name);
  const storeBio = useProfileStore((s) => s.bio);
  const storeStory = useProfileStore((s) => s.story);
  const storePosts = useProfileStore((state) => state.posts);
  const storeReels = useProfileStore((state) => state.reels);
  const storeSavedPosts = useProfileStore((state) => state.savedPosts);
  const storeIsPrivate = useProfileStore((state) => state.isPrivate);
  const storeJob = useUserStore((s) => s.jobs);

  const {
    data: profile,
    isSuccess,
    isError,
    error,
    isLoading,
  } = useMyProfile(userId);

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
      if (storeFollowers.length !== profile.data.followers.length)
        setFollowers(profile.data.followers.map((follow) => follow.followerId));
      if (storeFollowings.length !== profile.data.followings.length)
        setFollowings(
          profile.data.followings.map((follow) => follow.followingId),
        );
      if (storeName !== profile.data.name) setName(profile.data.name);
      if (storeBio !== profile.data.bio) setBio(profile.data.bio);
      if (storeStory !== profile.data.story?.id)
        setStory(profile.data.story?.id ?? undefined);
      if (storePosts !== profile.data._count.posts)
        setPosts(profile.data._count.posts);
      if (storeReels !== profile.data._count.reels)
        setReels(profile.data._count.reels);
      if (storeSavedPosts.length !== profile.data.savedPosts.length)
        setSavedPosts(
          profile.data.savedPosts.map((postMedia) => postMedia.postMediaId),
        );
      if (storeIsPrivate !== profile.data.isPrivate)
        setIsPrivate(profile.data.isPrivate);
      if (profile.data.job) {
        profile.data.job.forEach((j) => {
          const isPresent = storeJob.some((jb) => jb.id === j.id);
          if (isPresent) upJob(j.id, j.status);
          if (!isPresent)
            setJob({
              id: j.id,
              name: j.storyId ? "STORY" : "POST",
              status: j.status,
            });
        });
      }
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
    storeJob,
    upJob,
    storeFollowers,
    storeFollowings,
    storeName,
    storeBio,
    storeStory,
    storePosts,
    storeReels,
    storeSavedPosts,
    storeIsPrivate,
    setAvatar,
    setId,
    setFollowers,
    setFollowings,
    setName,
    setBio,
    setStory,
    setPosts,
    setReels,
    setSavedPosts,
    setIsPrivate,
    setJob,
  ]);
  return isLoading;
}
