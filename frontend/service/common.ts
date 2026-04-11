import { RequestDto } from "@/types/common";
import { cookies } from "next/headers";
import axiosInstance from "./starter";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

export const getUrl = (path: string) => {
    return `${API_BASE}${path}`;
}

export const requestUrl = () => {
    return `${API_BASE}`
}

export async function getToken() {
    const cookieStore = await cookies()
    return cookieStore.get('authToken')
}

export async function Request(path: string, requests: RequestDto) {
    const {data} = await axiosInstance({
        method: requests.method,
        url: path,
        data: requests.body ? JSON.stringify(requests.body) : undefined,
    })

    const response = await JSON.parse(data)

    if(!response.success) 
        throw new Error(response)

    return response
}

async function getJson(path: string) {
  return Request(path, {method: 'GET', body: null});
}

export async function GetUser() {
  return getJson("/auth/me");
}