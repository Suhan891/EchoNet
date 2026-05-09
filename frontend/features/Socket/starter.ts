"use client";
import { useProfileStore } from "@/stores/ProfileStore";
import { useUserStore } from "@/stores/UserStore";
import Cookie from "js-cookie";
import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";

export function useSocket() {
  const token = Cookie.get("accessToken");
  const profileId = Cookie.get("profile");
  const userId = useUserStore((state) => state.userId);
  const socketRef = useRef<Socket | null>(null);
  const tokenRef = useRef<string | null>(token);

  useEffect(() => {
    tokenRef.current = token;
  }, [token]);

  useEffect(() => {
    const availToken = tokenRef.current;
    if (!availToken || !profileId) return;
    socketRef.current = io(process.env.NEXT_PUBLIC_REQUEST_APP_URL, {
      auth: {
        token: `Bearer ${availToken}`,
        profileId,
      },
    });

    useProfileStore.getState().setSocket(socketRef.current);
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [profileId, userId]);

  useEffect(() => {
    if (!socketRef.current || !token) return;
    socketRef.current.auth = {
      ...socketRef.current.auth,
      token,
    };
    useProfileStore.getState().setSocket(socketRef.current);
  }, [token]);
}
