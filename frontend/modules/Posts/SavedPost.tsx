import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Toggle } from "@/components/ui/toggle";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useSavePostReq } from "@/features/Common/save.post";
import { cn } from "@/lib/utils";
import { useStore } from "@/stores/Store";
import { SavedPosts } from "@/types/post";
import { BookmarkIcon } from "lucide-react";
import Image from "next/image";

export default function SavedPost({ savePosts }: { savePosts: SavedPosts[] }) {
  const setSavePostReq = useStore((state) => state.setSavePost);
  const isOngoingSavePost = useSavePostReq();
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-4">
      {savePosts.map((posts) => (
        <Card
          key={posts.post.id}
          className="relative overflow-hidden group mx-auto w-full max-w-sm aspect-[4/5] pt-0 border-0 shadow-md"
        >
          <div className="absolute inset-0 z-10 bg-black">
            <Image
              src={posts.post.mediaUrl}
              alt="savedPost"
              fill
              className="object-cover transition-all duration-300 group-hover:scale-105 group-hover:grayscale-0 grayscale opacity-80"
            />

            <Tooltip>
              <TooltipTrigger asChild>
                <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 transition-transform duration-300 scale-90 group-hover:scale-100">
                  <Toggle
                    aria-label="Toggle bookmark"
                    variant="outline"
                    disabled={isOngoingSavePost}
                    pressed={true}
                    onClick={() =>
                      setSavePostReq({
                        mediaId: posts.post.id
                      })
                    }
                    className={cn(
                      "h-12 w-12 rounded-full border-white/20 bg-background/30 backdrop-blur-sm shadow-xl transition-all",
                      "text-white hover:bg-background/50 hover:text-white",
                      "data-[state=on]:bg-white data-[state=on]:border-white data-[state=on]:text-black",
                    )}
                  >
                    <BookmarkIcon
                      className={cn(
                        "h-5 w-5 transition-all",
                        "group-data-[state=on]:fill-current",
                      )}
                    />
                  </Toggle>
                </span>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="text-xs">
                <p>Unsave Post</p>
              </TooltipContent>
            </Tooltip>

            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
          </div>

          <CardHeader className="relative z-20 flex h-full flex-col justify-end p-4 text-white pointer-events-none">
            <CardTitle className="flex items-center gap-3">
              <Avatar className="h-10 w-10 border-2 border-white/50">
                <AvatarImage src={posts.post.post.profile.avatarUrl} />
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {posts.post.post.profile.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <h1 className="text-base font-semibold drop-shadow-md">
                {posts.post.post.profile.name}
              </h1>
            </CardTitle>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
}
