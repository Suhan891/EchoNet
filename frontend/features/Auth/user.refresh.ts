// Made like this as call from axios may result in error 
import { RefreshUserToken } from "@/hooks/useAuth";
import Cookies from "js-cookie";
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
    Cookies.remove('accessToken');
    Cookies.remove('profile');
    toast.error(error as string)
    window.location.href = '/login';
    return null;
  }
}
