import Cookie from "js-cookie";
import axios, { InternalAxiosRequestConfig } from "axios";
import { RefreshUser } from "@/features/Auth/user.refresh";


interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

const axiosInstance = axios.create({
  baseURL: process.env.REQUEST_APP_URL || "http://localhost:3001",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

axiosInstance.interceptors.request.use(

    async (request: InternalAxiosRequestConfig) => {
    const profileCookie = Cookie.get('profile')

    const accessToken = Cookie.get('accessToken')

    if (!accessToken) throw new Error("No token available");

    if(profileCookie)
      request.headers['x-profile-id'] = profileCookie;
    
    request.headers["Authorization"] = `Bearer ${accessToken}`;

    if(request.data instanceof FormData)
      delete request.headers['Content-Type']

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

      const newToken = await RefreshUser(); 
      
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