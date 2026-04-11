import { RegisterType } from "@/validations/auth/register";
import { getUrl } from "../common";
import { RequestDto } from "@/types/common";

async function requests(path: string,  request: RequestDto) {
    const url = getUrl(path)

    let headers = {}
    if(path !== '/verify-email')
        headers = {"Content-Type": "application/json"}

    const response = await fetch(`/auth${url}`, {
        method: request.method,
        headers,
        body: JSON.stringify(request.body)
    })
    const result = await response.json()

    if(!result.success) {
        throw new Error(result)
    }
    return result
}

async function postJson(path: string, payload: unknown) {
  return requests(path, { method: "POST", body: payload });
}

export async function RegisterRequest(payload: RegisterType) {
    return postJson('/register', payload)
}

export async function VerifyRequest(payload) {
    return postJson('/verify-email', payload)
}