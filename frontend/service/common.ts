import { cookies } from "next/headers";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

export const getUrl = (path: string) => {
    return `${API_BASE}${path}`;
}

export async function getToken() {
    const cookieStore = await cookies()
    return cookieStore.get('authToken')
}