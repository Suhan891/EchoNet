import { RegisterRequest, VerifyRequest,  } from "@/service/auth/authentication";
import { LoginRequest, RefreshTokenRequest } from "@/service/auth/token.requests";
import { UserResponse } from "@/types/user.details";
import { ErrorResponse, SuccessResponse } from "@/types/common";
import { LoginType } from "@/validations/auth/login";
import { RegisterType } from "@/validations/auth/register";
import { useMutation, useQuery } from "@tanstack/react-query";
import { LoginResult, RefreshResult, RegisterResult, VerifyRequestType, VerifyResult } from "@/types/auth.user";
import { GetUser } from "@/service/auth/authorise";

export function useRegister() {
  return useMutation<SuccessResponse<RegisterResult>, ErrorResponse, RegisterType>({
    mutationFn: (payload) => RegisterRequest(payload),
  });
}

export function useVerify() {
  return useMutation<SuccessResponse<VerifyResult>, ErrorResponse, VerifyRequestType>({
    mutationFn: (payload) => VerifyRequest(payload)
  })
}
export function useLogin() {
  return useMutation<SuccessResponse<LoginResult>, ErrorResponse, LoginType>({
    mutationFn: (payload) => LoginRequest(payload),
  });
}

export function RefreshUserToken() {
  return useMutation<SuccessResponse<RefreshResult>, ErrorResponse>({
    mutationFn: () => RefreshTokenRequest()
  })
}

export function useMyself() {
  return useQuery<SuccessResponse<UserResponse>, ErrorResponse>({
    queryKey: ["user"],
    queryFn: () => GetUser(),
    staleTime: 1000* 60* 10
  });
}
