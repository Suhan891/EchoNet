import { cookies } from "next/headers";
import axios, { InternalAxiosRequestConfig } from "axios";
import { RefreshUser } from "@/features/Auth/user.refresh";


interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

async function getCookies(param: string) {
  const cookieStore = await cookies();
  return cookieStore.get(param);
}

const axiosInstance = axios.create({
  baseURL: process.env.REQUEST_APP_URL || "http://localhost:8080",
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(

    async (request: InternalAxiosRequestConfig) => {
    const cookie = await getCookies("accessToken");
    const profileCookie = await getCookies('')
    
    const accessToken = cookie?.value; 

    if (!accessToken) throw new Error("No token available");
    
    request.headers["Authorization"] = `Bearer ${accessToken}`;
    return request;
  },
  (error) => {
    console.log("User request creation failed: ", error);
    return Promise.reject(error);
  },
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {

    const originalRequest = error.config as CustomAxiosRequestConfig;

    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;

      const newToken = RefreshUser(); 
      
      if (!newToken) {
        return Promise.reject(error);
      }

      originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
      return axiosInstance(originalRequest);
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;