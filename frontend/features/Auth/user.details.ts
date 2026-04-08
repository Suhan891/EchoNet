import { useMyself } from "@/hooks/useAuth";
import { useUserStore } from "@/stores/UserStore";
import { cookies } from "next/headers";

async function cookieProfile(profileId: string) {
    const cookieStore = await cookies()
    cookieStore.set('profile', profileId, {
        httpOnly: false,
        sameSite: 'lax',
        secure: false,
    });
}

export function UserDetails() {
  const { data: user, isSuccess, isError, error } = useMyself();
  const useStore = useUserStore();
  if (isError) {
    console.error(error.error);
    throw new Error(error.message);
  }
  if (isSuccess) {
    const activeProfile = user.data.profile.find(
      (profile) => profile.isActive == true,
    );

    if(activeProfile)
        cookieProfile(activeProfile.id)

    useStore.setEmail(user.data.email);
    useStore.setRole(user.data.role);
    useStore.setUserName(user.data.username);
    useStore.setProfile(user.data.profile);
  }
}
