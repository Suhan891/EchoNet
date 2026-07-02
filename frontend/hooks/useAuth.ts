import Cookies from "js-cookie";
import { RegisterRequest, ReRequestEmail, StartReset, UpdatePassword, VerifyOtp, VerifyRequest } from "@/service/auth/authentication";
import {
  LoginRequest,
  RefreshTokenRequest,
} from "@/service/auth/token.requests";
import { UserResponse } from "@/types/user.details";
import { ErrorResponse, SuccessResponse } from "@/types/common";
import { LoginType } from "@/validations/auth/login";
import { RegisterType } from "@/validations/auth/register";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  LoginResult,
  LogoutResult,
  RefreshResult,
  RegisterResult,
  VerifyRequestType,
  VerifyResult,
} from "@/types/auth.user";
import { GetUser, Logout } from "@/service/auth/authorise";
import { queryKeys } from "@/utils/query.key";
import { startResetType, TokenType, upPassType, VerifyOtpType } from "@/validations/auth/password-reset";

export function useRegister() {
  return useMutation<
    SuccessResponse<RegisterResult>,
    ErrorResponse,
    RegisterType
  >({
    mutationFn: (payload) => RegisterRequest(payload),
  });
}

export function useVerify() {
  return useMutation<
    SuccessResponse<VerifyResult>,
    ErrorResponse,
    VerifyRequestType
  >({
    mutationFn: (payload) => VerifyRequest(payload),
  });
}
export function useLogin() {
  return useMutation<SuccessResponse<LoginResult>, ErrorResponse, LoginType>({
    mutationFn: (payload) => LoginRequest(payload),
  });
}

export function RefreshUserToken() {
  return useMutation<SuccessResponse<RefreshResult>, ErrorResponse>({
    mutationFn: () => RefreshTokenRequest(),
  });
}

export function useMyself() {
  return useQuery<SuccessResponse<UserResponse>, ErrorResponse>({
    queryKey: [queryKeys.USER],
    queryFn: () => GetUser(),
    staleTime: 1000 * 60 * 20, // Cached data for 20 min 
    enabled: !!Cookies.get("accessToken"),
  });
}

export function useLogout() {
  return useMutation<SuccessResponse<LogoutResult>, ErrorResponse>({
    mutationFn: () => Logout(),
  });
}

export function useStartReset() {
  return useMutation<SuccessResponse<string>,ErrorResponse,startResetType>({
    mutationFn: (payload) => StartReset(payload)
  })
}
export function useReRequestEmail() {
  return useMutation<SuccessResponse<null>,ErrorResponse, {token: TokenType}>({
    mutationFn: (payload) => ReRequestEmail(payload)
  })
}
export function useValidateOtp() {
  return useMutation<SuccessResponse<null>,ErrorResponse, VerifyOtpType>({
    mutationFn: (payload) => VerifyOtp(payload)
  })
}
export function useUpdatePassword() {
  return useMutation<SuccessResponse<null>,ErrorResponse, upPassType>({
    mutationFn: (payload) => UpdatePassword(payload)
  })
}