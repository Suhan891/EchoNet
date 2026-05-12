import { CreateGroup, CreatePrivate, getProfForGroup, getProfForPrivate } from "@/service/chat";
import { CreateChatDto } from "@/types/chat";
import { ErrorResponse, SuccessResponse } from "@/types/common";
import { queryKeys } from "@/utils/query.key";
import { useMutation, useQuery } from "@tanstack/react-query";

export function useAllProfileForPrivate() {
    return useQuery<SuccessResponse<CreateChatDto[]>, ErrorResponse>({
        queryKey: ['PRIVATE',queryKeys.CHAT],
        queryFn: () => getProfForPrivate(),
    })
}
export function useAllProfileForGroup() {
    return useQuery<SuccessResponse<CreateChatDto[]>, ErrorResponse>({
        queryKey: ['GROUP', queryKeys.CHAT],
        queryFn: () => getProfForGroup(),
    })
}
export function useCreatePrivate() {
    return useMutation<SuccessResponse<null>, ErrorResponse, string>({
        mutationFn: (payload) => CreatePrivate(payload)
    })
}
export function useCreateGroup() {
    return useMutation<SuccessResponse<null>, ErrorResponse, FormData>({
        mutationFn: (payload) => CreateGroup(payload)
    })
}