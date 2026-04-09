// Made like this as call from axios may result in error 
import { RefreshUserToken } from "@/hooks/useAuth";
import { cookies } from "next/headers";
import { toast } from "sonner";

export async function RefreshUser() {
  try {
    const response = RefreshUserToken();
    if(response.isError) {
      console.error(response.error.error);
      throw new Error(response.error.message);
    }
    
    console.log("Refetched user details");
    return response.data?.data.accessToken; 
    
  } catch (error) {
    const cookieStore = await cookies();
    cookieStore.delete('accessToken');
    cookieStore.delete('profile');

    window.location.href = '/login';
    
    toast.error(error as string) // message is only returned as being handled above
    return null;
  }
}
