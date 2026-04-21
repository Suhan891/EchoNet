import { LoginType } from "@/validations/auth/login";
import { RequestDto } from "@/types/common";
import { getUrl } from "../common/requests";
import { setAuthToken } from "../common/cookies";

async function requests(path: string,  request: RequestDto) {
    const url = `${getUrl()}/auth${path}`
    const headers = {"Content-Type": "application/json"}

    const response = await fetch(url, {
        method: request.method,
        headers,
        body: JSON.stringify(request.body),
        credentials: 'include',
    })
    const result = await response.json()

    if (!result.success) {
        throw result;
    }

    console.log('Result: ', result);
    await setAuthToken(result.data.accessToken);
    return result;
}

async function postJson(path: string, payload: unknown) {
  return requests(path, { method: "POST", body: payload });
}

export async function LoginRequest(payload: LoginType) {
    return postJson('/login', payload);
}

export async function RefreshTokenRequest(payload: void) {
    return postJson('/refresh', payload);
}
