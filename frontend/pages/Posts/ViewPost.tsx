import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
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
} from "@/components/ui/carousel";
import { Toggle } from "@/components/ui/toggle";
import { PostRequestData } from "@/types/stores";
import { Heart, MessageSquareText } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface PostsProp {
  posts: PostRequestData[];
  isOwn: boolean;
}

export default function ViewPost({ posts, isOwn }: PostsProp) {
  const [openLike, setOpenLike] = useState<boolean>(false);
  const handleLike = (id: string) => {
    if (isOwn) return setOpenLike(!openLike);
    // Mutation for other users
  };
  return (
    <div className="flex flex-col gap-5 w-full max-w-3xl mx-auto">
        {posts.map((post) => (
          <Card key={post.id}>
            <CardHeader>
              <CardTitle>{post.caption}</CardTitle>
              <CardDescription>{post.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Carousel
                opts={{
                  align: "start",
                }}
                className="w-full"
              >
                <CarouselContent>
                  {post.postPhoto.map((photo) => (
                    <CarouselItem
                      key={photo.id}
                      className="basis-1/2 md:basis-1/3 pl-4"
                    >
                      <Card className="px-1 overflow-hidden rounded-md border">
                        <CardContent className="flex items-center justify-center">
                          <AspectRatio ratio={1 / 1.5}>
                            <Image
                              src={photo.mediaUrl}
                              alt={photo.id}
                              fill
                              className="object-cover"
                            />
                          </AspectRatio>
                        </CardContent>
                      </Card>
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
            </CardContent>
            <CardFooter className="flex w-full justify-between items-center pt-4">
              {/* Left Side: Social Actions */}
              <div className="flex gap-2">
                <Toggle aria-label="Toggle like" size="sm" variant="outline">
                  <Heart className="h-4 w-4" />
                </Toggle>
                <Toggle
                  aria-label="Toggle comments"
                  size="sm"
                  variant="outline"
                >
                  <MessageSquareText className="h-4 w-4" />
                </Toggle>
              </div>

              {/* Right Side: Management Actions */}
              <div className="flex gap-2">
                <Button variant="secondary" size="sm">
                  Update
                </Button>
                <Button variant="destructive" size="sm">
                  Delete
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
  );
}
