import { RefreshTokenRequest } from "@/service/auth/token.requests";
import { deleteCookie } from "@/service/common/cookies";
import { RefreshResult } from "@/types/auth.user";
import { SuccessResponse } from "@/types/common";
import { toast } from "sonner";

export async function RefreshUser() {
  try {
    const response = await RefreshTokenRequest() as SuccessResponse<RefreshResult>;
    return response.data.accessToken;
  } catch {
    toast.error('Refresh token expired. Please login again.')
    deleteCookie();
    window.location.href = '/login';  
  }
}
