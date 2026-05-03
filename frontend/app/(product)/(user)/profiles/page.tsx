"use client"
import { useAllProfiles } from "@/hooks/useProfile";
import AllProfiles from "@/pages/Profiles/AllProfile";
import ProfilesSkeleton from "@/pages/Profiles/Skeleton";
import { useProfileStore } from "@/stores/ProfileStore";

export default function ProfilesPage() {
  const profileId = useProfileStore((state) => state.id);
  const { data, isSuccess, isLoading, isError } = useAllProfiles(profileId);
  if (isLoading) return <ProfilesSkeleton />;

  if(isError) return <div>All Profile fetching failed with error</div>

  return <>{isSuccess && <AllProfiles profiles={data.data} />}</>;
}
