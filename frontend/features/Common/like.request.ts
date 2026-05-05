import { useToggleLike } from "@/hooks/useLike";
import { useStore } from "@/stores/Store";
import { queryKeys } from "@/utils/query.key";
import { useQueryClient } from "@tanstack/react-query";


export function useLikeReq() {
    const likeReq = useStore(state => state.like);
    const like = useToggleLike()
    const queryClient = useQueryClient()

    if(likeReq) {
        like.mutate(likeReq, {
            onSuccess: (result) => {
        if(likeReq.type === 'POST'){ // LAter key proper handing
            queryClient.invalidateQueries({queryKey: [queryKeys.POSTS]})
            queryClient.invalidateQueries({queryKey: [queryKeys.ALL_POSTS]})}
                console.log(result);
            },
            onError: (errors) => {
                console.error(errors.error);
                console.error(errors)
            }
        })
    }

    return like.isPending;
}