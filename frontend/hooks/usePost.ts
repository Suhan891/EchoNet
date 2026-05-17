import { CreatePost, GetAllPosts, GetOthersPost, GetOwnPosts, GetSavedPosts, RemovePost, UpdateSavePost } from "@/service/posts";
import { ErrorResponse, JobCreate, PaginatedReqDto, SuccessResponse } from "@/types/common";
import { PostReelDto } from "@/types/profiles";
import { AllPosts, PostRequestData, SavedPosts } from "@/types/post";
import { queryKeys } from "@/utils/query.key";
import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";

export function useCreatePost() {
    return useMutation<SuccessResponse<JobCreate>,ErrorResponse,FormData>({
        mutationFn: (payload) => CreatePost(payload)
    })
}
export function useOwnPosts(profileId: string) {
    return useQuery<SuccessResponse<PostRequestData[]>, ErrorResponse>({
        queryKey: [profileId, queryKeys.POSTS],
        queryFn: () => GetOwnPosts(),
        enabled: !!profileId
    })
}
export function useRemovePost() {
    return useMutation<SuccessResponse<null>,ErrorResponse, string>({
        mutationFn: (payload) => RemovePost(payload)
    })
}

export function useOthersPost(payload:PostReelDto) {
    return useQuery<SuccessResponse<PostRequestData[]>,ErrorResponse>({
        queryKey: [queryKeys.POSTS,payload.profileId],
        queryFn: () => GetOthersPost(payload),
        enabled: payload.type === 'POST' && !!payload.count
    })
}

export function useAllPosts(payload:PaginatedReqDto) {
    return useInfiniteQuery<SuccessResponse<AllPosts>,ErrorResponse>({
        queryKey: [queryKeys.POSTS, payload],
        queryFn: ({pageParam}) => GetAllPosts({...payload, page: pageParam as number, limit: 10}),
        initialPageParam: 1,
        getNextPageParam: (lastPage) => {
            if(!lastPage.data?.meta?.hasNextPage) return undefined
            return lastPage.data?.meta.currentPage + 1
            },
    })
}

export function useSavePost() {
    return useMutation<SuccessResponse<null>,ErrorResponse,string>({
        mutationFn: (payload) => UpdateSavePost(payload)
    })
}
export function useMySavedPosts() {
    return useQuery<SuccessResponse<SavedPosts[]>,ErrorResponse>({
        queryKey: [queryKeys.SAVE_POST],
        queryFn: () => GetSavedPosts()
    })
}