import { useProfileStore } from "@/stores/ProfileStore";

export default function Story() {
    const stories = useProfileStore(state => state.stories);
    console.log(stories);
    return (
        <div className="h-full">Story Page</div>
    )
}
