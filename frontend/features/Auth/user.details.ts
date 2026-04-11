"use client";
import { useMyself } from "@/hooks/useAuth";
import { useUserStore } from "@/stores/UserStore";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

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

export function UserDetails() {
  const router = useRouter();
  const useStore = useUserStore();
  const email = useUserStore((state) => state.email);
  const role = useUserStore((state) => state.role);
  const username = useUserStore((state) => state.username);
  const userId = useUserStore((state) => state.userId);
  const profiles = useUserStore((state) => state.profiles);
  const { data: user, isSuccess, isError, error } = useMyself();
  useEffect(() => {
    if (isError) {
      console.log('user', user);
      console.error(error.error);
      removeAuthToken();
      toast.error(error.message);
      router.push("/login");
    }
    if (isSuccess) {
      const activeProfile = user.data.profile.find(
        (profile) => profile.isActive == true,
      );

      if (activeProfile) cookieProfile(activeProfile.id);

      if (email !== user.data.email) useStore.setEmail(user.data.email);
      if (userId !== user.data.id) useStore.setUserId(user.data.id);
      if (role !== user.data.role) useStore.setRole(user.data.role);
      if (username !== user.data.username)
        useStore.setUserName(user.data.username);
      if (profiles !== user.data.profile)
        useStore.setProfile(user.data.profile);
    }
  }, [
    isSuccess,
    isError,
    error,
    useStore,
    router,
    user,
    email,
    role,
    userId,
    profiles,
    username,
  ]);

  return true;
}
