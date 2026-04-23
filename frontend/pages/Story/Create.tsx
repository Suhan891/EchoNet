"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { storySchema, storyType } from "@/validations/story/story.create";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import {
  SubmitHandler,
  useFieldArray,
  useForm,
  useWatch,
} from "react-hook-form";
import Slide from "./Slides";
import { ALLOWED_STORY_MEDIA } from "@/utils/constants";
import { ButtonGroup } from "@/components/ui/button-group";

export default function Create({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  const { control, handleSubmit } = useForm<storyType>({
    resolver: zodResolver(storySchema),
    mode: "onSubmit",
  });
  const { fields, remove, append } = useFieldArray({
    control,
    name: "slides",
  });
  const onSubmit: SubmitHandler<storyType> = (data) => {
    console.log(data);
  };
  const watchSlides = useWatch({
    control,
    defaultValue: {
      slides: [],
    },
  });
  const imageSlides = watchSlides.slides?.filter(
    (slide) => slide.type === "image",
  );
  const videoSlides = watchSlides.slides?.filter(
    (slide) => slide.type === "video",
  );
  const combinedSlides = watchSlides.slides?.filter(
    (slide) => slide.type === "imageAudio",
  );
  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogContent showCloseButton={false} className="w-2xl">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Create Story</DialogTitle>
            <DialogDescription>
              Story shall expire after 24 hrs of upload
            </DialogDescription>
          </DialogHeader>
          <ScrollArea>
            <Card className="w-full p-1.5">
              <CardHeader className="flex justify-center">
                {fields.length === 0 ? (
                  <ButtonGroup>
                    <Button
                      variant={"outline"}
                      size={"sm"}
                      onClick={() => append({ type: "image" })}
                    >
                      <Plus />
                      Image
                    </Button>
                    <Button
                      variant={"outline"}
                      size={"sm"}
                      onClick={() => append({ type: "video" })}
                    >
                      <Plus />
                      Video
                    </Button>
                    <Button
                      variant={"outline"}
                      size={"sm"}
                      onClick={() => append({ type: "imageAudio" })}
                    >
                      <Plus />
                      Img+Audio
                    </Button>
                  </ButtonGroup>
                ) : (
                  <CardDescription>
                    <Badge className="flex-col">
                      <h3>Image</h3>
                      <span>
                        {imageSlides?.length ?? 0}/{ALLOWED_STORY_MEDIA.IMAGES}
                      </span>
                    </Badge>
                    <Badge className="flex-col">
                      <h3>Video</h3>
                      <span>
                        {videoSlides?.length ?? 0}/{ALLOWED_STORY_MEDIA.VIDEO}
                      </span>
                    </Badge>
                    <Badge className="flex-col">
                      <h3>Img+Aud</h3>
                      <span>
                        {combinedSlides?.length ?? 0}/
                        {ALLOWED_STORY_MEDIA.COMBINED}
                      </span>
                    </Badge>
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent className="flex-col gap-2">
                {fields.map((field, index) => {
                  const isImageSlide =
                    field.type === "image" || field.type === "imageAudio";
                  const isCombinedSlide = field.type === "imageAudio";
                  const isVideoSlide = field.type === "video";
                  return (
                    <Slide
                      key={field.id}
                      item={field}
                      index={index}
                      isImageSlide={isImageSlide}
                      isCombinedSlide={isCombinedSlide}
                      isVideoSlide={isVideoSlide}
                      control={control}
                      onRemove={() => remove(index)}
                    />
                  );
                })}
              </CardContent>
              {fields.length !== 0 && (
                <CardFooter className="flex justify-center">
                  <Button variant={"secondary"} className="rounded-xl">
                    <Plus /> Image
                  </Button>
                  <Button variant={"secondary"} className="rounded-xl">
                    <Plus /> Video
                  </Button>
                  <Button variant={"secondary"} className="rounded-xl">
                    <Plus /> Img+Aud
                  </Button>
                </CardFooter>
              )}
            </Card>
          </ScrollArea>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant={"outline"}>
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" variant={"secondary"}>
              Submit
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
