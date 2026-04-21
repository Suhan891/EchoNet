import { RefreshTokenRequest } from "@/service/auth/token.requests";
import { deleteCookie } from "@/service/common/cookies";
import { RefreshResult } from "@/types/auth.user";
import { ErrorResponse, SuccessResponse } from "@/types/common";
import { toast } from "sonner";

export async function RefreshUser() {
  try {
    const response = await RefreshTokenRequest() as SuccessResponse<RefreshResult>;
    console.log("Refetched user details");
    return response.data.accessToken;
  } catch (error) {
    const err = error as ErrorResponse;
    deleteCookie()
    console.error(err.error);
    toast.error(err.message)
    window.location.href = '/login';
    return null;
  }
}
