// Made like this as call from axios may result in error 
import { RefreshUserToken } from "@/hooks/useAuth";
import { cookies } from "next/headers";

export async function RefreshUser() {
  try {
    const response = RefreshUserToken();
    if(response.isError)
        throw new Error(response.error);
    
    console.log("Refetched user details");
    return response.data?.data.accessToken; 
    
  } catch (error) {
    const cookieStore = await cookies();
    cookieStore.delete('accessToken');
    cookieStore.delete('profile');

    window.location.href = '/login';
    
    console.error(error);
    return null;
  }
}
