"use client";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from "@/components/ui/item";
import { Spinner } from "@/components/ui/spinner";
import {
  useNotification,
  useNotifyData,
  useNotifyDelete,
} from "@/hooks/useNotification";
import { queryKeys } from "@/utils/query.key";
import { useQueryClient } from "@tanstack/react-query";
import { Amphora } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
export default function AllNoifications() {
  const { data, isSuccess, isError, isLoading, error } = useNotification();
  const queryClient = useQueryClient();
  const notifyData = useNotifyData();
  const notifyDel = useNotifyDelete();
  const router = useRouter();
  const handleView = (id: string) => {
    notifyData.mutate(id, {
      onSuccess: (result) => {
        toast.success(result.message);
        if (
          result.data.type === "STORY" ||
          result.data.type === "POST" ||
          result.data.type === "REEL"
        )
          return router.push(`/profiles/${result.data.profileId}`);
        return router.push(`/chats/${result.data.chatId}`);
      },
      onError: (err) => {
        toast.error(err.message);
        console.error(err.error);
      },
      onSettled: () =>
        queryClient.invalidateQueries({ queryKey: [queryKeys.NOTIFICATIONS] }),
    });
  };

  const handleDelNotification = (id: string) => {
    notifyDel.mutate(id, {
      onSuccess: (response) => toast.success(response.message),
      onError: (err) => toast.error(err.message),
      onSettled: () =>
        queryClient.invalidateQueries({ queryKey: [queryKeys.NOTIFICATIONS] }),
    });
  };

  return (
    <div className="flex flex-col w-full max-w-2xl mx-auto gap-6 p-4">
      {isLoading && <Spinner className="size-6 mx-auto mt-4" />}
      {isError && (
        <div className="text-red-400 text-sm mt-4">Error: {error.message}</div>
      )}

      {isSuccess && (
        <>
          {data.data.length === 0 && (
            <Empty className="border border-dashed border-white/10 rounded-2xl bg-white/5 p-10 mt-4">
              <EmptyHeader className="flex flex-col items-center text-center">
                <EmptyMedia
                  variant="icon"
                  className="mb-4 text-blue-500 bg-blue-500/10 p-4 rounded-full"
                >
                  <Amphora className="size-8" />
                </EmptyMedia>
                <EmptyTitle className="text-white text-lg font-semibold">
                  Notifications are empty
                </EmptyTitle>
                <EmptyDescription className="text-gray-400 mt-1">
                  You're all caught up! No new notifications.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          )}

          {data.data.length > 0 && (
            <ItemGroup className="flex flex-col gap-3">
              {data.data.map((notific) => {
                const isUnread = !notific.isRead;

                return (
                  <Item
                    key={notific.id}
                    className={`flex items-start justify-between p-4 rounded-xl border transition-all cursor-pointer group ${
                      isUnread
                        ? "bg-white/5 border-blue-500/30 shadow-md"
                        : "bg-transparent border-white/10 opacity-70 hover:opacity-100 hover:bg-white/5"
                    }`}
                  >
                    {/* Clicking the body views the notification */}
                    <div
                      className="flex items-start gap-3 flex-1"
                      onClick={() => handleView(notific.id)}
                    >
                      <div className="mt-1.5 shrink-0 w-3 h-3 flex items-center justify-center">
                        {isUnread && (
                          <span className="block w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
                        )}
                      </div>

                      <ItemContent className="flex-1">
                        <ItemTitle
                          className={`text-base ${isUnread ? "font-bold text-white" : "font-medium text-gray-400"}`}
                        >
                          <span className="capitalize">
                            {notific.purpose.toLowerCase()}
                          </span>
                        </ItemTitle>
                        <ItemDescription
                          className={`mt-1 text-sm leading-relaxed ${isUnread ? "text-gray-300" : "text-gray-500"}`}
                        >
                          {notific.content}
                        </ItemDescription>
                      </ItemContent>
                    </div>

                    {/* Hover Actions */}
                    <ItemActions className="ml-4 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="text-gray-500 hover:text-red-500 hover:bg-red-500/10 transition-colors h-8 px-3 rounded-md"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelNotification(notific.id);
                        }}
                      >
                        Delete
                      </Button>
                    </ItemActions>
                  </Item>
                );
              })}
            </ItemGroup>
          )}
        </>
      )}
    </div>
  );
}
