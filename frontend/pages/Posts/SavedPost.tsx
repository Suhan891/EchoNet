import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { SavedPosts } from "@/types/post";
import Image from "next/image";

export default function SavedPost({savePosts}:{savePosts: SavedPosts[]}) {
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
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
          </div>
          <CardHeader className="relative z-20 flex h-full flex-col justify-end p-4 text-white">
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
