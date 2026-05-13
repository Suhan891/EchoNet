"use client";
import { useUserStore } from "@/stores/UserStore";
import { useEffect } from "react";

export function useAvailProfiles() {
  const socket = useUserStore((state) => state.socket);

  useEffect(() => {
    if (!socket) return;
    socket.on("connect", () => {
      console.log("Initial connections done: ", socket.id);
      socket.on("active_profiles", (data: string[]) => {
        useUserStore.getState().setOnlineProfiles(data);
      });

      socket.on("joined", (profileId: string) => {
        useUserStore.getState().addOnlineProfile(profileId);
      });

      socket.on("left", (profileId: string) => {
        useUserStore.getState().removeOnlineProfile(profileId);
      });
    });
    return () => {
      socket.off("active_profiles");
      socket.off("joined");
      socket.off("left");
      socket.off("connect");
    };
  }, [socket]);
}
