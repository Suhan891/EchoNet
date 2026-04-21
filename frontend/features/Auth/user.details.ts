"use client";
import { useEffect } from "react";
import { useMyself } from "@/hooks/useAuth";
import { useUserStore } from "@/stores/UserStore";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useProfileDetails } from "../Profile/profile.details";

function setCookieProfile(profileId: string) {
  Cookies.set("profile", profileId, { sameSite: "lax", secure: false });
}

function removeAuthToken() {
  Cookies.remove("accessToken");
  Cookies.remove("profile");
}

export function useUserDetails() {
  const router = useRouter();
  const { data: user, isSuccess, isError, error } = useMyself();

  const setEmail = useUserStore((s) => s.setEmail);
  const setRole = useUserStore((s) => s.setRole);
  const setUserName = useUserStore((s) => s.setUserName);
  const setProfile = useUserStore((s) => s.setProfile);
  const storeEmail = useUserStore((s) => s.email);
  const storeRole = useUserStore((s) => s.role);
  const storeUsername = useUserStore((s) => s.username);
  const storeProfiles = useUserStore((s) => s.profiles);

  useProfileDetails(user?.data?.id);

  useEffect(() => {
    if (isError) {
      console.error(error);
      removeAuthToken();
      toast.error(error?.message ?? "Something went wrong"); // ✅ null guard
      router.push("/login");
      return;
    }

    if (isSuccess && user?.data) {
      const activeProfile = user.data.profile?.find(
        (profile) => profile.isActive === true,
      );

      if (activeProfile) setCookieProfile(activeProfile.id);

      if (storeEmail !== user.data.email) setEmail(user.data.email);
      if (storeRole !== user.data.role) setRole(user.data.role);
      if (storeUsername !== user.data.username) setUserName(user.data.username);
      if (storeProfiles !== user.data.profile) setProfile(user.data.profile);

    }
  }, [
    isSuccess,
    isError,
    error,
    router,
    user,
    storeEmail,
    storeRole,
    storeUsername,
    storeProfiles,
    setEmail,
    setRole,
    setUserName,
    setProfile,
  ]);

  return isSuccess;
}
