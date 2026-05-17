import {
  AddMessage,
  AddProfileGroup,
  CreateGroup,
  CreatePrivate,
  GetAllChatMsgs,
  GetChats,
  GetMembersGroup,
  getProfForGroup,
  GetProfForGroupAdd,
  getProfForPrivate,
  UpdateApproval,
  ViewMessage,
} from "@/service/chat";
import {
  ChatDto,
  ChatMembersDto,
  ChatsMsgsDto,
  CreateChatDto,
  MessageViewDto,
} from "@/types/chat";
import { ErrorResponse, SuccessResponse } from "@/types/common";
import { queryKeys } from "@/utils/query.key";
import { messageType } from "@/validations/chats/message";
import { useMutation, useQuery } from "@tanstack/react-query";

export function useAllProfileForPrivate() {
  return useQuery<SuccessResponse<CreateChatDto[]>, ErrorResponse>({
    queryKey: ["PRIVATE", queryKeys.CHAT],
    queryFn: () => getProfForPrivate(),
  });
}
export function useAllProfileForGroup() {
  return useQuery<SuccessResponse<CreateChatDto[]>, ErrorResponse>({
    queryKey: ["GROUP", queryKeys.CHAT],
    queryFn: () => getProfForGroup(),
  });
}
export function useGroupMembers(chatId: string, work: "VIEW" | "ADD") {
  return useQuery<SuccessResponse<ChatMembersDto>, ErrorResponse>({
    queryKey: [chatId, work],
    queryFn: () => GetMembersGroup(chatId),
    enabled: work === "VIEW",
  });
}
export function useProfileGroupAdd(chatId: string, work: "VIEW" | "ADD") {
  return useQuery<SuccessResponse<CreateChatDto[]>, ErrorResponse>({
    queryKey: [chatId, work],
    queryFn: () => GetProfForGroupAdd(chatId),
    enabled: work === "ADD",
  });
}
export function useAddMember() {
  return useMutation<
    SuccessResponse<null>,
    ErrorResponse,
    { chatId: string; name: string }
  >({
    mutationFn: (payload) => AddProfileGroup(payload),
  });
}

export function useCreatePrivate() {
  return useMutation<SuccessResponse<null>, ErrorResponse, string>({
    mutationFn: (payload) => CreatePrivate(payload),
  });
}
export function useCreateGroup() {
  return useMutation<SuccessResponse<null>, ErrorResponse, FormData>({
    mutationFn: (payload) => CreateGroup(payload),
  });
}
export function useAllchat() {
  return useQuery<SuccessResponse<ChatDto[]>, ErrorResponse>({
    queryKey: [queryKeys.CHAT],
    queryFn: () => GetChats(),
  });
}
export function useChatApproval() {
  return useMutation<SuccessResponse<null>, ErrorResponse, string>({
    mutationFn: (payload) => UpdateApproval(payload),
  });
}
export function useAllChatMsgs(chatId: string) {
  return useQuery<SuccessResponse<ChatsMsgsDto>, ErrorResponse>({
    queryKey: [chatId],
    queryFn: () => GetAllChatMsgs(chatId),
    enabled: !!chatId,
  });
}

export function useAddMessage() {
  return useMutation<SuccessResponse<null>, ErrorResponse, messageType>({
    mutationFn: (payload) => AddMessage(payload),
  });
}

export function useViewMsg(msgId: string, count: number) {
  return useQuery<SuccessResponse<MessageViewDto>, ErrorResponse>({
    queryKey: [msgId],
    queryFn: () => ViewMessage(msgId),
    enabled: count !== 0,
  });
}
