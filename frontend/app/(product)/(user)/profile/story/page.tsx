import ViewStory from "@/pages/Profile/Story";
import CreateStory from "@/pages/Story/CreateStory";
import { useStoryStore } from "@/stores/StoryStore";


export default function StoryOverlayPage() {
    const story = useStoryStore(state => state.stories)
    if(!story) return <CreateStory />
    return <ViewStory />
}
