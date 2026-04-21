import { RegisterType } from "@/validations/auth/register";
import { RequestDto } from "@/types/common";
import { VerifyRequestType } from "@/types/auth.user";
import { getUrl } from "../common/requests";

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

  if (!result.success) {
    throw new Error(result);
  }
  return result;
}

async function postJson(path: string, payload: unknown) {
  return requests(path, { method: "POST", body: payload });
}

export async function RegisterRequest(payload: RegisterType) {
  return postJson("register", payload);
}

export async function VerifyRequest(payload: VerifyRequestType) {
  return postJson(`verify-email?token=${payload.token}`, payload.formData);
}
