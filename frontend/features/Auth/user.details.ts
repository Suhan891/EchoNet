"use client";
import React, { useEffect } from "react";
import { useMyself } from "@/hooks/useAuth";
import { useUserStore } from "@/stores/UserStore";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import ProfileDetails  from "../Profile/profile.details";

async function cookieProfile(profileId: string) {
  Cookies.set("profile", profileId, {
    sameSite: "lax",
    secure: false,
  });
}

function removeAuthToken() {
  Cookies.remove("accessToken");
  Cookies.remove("profile");
}

export function useUserDetails() {
  const router = useRouter();
  const { data: user, isSuccess, isError, error } = useMyself();

  useEffect(() => {
    if (isError) {
      console.error(error);
      removeAuthToken();
      toast.error(error.message);
      router.push("/login");
    }
    if (isSuccess) {
      const activeProfile = user.data.profile.find(
        (profile) => profile.isActive === true,
      );

      if (activeProfile) cookieProfile(activeProfile.id);

      const state = useUserStore.getState();
      if (state.email !== user.data.email) state.setEmail(user.data.email);
      if (state.role !== user.data.role) state.setRole(user.data.role);
      if (state.username !== user.data.username)
        state.setUserName(user.data.username);
      if (state.profiles !== user.data.profile)
        state.setProfile(user.data.profile);

      ProfileDetails({ userId: user.data.id }); 
    }
  }, [
    isSuccess,
    isError,
    error,
    router,
    user,
  ]);
  return isSuccess;
}
