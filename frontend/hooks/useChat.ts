import { getProfForGroup, getProfForPrivate } from "@/service/chat";
import { CreateChatDto } from "@/types/chat";
import { ErrorResponse, SuccessResponse } from "@/types/common";
import { queryKeys } from "@/utils/query.key";
import { useQuery } from "@tanstack/react-query";

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
