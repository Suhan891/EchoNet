import { RegisterType } from "@/validations/auth/register";
import { RequestDto } from "@/types/common";
import { VerifyRequestType } from "@/types/auth.user";
import { getUrl } from "../common/requests";
import { startResetType, TokenType, upPassType, VerifyOtpType } from "@/validations/auth/password-reset";

async function requests(path: string, request: RequestDto) {
  let headers = {};
  const isFormData = request.body instanceof FormData;
  if (!isFormData)
    headers = {
      "Content-Type": "application/json",
    };
  const response = await fetch(`${getUrl()}/auth/${path}`, {
    method: request.method,
    headers,
    body: isFormData ? request.body as FormData : JSON.stringify(request.body),
  });
  const result = await response.json();
  console.log(result)

  if (!result.success) {
    throw result;
  }
  return result;
}

async function postJson(path: string, payload: unknown) {
  return requests(path, { method: "POST", body: payload });
}
async function putJson(path: string, payload: unknown) {
  return requests(path, { method: "PUT", body: payload });
}

export async function RegisterRequest(payload: RegisterType) {
  return postJson("register", payload);
}

export async function VerifyRequest(payload: VerifyRequestType) {
  return postJson(`verify-email?token=${payload.token}`, payload.formData);
}

export async function StartReset(param: startResetType) {
  return putJson(`reset`,param)  
}
export async function ReRequestEmail(param:{token: TokenType}) {
  return putJson(`reset/re-email`,param)  
}
export async function VerifyOtp(params:VerifyOtpType) {
  return postJson('reset/otp', params)
}
export async function UpdatePassword(params:upPassType) {
  return postJson('reset/password', params)
}
