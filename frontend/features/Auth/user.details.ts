import { useMyself } from "@/hooks/useAuth";
import { useUserStore } from "@/stores/UserStore";
import { cookies } from "next/headers";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

async function cookieProfile(profileId: string) {
    const cookieStore = await cookies()
    cookieStore.set('profile', profileId, {
        httpOnly: false,
        sameSite: 'lax',
        secure: false,
    });
}

async function removeAuthToken() {
  const cookieStore = await cookies()
  cookieStore.delete('accessToken')
  cookieStore.delete('profile')
}

export function UserDetails() {
  const router = useRouter();
  const { data: user, isSuccess, isError, error } = useMyself();
  const useStore = useUserStore();
  if (isError) {
    console.error(error.error);
    removeAuthToken();
    toast.error(error.message);
    router.push('/login');
  }
  if ( isSuccess ) {
    const activeProfile = user.data.profile.find(
      (profile) => profile.isActive == true,
    );

    if(activeProfile)
        cookieProfile(activeProfile.id)

    useStore.setUserId(user.data.id);
    useStore.setEmail(user.data.email);
    useStore.setRole(user.data.role);
    useStore.setUserName(user.data.username);
    useStore.setProfile(user.data.profile);
  }
  return true
}
