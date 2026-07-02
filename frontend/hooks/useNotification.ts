import { DeleteNotification, GetNotifications, GetNotifyData } from "@/service/notification";
import { ErrorResponse, NotificationDto, NotifyType, SuccessResponse } from "@/types/common";
import { queryKeys } from "@/utils/query.key";
import { useMutation, useQuery } from "@tanstack/react-query";


export function useNotification() {
    return useQuery<SuccessResponse<NotificationDto[]>, ErrorResponse>({
        queryKey: [queryKeys.NOTIFICATIONS],
        queryFn: () => GetNotifications()
    })
}
export function useNotifyData() {
    return useMutation<SuccessResponse<NotifyType>, ErrorResponse, string>({
        mutationFn: (payload) => GetNotifyData(payload)
    })
}
export function useNotifyDelete() {
    return useMutation<SuccessResponse<void>, ErrorResponse, string>({
        mutationFn: (payload) => DeleteNotification(payload)
    })
}