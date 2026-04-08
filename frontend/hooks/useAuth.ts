import { RegisterRequest } from "@/service/auth/authentication";
import { GetUser } from "@/service/auth/authorise";
import { LoginRequest } from "@/service/auth/token.requests";
import { ErrorResponse, SuccessResponse } from "@/types/common";
import { LoginType } from "@/validations/auth/login";
import { RegisterType } from "@/validations/auth/register";
import { useMutation, useQuery } from "@tanstack/react-query";

export function useRegister() {
  return useMutation<SuccessResponse, ErrorResponse, RegisterType>({
    mutationFn: (payload) => RegisterRequest(payload),
  });
}
export function useLogin() {
  return useMutation<SuccessResponse, ErrorResponse, LoginType>({
    mutationFn: (payload) => LoginRequest(payload),
  });
}

export function useMyself() {
  return useQuery<SuccessResponse, ErrorResponse>({
    queryKey: ["user"],
    queryFn: () => GetUser(),
    staleTime: 1000* 60* 5
  });
}
