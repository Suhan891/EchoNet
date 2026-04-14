'use client'
import DialogModal from "@/components/Modal";
import { useProfileStore } from "@/stores/ProfileStore";
import { useEffect } from "react";

export default function StoryLayoutOverlay({children}: Readonly<{children: React.ReactNode}>){
    // Some checking logic => Get storyId's from profile id of user => isFetching...
    const storyId = useProfileStore(state => state.storyId)
    //if(!storyId) return => Error page
    useEffect(()=>{},[])
    return (
        <DialogModal>
            {children}
        </DialogModal>
    )
}