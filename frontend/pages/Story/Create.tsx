"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Image as ImageIcon, Video, Images } from "lucide-react";
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
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

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
  const isImgAvail = (imageSlides?.length ?? 0) < ALLOWED_STORY_MEDIA.IMAGES;
  const areAllImagesPresent = imageSlides?.every(
    (slide) => slide.imageFile !== undefined,
  );
  const videoSlides = watchSlides.slides?.filter(
    (slide) => slide.type === "video",
  );
  const isVidAvail = (videoSlides?.length ?? 0) < ALLOWED_STORY_MEDIA.VIDEO;
  const areAllVidPresent = videoSlides?.every(
    (slide) => slide.videoFile !== undefined,
  );
  const combinedSlides = watchSlides.slides?.filter(
    (slide) => slide.type === "imageAudio",
  );
  const isCombiAvail =
    (combinedSlides?.length ?? 0) < ALLOWED_STORY_MEDIA.COMBINED;
  const areAllCombinedPresent = combinedSlides?.every(
    (slide) => slide.audioFile !== undefined && slide.imageFile !== undefined,
  );

  const hasMissingFiles =
    !areAllCombinedPresent || !areAllImagesPresent || !areAllVidPresent;

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogContent
        showCloseButton={false}
        className="sm:max-w-[650px] max-h-[90vh] flex flex-col p-0"
      >
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col h-full overflow-hidden p-6"
        >
          <DialogHeader className="mb-4">
            <DialogTitle>Create Story</DialogTitle>
            <DialogDescription>
              Story shall expire after 24 hrs of upload
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-[60vh] w-full pr-4" type="auto">
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
                  <CardDescription className="flex flex-wrap items-center gap-3 pt-2">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Badge
                          variant="secondary"
                          className="h-auto flex flex-col items-center justify-center gap-1 px-4 py-3 rounded-lg border shadow-sm"
                        >
                          <div className="flex items-center gap-1.5 opacity-70">
                            <ImageIcon size={14} />
                            <h3 className="text-[10px] font-medium uppercase tracking-wider">
                              Image
                            </h3>
                          </div>
                          <span className="text-sm font-bold tracking-tight">
                            {imageSlides?.length ?? 0}/
                            {ALLOWED_STORY_MEDIA.IMAGES}
                          </span>
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Max {ALLOWED_STORY_MEDIA.IMAGES} Images allowed</p>
                      </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                    <Badge
                      variant="secondary"
                      className="h-auto flex flex-col items-center justify-center gap-1 px-4 py-3 rounded-lg border shadow-sm"
                    >
                      <div className="flex items-center gap-1.5 opacity-70">
                        <Video size={14} />
                        <h3 className="text-[10px] font-medium uppercase tracking-wider">
                          Video
                        </h3>
                      </div>
                      <span className="text-sm font-bold tracking-tight">
                        {videoSlides?.length ?? 0}/{ALLOWED_STORY_MEDIA.VIDEO}
                      </span>
                    </Badge>
                    </TooltipTrigger>
                      <TooltipContent>
                        <p>Max {ALLOWED_STORY_MEDIA.VIDEO} Video allowed</p>
                      </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                    <Badge
                      variant="secondary"
                      className="h-auto flex flex-col items-center justify-center gap-1 px-4 py-3 rounded-lg border shadow-sm"
                    >
                      <div className="flex items-center gap-1.5 opacity-70">
                        <Images size={14} />
                        <h3 className="text-[10px] font-medium uppercase tracking-wider">
                          Img+Aud
                        </h3>
                      </div>
                      <span className="text-sm font-bold tracking-tight">
                        {combinedSlides?.length ?? 0}/
                        {ALLOWED_STORY_MEDIA.COMBINED}
                      </span>
                    </Badge>
                    </TooltipTrigger>
                      <TooltipContent>
                        <p>Max {ALLOWED_STORY_MEDIA.COMBINED} Combinations allowed</p>
                      </TooltipContent>
                    </Tooltip>
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent className="flex flex-col gap-2 p-0 mt-4">
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
                  {isImgAvail && (
                    <Button
                      variant={"secondary"}
                      className="rounded-xl"
                      disabled={hasMissingFiles}
                      onClick={() => append({ type: "image" })}
                    >
                      <Plus /> Image
                    </Button>
                  )}
                  {isVidAvail && (
                    <Button
                      variant={"secondary"}
                      className="rounded-xl"
                      disabled={hasMissingFiles}
                      onClick={() => append({ type: "video" })}
                    >
                      <Plus /> Video
                    </Button>
                  )}
                  {isCombiAvail && (
                    <Button
                      variant={"secondary"}
                      className="rounded-xl"
                      disabled={hasMissingFiles}
                      onClick={() => append({ type: "imageAudio" })}
                    >
                      <Plus /> Img+Aud
                    </Button>
                  )}
                </CardFooter>
              )}
            </Card>
          </ScrollArea>
          <DialogFooter className="mt-6 pt-4 border-t">
            <DialogClose asChild>
              <Button type="button" variant={"outline"}>
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              variant={"secondary"}
              disabled={hasMissingFiles}
            >
              Submit
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
