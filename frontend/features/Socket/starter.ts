"use client";
import Cookie from "js-cookie";
import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { useAvailProfiles } from "./initial";
import { useUserStore } from "@/stores/UserStore";
import { useCalls } from "./calls";

export function useSocket() {
  const token = Cookie.get("accessToken");
  const profileId = Cookie.get("profile");
  const socketRef = useRef<Socket | null>(null);

  useAvailProfiles();
  useCalls();

  useEffect(() => {
    if (!token || !profileId) return;
    socketRef.current = io(process.env.NEXT_PUBLIC_REQUEST_APP_URL, {
      auth: {
        token: `Bearer ${token}`,
        profileId,
      },
    });

    // socketRef.current.on('connect_error', (error) => {
    //   console.error('Socket connect_error:', error);
    //   if (
    //     error?.message === 'Invalid token' ||
    //     error?.message === 'Token has expired' ||
    //     error?.message === 'All conditions not satisfied'
    //   ) {
    //     Cookie.remove('accessToken');
    //     Cookie.remove('profile');
    //     window.location.href = '/login';
    //   }
    // });

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
