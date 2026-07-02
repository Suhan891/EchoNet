"use client";
import Cookie from "js-cookie";
import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { useAvailProfiles } from "./initial";
import { useUserStore } from "@/stores/UserStore";
import { useCalls } from "./calls";
import { toast } from "sonner";
import { deleteCookie } from "@/service/common/cookies";

export function useSocket() {
  const token = Cookie.get("accessToken");
  const profileId = Cookie.get("profile");
  const socketRef = useRef<Socket | null>(null);

  useAvailProfiles();
  useCalls();

  useEffect(() => {
    if (!token || !profileId) return;
    const socketUrl = process.env.BACKEND_URL || process.env.BACKEND_URL || "https://backend-service-0rys.onrender.com" || `${window.location.protocol}//${window.location.hostname}:3001`;
    socketRef.current = io(socketUrl, {
      auth: {
        token: `Bearer ${token}`,
        profileId,
      },
      transports: ['websocket', 'polling'],
    });

    socketRef.current.on('connect_error', (error) => {
      toast.error(error.message);
      // deleteCookie();
      // window.location.href = '/login';
    });

    socketRef.current.on('exception', (errorMsg) => {
      toast.error(errorMsg);
    });

    useUserStore.getState().setSocket(socketRef.current);

    return () => {
      if (socketRef.current) {
        //socketRef.current.off('connect_error');
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [profileId, token]);
}
