"use client"
import { Card, CardContent } from "@/components/ui/card";
import { EmblaCarouselType } from 'embla-carousel'
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import * as React from "react";
import Autoplay from "embla-carousel-autoplay";
import { useStoryStore } from "@/stores/StoryStore";

export default function ViewStory() {
    
  const [api, setApi] = React.useState<CarouselApi>()
  const stories = useStoryStore((state) => state.stories);

  const plugin = React.useRef(
    Autoplay({ 
      delay: 2000, 
      stopOnInteraction: false, 
      stopOnLastSnap: true
    }),
  );

  const onSelect = React.useCallback((embelaApi: EmblaCarouselType) => {
    const index = embelaApi.selectedScrollSnap()
    const activeStory = stories?.[index];
    if(activeStory) {
      console.log('Active story: ', activeStory.id)
      // Db call on useQuery
    }
  },[stories])

React.useEffect(() => {
  if (!api) return;

  onSelect(api);

  api.on('select', onSelect);

  return () => {
    api.off('select', onSelect);
  };
}, [api, onSelect]);
  
  if(!stories)
    return null;

  return (
    <div className="h-full flex justify-center items-center">
    <Carousel
    setApi={setApi}
      plugins={[plugin.current]}
      className="w-full max-w-120 sm:max-w-xs"
      onMouseEnter={() => plugin.current.stop()}
      onMouseLeave={() => plugin.current.play()}
    >
      <CarouselContent>
        {stories.map((story) => (
          <CarouselItem key={story.id}>
            <div className="p-1">
              <Card>
                <CardContent className="flex aspect-square items-center justify-center p-6">
                  <span className="text-4xl font-semibold">{story.order}</span>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
    </div>
  );
}
