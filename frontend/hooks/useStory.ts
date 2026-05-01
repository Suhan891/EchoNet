import { CreateStoryRequest, RemoveStroy, StoriesOwnRequest } from "@/service/story";
import { ErrorResponse, JobCreate, SuccessResponse } from "@/types/common";
import { StoryData } from "@/types/stores";
import { queryKeys } from "@/utils/query.key";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";

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





// export function useOwnStories(storyId:string) {
//     return useQuery<SuccessResponse<StoryMedia[]>, ErrorResponse>({
//         queryKey: [queryKeys.STORY, storyId],
//         queryFn: () => StoriesOwnRequest(),
//         enabled: !!storyId
//     })
// }
