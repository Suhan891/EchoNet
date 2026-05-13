import {
  AddMessage,
  CreateGroup,
  CreatePrivate,
  GetAllChatMsgs,
  GetChats,
  getProfForGroup,
  getProfForPrivate,
  UpdateApproval,
} from "@/service/chat";
import { ChatDto, ChatsMsgsDto, CreateChatDto } from "@/types/chat";
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
    queryKey: [queryKeys.CHAT, chatId],
    queryFn: () => GetAllChatMsgs(chatId),
    enabled: !!chatId,
  });
}

export function useAddMessage() {
  return useMutation<SuccessResponse<null>, ErrorResponse, messageType>({
    mutationFn: (payload) => AddMessage(payload),
  });
}
