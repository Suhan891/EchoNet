import Cookie from "js-cookie";
import { getUrl } from "../common";
import { LoginType } from "@/validations/auth/login";
import { RequestDto } from "@/types/common";

async function setToken(token: string) {
    Cookie.set('accessToken', token, {
        expires: Date.now() + 7,
        httpOnly: true,
        secure: true,
    })
}

async function requests(path: string,  request: RequestDto) {
    const url = getUrl(path)
    const headers = {"Content-Type": "application/json"}

    const response = await fetch(url, {
        method: request.method,
        headers,
        body: JSON.stringify(request.body)
    })
    const result = await response.json()

    if(!result.success) {
        throw new Error(result)
    }
    await setToken(result.accessToken);
    return result
}

async function postJson(path: string, payload: unknown) {
  return requests(path, { method: "POST", body: payload });
}

export async function LoginRequest(payload: LoginType) {
    return postJson('/auth/login', payload);
}

export async function RefreshTokenRequest(payload: void) {
    return postJson('/auth/refresh', payload);
}