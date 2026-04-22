import { RequestDto } from "@/types/common";
import axiosInstance from "./starter";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

export const getUrl = () => {
    return `${API_BASE}`;
}

export async function Request(path: string, requests: RequestDto) {
    const {data} = await axiosInstance({
        method: requests.method,
        url: path,
        data: requests.body instanceof FormData ? requests.body : requests.body ? JSON.stringify(requests.body) : undefined,
    })

    console.log(data);
    if(!data.success) 
        throw new Error(data)

    return data
}
