import { useMyself } from "@/hooks/useAuth";
import { useUserStore } from "@/stores/UserStore";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

async function cookieProfile(profileId: string) {
    Cookies.set('profile', profileId, {
        sameSite: 'lax',
        secure: false,
    });
}

async function removeAuthToken() {
  Cookies.remove('accessToken')
  Cookies.remove('profile')
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
