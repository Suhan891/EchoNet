"use client";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Skeleton } from "@/components/ui/skeleton";
import { useStoryMedia } from "@/hooks/useStory";
import { useStore } from "@/stores/Store";
import Autoplay from "embla-carousel-autoplay";
import { Eye, Heart, Volume2, VolumeX } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import LikesView from "../Hero/Likes";

interface ViewStoryProps {
  stories: string[];
  isOwn: boolean;
}
export default function ViewStory({ stories, isOwn }: ViewStoryProps) {
  const [duration, setDuration] = useState(3000);
  const storyRef = useRef(stories);
  const [api, setApi] = useState<CarouselApi>();
  const [story, setStory] = useState(storyRef.current[0]);
  const [isMuted, setIsMuted] = useState(false);

  const [openLike, setOpenLike] = useState(false);

  const plugin = useRef(
    Autoplay({
      delay: duration,
      stopOnInteraction: false,
      stopOnLastSnap: true,
    }),
  );
  const setLikeReq = useStore((state) => state.setLikeReq);

  const { isLoading, isError, isSuccess, error, data } = useStoryMedia(story);

  useEffect(() => {
    if (!isSuccess || !api) return;

    const newDuration = data.data.duration ?? 3000;
    setDuration(newDuration); // will be used for progress bar only

    const autoplay = api.plugins()?.autoplay;
    if (!autoplay) return;

    autoplay.stop();
    autoplay.play();
  }, [isSuccess, data, api]);

  useEffect(() => {
    if (!api) return;

    api.on("select", () => {
      const index = api.selectedScrollSnap();
      console.log("Available index", index);
      setStory(storyRef.current[index]);
    });
  }, [api]);

  return (
    <Carousel
      setApi={setApi}
      plugins={[plugin.current]}
      className="w-full max-w-120 sm:max-w-xs"
      onMouseEnter={() => api?.plugins()?.autoplay?.stop()}
      onMouseLeave={() => api?.plugins()?.autoplay?.play()}
    >
      <CarouselContent>
        {stories.map((story) => (
          <CarouselItem key={story}>
            <div className="p-1">
              {isSuccess && (
                <Card className="overflow-hidden border-none bg-black shadow-md rounded-xl">
                  <CardContent className="relative flex aspect-[9/16] items-center justify-center p-0">
                    {data.data.mediaType !== "IMG" && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-4 top-4 z-20 h-9 w-9 rounded-full bg-black/20 text-white hover:bg-black/40"
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsMuted(!isMuted);
                        }}
                      >
                        {isMuted ? (
                          <VolumeX className="h-5 w-5" />
                        ) : (
                          <Volume2 className="h-5 w-5" />
                        )}
                      </Button>
                    )}

                    {data.data.mediaType === "IMG" ? (
                      <Image
                        src={data.data.mediaUrl}
                        alt={data.data.id || "story"}
                        fill
                        className="object-cover"
                        priority
                      />
                    ) : (
                      <video
                        src={data.data.mediaUrl}
                        className="h-full w-full object-cover"
                        autoPlay
                        loop
                        playsInline
                        muted={isMuted}
                      />
                    )}

                    <CardFooter className="absolute bottom-0 left-0 z-10 flex w-full justify-between bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 pb-6">
                      {!isOwn ? (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-white hover:bg-black/20 hover:text-white/80"
                          onClick={() =>
                            setLikeReq({ type: "STORY", id: data.data.id })
                          }
                        >
                          <Heart className="h-6 w-6" />
                        </Button>
                      ) : (
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-white hover:bg-black/20 hover:text-white/80"
                            onClick={() => setOpenLike(!openLike)}
                          >
                            <Heart className="mr-2 h-5 w-5" />{" "}
                            {data.data._count.likes}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-white hover:bg-black/20 hover:text-white/80"
                          >
                            <Eye className="mr-2 h-5 w-5" />{" "}
                            {data.data._count.storyViews}
                          </Button>
                        </div>
                      )}
                      {openLike && (
                        <LikesView
                          open={openLike}
                          setOpen={setOpenLike}
                          format={{ id: data.data.id, type: "STORY" }}
                          count={data.data._count.likes}
                        />
                      )}
                    </CardFooter>
                  </CardContent>
                </Card>
              )}

              {isLoading && (
                <Card className="w-full max-w-xs border-none bg-transparent shadow-none">
                  <CardContent className="p-0">
                    <Skeleton className="aspect-[9/16] w-full rounded-xl" />
                  </CardContent>
                </Card>
              )}

              {isError && (
                <div className="flex aspect-[9/16] w-full flex-col items-center justify-center rounded-xl bg-destructive/10 p-6 text-center text-destructive">
                  <span className="font-semibold">Failed to load</span>
                  <span className="text-sm">{error.message}</span>
                </div>
              )}
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="hidden sm:flex" />
      <CarouselNext className="hidden sm:flex" />
    </Carousel>
  );
}
