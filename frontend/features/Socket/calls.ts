"use client";
import { useUserStore } from "@/stores/UserStore";
import { queryKeys } from "@/utils/query.key";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { toast } from "sonner";

export function useCalls() {
  const socket = useUserStore((state) => state.socket);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!socket) return;
    socket.on(
      "notification",
      (
        purpose:
          | "STORY"
          | "CHAT"
          | "MESSAGE"
          | "REEL"
          | "POST"
          | "COMMENT"
          | undefined,
      ) => {
        queryClient.invalidateQueries({ queryKey: [queryKeys.NOTIFICATIONS] });
        if (purpose === "CHAT")
          queryClient.invalidateQueries({ queryKey: [queryKeys.CHAT] });
      },
    );

    socket.on("message", ({ chatId, content }) => {
      queryClient.invalidateQueries({ queryKey: [chatId] });
      toast.success(content);
    });
    return () => {
      socket.off("notification");
    };
  }, [socket, queryClient]);
}
