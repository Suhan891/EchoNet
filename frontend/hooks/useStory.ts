import { CreateStoryRequest, GetStory, GetStoryMedia, RemoveStroy, StoriesOwnRequest } from "@/service/story";
import { ErrorResponse, JobCreate, SuccessResponse } from "@/types/common";
import { StoryData } from "@/types/stores";
import { StoryDto } from "@/types/story.detils";
import { queryKeys } from "@/utils/query.key";
import { useMutation, useQuery, useSuspenseQuery } from "@tanstack/react-query";

export function useCreateStory() {
    return useMutation<SuccessResponse<JobCreate>,ErrorResponse,FormData>({
        mutationFn: (payload) => CreateStoryRequest(payload)
    })
}
export function useDeleteStory() {
    return useMutation<SuccessResponse<null>,ErrorResponse>({
        mutationFn:() => RemoveStroy()
    })
}
export function useOwnStory(profileId: string) {
    return useSuspenseQuery<SuccessResponse<StoryData[]>,ErrorResponse>({
        queryKey: [profileId, queryKeys.STORY],
        queryFn: () => StoriesOwnRequest(),
    })
}
export function useStories(storyId: string) {
    return useQuery<SuccessResponse<string[]>,ErrorResponse>({
        queryKey: [queryKeys.STORY, storyId],
        queryFn: () => GetStory(storyId),
        enabled: !!storyId
    })
}
export function useStoryMedia(storyMediaId: string) {
        return useQuery<SuccessResponse<StoryDto>,ErrorResponse>({
        queryKey: [queryKeys.STORY, storyMediaId],
        queryFn: () => GetStoryMedia(storyMediaId),
        enabled: !!storyMediaId
    })
}



// export function useOwnStories(storyId:string) {
//     return useQuery<SuccessResponse<StoryMedia[]>, ErrorResponse>({
//         queryKey: [queryKeys.STORY, storyId],
//         queryFn: () => StoriesOwnRequest(),
//         enabled: !!storyId
//     })
// }
