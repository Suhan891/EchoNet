"use client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { useProfileStore } from "@/stores/ProfileStore";
import { ChatsMsgsDto } from "@/types/chat";
import { Amphora, CloudAlert, Send } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { useAddMessage, useChatApproval } from "@/hooks/useChat";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { SubmitHandler, useForm, useWatch } from "react-hook-form";
import { messageSchema, messageType } from "@/validations/chats/message";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUserStore } from "@/stores/UserStore";
import ViewMsg from "./ViewMsg";
import ChatMembers from "./ChatMembers";

export default function IndivisualChat({ data }: { data: ChatsMsgsDto }) {
  const profileId = useProfileStore((state) => state.id);
  const router = useRouter();
  const [approve, setApprove] = useState(false);
  const socket = useUserStore((state) => state.socket);
  const { control, register, handleSubmit, reset } = useForm<messageType>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      chatId: data.id,
      format: "TEXT",
      content: "",
    },
  });
  const watch = useWatch({
    control,
    defaultValue: {
      content: "",
    },
  });
  const queryClient = useQueryClient();
  const isWritting = !!watch.content;
  const [typingProfile, setTypingProfile] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const addMsg = useAddMessage();
  useEffect(() => {
    if (!socket || !isWritting) return;
    socket.emit("chat_texting", data.id);
  }, [socket, isWritting, data.id]);

  const [membersOpen, setMembersOpen] = useState(false);
  const [viewMsg, setViewMsg] = useState({
    open: false,
    msgId: "",
    count: 0,
  });

  useEffect(() => {
    if (!socket) return;

    let typingTimeout: NodeJS.Timeout;

    const handleTyping = (profileId: string) => {
      const typingMember = data.members.find(
        (prof) => prof.profile.id === profileId,
      );
      if (typingMember) {
        setTypingProfile({
          id: typingMember.profile.id,
          name: typingMember.profile.name,
        });

        if (typingTimeout) clearTimeout(typingTimeout);
        typingTimeout = setTimeout(() => {
          setTypingProfile(null);
        }, 3000);
      }
    };

    socket.on(`chat:${data.id}`, handleTyping);

    return () => {
      socket.off(`chat:${data.id}`, handleTyping);
      if (typingTimeout) clearTimeout(typingTimeout);
    };
  }, [socket, data.id, data.members]);
  const ownMember = data.members.find((memb) => memb.profile.id === profileId);
  useEffect(() => {
    setApprove(!!ownMember && !ownMember.isApproved);
  }, [ownMember]);
  const onSubmit: SubmitHandler<messageType> = (message) => {
    console.log(message);
    addMsg.mutate(message, {
      onSuccess: (result) => {
        toast.success(result.message);
        console.log(result.data);
        reset();
      },
      onError: (err) => {
        toast.error(err.message);
        console.error(err.error);
      },
      onSettled: () => queryClient.invalidateQueries({ queryKey: [data.id] }),
    });
  };
  const getOtherMembers =
    data.members.find((memb) => memb.profile.id !== profileId) ?? null;

  const approval = useChatApproval();
  const handleApproval = () => {
    approval.mutate(data.id, {
      onSuccess: (result) => {
        console.log(result.data);
        toast.success(result.message);
      },
      onError: (err) => {
        console.error(err.error);
        toast.error(err.message);
      },
      onSettled: () => queryClient.invalidateQueries({ queryKey: [data.id] }),
    });
  };

  return (
    <div className="flex flex-col h-full relative bg-[#0c0f14] min-h-[600px] pr-75">
      <Item
        className="sticky top-0 z-10 flex items-center w-full p-4 md:px-6 border-b border-white/10 bg-[#0c0f14]/80 backdrop-blur-md"
        onClick={() => {
          if (data.type === "GROUP") setMembersOpen(true);
        }}
      >
        <ItemMedia>
          <Avatar className="size-10 border border-white/10">
            <AvatarImage
              src={
                data.type === "GROUP"
                  ? data.mediaUrl
                  : getOtherMembers
                    ? getOtherMembers.profile.avatarUrl
                    : ""
              }
            />
            <AvatarFallback className="bg-white/5 text-gray-400">
              <CloudAlert className="size-5" />
            </AvatarFallback>
          </Avatar>
        </ItemMedia>
        <ItemContent className="ml-3 flex-1">
          <ItemTitle className="text-white font-semibold text-lg">
            {data.type === "GROUP" ? data.name : getOtherMembers?.profile.name}
          </ItemTitle>
          <ItemDescription className="text-gray-400 text-sm">
            {typingProfile ? (
              <span className="text-blue-400 animate-pulse">
                {typingProfile.name} is typing...
              </span>
            ) : data.type === "GROUP" ? (
              "Group Chat"
            ) : (
              "Private Chat"
            )}
          </ItemDescription>
        </ItemContent>
        {data.creatorId !== profileId && (
          <ItemActions>
            <Button
              variant="destructive"
              className="rounded-full px-6 bg-red-500/10 text-red-500 hover:bg-red-500/20 border-0"
              onClick={() => setApprove(true)}
            >
              Block
            </Button>
          </ItemActions>
        )}
      </Item>

      <AlertDialog open={approve} onOpenChange={(open) => setApprove(open)}>
        <AlertDialogContent
          size="sm"
          className="bg-[#151a23] border-white/10 text-white"
        >
          <AlertDialogHeader>
            <AlertDialogTitle>Allow connection?</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              Do you approve this request to continue chatting?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => router.push("/chats")}
              className="bg-transparent border-white/10 text-white hover:bg-white/5"
            >
              Disapprove
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-blue-600 hover:bg-blue-500 text-white"
              onClick={() => handleApproval()}
            >
              Approve
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {membersOpen && (
        <ChatMembers
          isAdmin={data.creatorId === profileId}
          chatId={data.id}
          open={membersOpen}
          setOpen={setMembersOpen}
        />
      )}

      {!approve && (
        <>
          {data.message.length === 0 ? (
            <div className="flex-1 flex items-center justify-center p-4">
              <Empty className="border border-dashed border-white/10 rounded-2xl bg-white/5 p-10 max-w-sm w-full">
                <EmptyHeader className="flex flex-col items-center text-center">
                  <EmptyMedia
                    variant="icon"
                    className="mb-4 text-blue-500 bg-blue-500/10 p-4 rounded-full"
                  >
                    <Amphora className="size-8" />
                  </EmptyMedia>
                  <EmptyTitle className="text-white text-lg font-semibold">
                    Messages are empty
                  </EmptyTitle>
                  <EmptyDescription className="text-gray-400 mt-1">
                    Say hi to start the conversation!
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            </div>
          ) : (
            <ItemGroup className="flex-1 overflow-y-auto p-4 md:p-6 flex flex-col gap-6">
              {data.message.map((msg) => {
                const isOwn = msg.sender.profile.id === profileId;
                return (
                  <Item
                    key={msg.id}
                    className={`flex gap-3 w-full ${isOwn ? "flex-row-reverse" : "flex-row"}`}
                    onClick={() => {
                      if (msg.senderId === profileId) {
                        setViewMsg({
                          open: true,
                          msgId: msg.id,
                          count: msg._count.members,
                        });
                      }
                    }}
                  >
                    <ItemMedia className="shrink-0 mt-auto">
                      <Avatar className="size-8 border border-white/10">
                        <AvatarImage
                          src={msg.sender.profile.avatarUrl}
                          className="object-cover"
                        />
                        <AvatarFallback className="bg-white/5 text-gray-400 text-xs">
                          {msg.sender.profile.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                    </ItemMedia>

                    <div
                      className={`flex flex-col gap-1 max-w-[75%] ${isOwn ? "items-end" : "items-start"}`}
                    >
                      {!isOwn && (
                        <span className="text-xs text-gray-500 ml-1">
                          {msg.sender.profile.name}
                        </span>
                      )}

                      <div className="flex items-end gap-2 group">
                        <ItemContent
                          className={`p-3.5 ${
                            isOwn
                              ? "bg-blue-600 text-white rounded-2xl rounded-br-sm shadow-sm"
                              : "bg-white/10 text-white rounded-2xl rounded-bl-sm border border-white/5 shadow-sm"
                          }`}
                        >
                          <ItemDescription className="text-sm leading-relaxed">
                            {msg.content}
                          </ItemDescription>
                        </ItemContent>

                        {/* Clean, formatted timestamp that fades in on hover */}
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity mb-1 shrink-0">
                          <span className="text-[11px] text-gray-500 whitespace-nowrap select-none">
                            {new Date(msg.createdAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Item>
                );
              })}
            </ItemGroup>
          )}
          {viewMsg.open && (
            <ViewMsg
              msgId={viewMsg.msgId}
              open={viewMsg.open}
              setOpen={(open) => setViewMsg((prev) => ({ ...prev, open }))}
              count={viewMsg.count}
            />
          )}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="sticky bottom-0 z-50 w-full pr-5.75"
          >
            <div className="p-4 pb-6 bg-[#0c0f14] border-t border-white/10 mt-auto shrink-0 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
              <div className="max-w-4xl mx-auto flex gap-3 items-center bg-white/5 border border-white/10 rounded-full p-1.5 pl-4 focus-within:border-blue-500/50 focus-within:ring-1 focus-within:ring-blue-500/50 transition-all">
                <Input
                  placeholder="Type a message..."
                  {...register("content")}
                  className="flex-1 bg-transparent border-0 text-white placeholder:text-gray-500 focus-visible:ring-0 focus-visible:ring-offset-0 px-0 shadow-none h-10"
                />
                <Button
                  type="submit"
                  size="icon"
                  disabled={!isWritting || addMsg.isPending}
                  className="rounded-full bg-blue-600 hover:bg-blue-500 text-white size-10 shrink-0 shadow-md transition-transform hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
                >
                  <Send className="size-4 ml-0.5" />
                </Button>
              </div>
            </div>
          </form>
        </>
      )}
    </div>
  );
}
