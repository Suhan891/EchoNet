"use client";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Toggle } from "@/components/ui/toggle";
import { useProfileStore } from "@/stores/ProfileStore";
import { PostRequestData } from "@/types/post";
import { MAX_ALLOWED_POST_ADD } from "@/utils/constants";
import { Heart, MessageSquareText, Plus } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import CreatePost from "./CreatePost";
import { useStore } from "@/stores/Store";

interface PostsProp {
  posts: PostRequestData[];
  isOwn: boolean;
}

export default function ViewPost({ posts, isOwn }: PostsProp) {
  const [openLike, setOpenLike] = useState<boolean>(false);
  const postsCount = useProfileStore((state) => state.posts);
  const [open, setOpen] = useState(false);

  const setLike = useStore((state) => state.setLikeReq);
  const setFollow = useStore(state => state.setFollowReq)
  const handleLike = (id: string) => {
    if (isOwn) return setOpenLike(!openLike);
    setLike({ type: 'POST', id });
  };
  const handleFollow = (id: string) => setFollow({type: 'FOLLOW', id})
  return (
    <div className="flex flex-col gap-5 w-full max-w-3xl mx-auto">
      {posts.map((post) => (
        <Card
          key={post.id}
          className="overflow-hidden border-border/40 shadow-sm hover:shadow-md transition-shadow duration-300 rounded-2xl bg-card/50 backdrop-blur-sm"
        >
          <CardHeader>
            <CardTitle>{post.caption}</CardTitle>
            <CardDescription>{post.description}</CardDescription>
          </CardHeader>

          <CardContent className="px-4">
            <Carousel opts={{ align: "start" }} className="w-full">
              <CarouselContent className="-ml-2">
                {post.postPhoto.map((photo) => (
                  <CarouselItem
                    key={photo.id}
                    className="basis-1/2 md:basis-1/3 pl-2"
                  >
                    <div className="overflow-hidden rounded-md border border-border/40">
                      {" "}
                      <AspectRatio ratio={1 / 1.5}>
                        <Image
                          src={photo.mediaUrl}
                          alt={photo.id}
                          fill
                          className="object-cover"
                        />
                      </AspectRatio>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>

              <div className="flex justify-end gap-2 mt-3">
                <CarouselPrevious className="static translate-y-0" />{" "}
                <CarouselNext className="static translate-y-0" />
              </div>
            </Carousel>
          </CardContent>

          <CardFooter className="flex w-full justify-between items-center pt-4">
            <div className="flex gap-2">
              <Toggle
                aria-label="Toggle like"
                size="sm"
                variant="outline"
                onClick={() => handleLike(post.id)}
              >
                <Heart className="h-4 w-4" />
                {isOwn && post._count.likes}
              </Toggle>
              <Toggle aria-label="Toggle comments" size="sm" variant="outline">
                <MessageSquareText className="h-4 w-4" />
                {post._count.comments}
              </Toggle>
            </div>

            {isOwn && (
              <div className="flex gap-2">
                <Button variant="secondary" size="sm">
                  Update
                </Button>
                <Button variant="destructive" size="sm">
                  Delete
                </Button>
              </div>
            )}
          </CardFooter>
        </Card>
      ))}
      {isOwn && postsCount < MAX_ALLOWED_POST_ADD && (
        <Button onClick={() => setOpen(!open)}>
          <Plus />
          Add Posts
        </Button>
      )}
      {open && <CreatePost open={open} setOpen={setOpen} />}
    </div>
  );
}
