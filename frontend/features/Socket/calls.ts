"use client";
import { useUserStore } from "@/stores/UserStore";
import { queryKeys } from "@/utils/query.key";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

export function useCalls() {
  const socket = useUserStore((state) => state.socket);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!socket) return;
    socket.on("notification", (purpose: "STORY" | "CHAT" | "MESSAGE" | "REEL" | "POST" | "COMMENT" | undefined) => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.NOTIFICATIONS] });
      if(purpose === 'CHAT' || purpose === 'MESSAGE')
        queryClient.invalidateQueries({ queryKey: [queryKeys.CHAT] });
    });
    return () => {
      socket.off("notification");
    };
  }, [socket, queryClient]);
}
