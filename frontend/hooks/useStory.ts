import { GetStories, GetStoryMedia } from "@/service/story";
import { useProfileStore } from "@/stores/ProfileStore";
import { ErrorResponse, SuccessResponse } from "@/types/common";
import { Stories, StoryMedia } from "@/types/story.detils";
import { queryKeys } from "@/utils/query.key";
import { useQuery } from "@tanstack/react-query";

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