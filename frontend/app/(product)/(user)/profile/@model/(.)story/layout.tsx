import DialogModal from "@/components/Modal";


export default function StoryLayoutOverlay({children}: Readonly<{children: React.ReactNode}>){
    // Some checking logic => Get storyId's from profile id of user => isFetching...
    return (
        <DialogModal>
            {children}
        </DialogModal>
    )
}