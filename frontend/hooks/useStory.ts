import { CreateStoryRequest, GetStory, StoriesOwnRequest } from "@/service/story";
import { ErrorResponse, SuccessResponse } from "@/types/common";
import { StoryMedia, StoryResponseType } from "@/types/story.detils";
import { queryKeys } from "@/utils/query.key";
import { useMutation, useQuery } from "@tanstack/react-query";

export function useCreateStory() {
    return useMutation<SuccessResponse<StoryResponseType>,ErrorResponse,FormData>({
        mutationFn: (payload) => CreateStoryRequest(payload)
    })
}
export function useAvailStory(profileId: string) {
    return useQuery<SuccessResponse<StoryResponseType>, ErrorResponse>({
        queryKey: [queryKeys.STORY_STATUS, profileId],
        queryFn: () => GetStory(),
        enabled: !!profileId,
        refetchInterval: (query) => {
            if(query.state.data?.data.status === 'successfull') return false;
            return 2000;
        }
    })
}
export function useOwnStories(storyId:string) {
    return useQuery<SuccessResponse<StoryMedia[]>, ErrorResponse>({
        queryKey: [queryKeys.STORY, storyId],
        queryFn: () => StoriesOwnRequest(),
        enabled: !!storyId
    })
}
