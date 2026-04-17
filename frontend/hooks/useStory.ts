import { CreateStoryRequest, GetStories, GetStoryMedia, StoryStatus } from "@/service/story";
import { useProfileStore } from "@/stores/ProfileStore";
import { ErrorResponse, SuccessResponse } from "@/types/common";
import { Stories, StoryMedia, StoryCreateResponse, StoryStatusResponse, StoryStatReq } from "@/types/story.detils";
import { queryKeys } from "@/utils/query.key";
import { useMutation, useQuery } from "@tanstack/react-query";

export function useCreateStory() {
    return useMutation<SuccessResponse<StoryCreateResponse>,ErrorResponse,FormData>({
        mutationFn: (payload) => CreateStoryRequest(payload)
    })
}
export function useStoryStatus(storyId: string, enabled: boolean) {
    return useQuery<SuccessResponse<StoryStatusResponse>, ErrorResponse>({
        queryKey: [queryKeys.STORY_STATUS, storyId],
        queryFn: () => StoryStatus(),
        enabled: !!storyId && enabled,
        refetchInterval: (query) => {
            if(query.state.data?.data.status === 'successfull') return false
            return 2000
        }
    })
}


export function useStory() {
    const storyId = useProfileStore(state => state.storyId);
    return useQuery<SuccessResponse<Stories[]>, ErrorResponse>({
        queryKey: [queryKeys.STORY, storyId, queryKeys.PROFILE],
        queryFn: () => GetStories(storyId!),
        enabled: !!storyId,
        staleTime: 1000 * 60 * 5
    });
}

export function useStories(storyMediaId: string) {
  const storiesId = useProfileStore(state => state.stories)
    return useQuery<SuccessResponse<StoryMedia>, ErrorResponse>({
        queryKey: [queryKeys.PROFILE, storyMediaId],
        queryFn: () => GetStoryMedia(storyMediaId),
        enabled: !!storiesId,
        staleTime: 1000 * 60 * 5
    });
}