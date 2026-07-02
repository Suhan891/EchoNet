import { RequestDto } from "@/types/common";
import axiosInstance from "./starter";

// const API_BASE = process.env.NEXT_PUBLIC_API_URL

export const getUrl = () => {
    return `https://backend-service-0rys.onrender.com`;
}

export async function Request(path: string, requests: RequestDto) {
    const {data} = await axiosInstance({
        method: requests.method,
        url: path,
        data: requests.body instanceof FormData ? requests.body : requests.body ? JSON.stringify(requests.body) : undefined,
    })

    if(!data.success) 
        throw data

    return data
}
