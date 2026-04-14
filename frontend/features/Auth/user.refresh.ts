// Made like this as call from axios may result in error 
import { RefreshTokenRequest } from "@/service/auth/token.requests";
import Cookies from "js-cookie";
import { toast } from "sonner";

export async function RefreshUser() {
  try {
    const response = await RefreshTokenRequest();
    console.log("Refetched user details");
    return response.accessToken; 
    
  } catch (error) {
    Cookies.remove('accessToken');
    Cookies.remove('profile');
    toast.error(error as string)
    window.location.href = '/login';
    return null;
  }
}
