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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";
import { useCreateStory } from "@/hooks/useStory";
import { useUserStore } from "@/stores/UserStore";

export default function Create({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  const story = useCreateStory();
  const { control, handleSubmit, reset } = useForm<storyType>({
    resolver: zodResolver(storySchema),
    mode: "onSubmit",
  });
  const { fields, remove, append, move } = useFieldArray({
    control,
    name: "slides",
  });
  const setJob = useUserStore((state) => state.setJob);
  const onSubmit: SubmitHandler<storyType> = (data) => {
    console.log(data);
    const formData = new FormData();
    data.slides.forEach((item, index) => {
      if (item.type === "image") {
        formData.append(`slides[${index}][type]`, item.type);
        if (item.imageFile)
          formData.append(`slides[${index}][imageFile]`, item.imageFile);
        if (item.caption)
          formData.append(`slides[${index}][caption]`, item.caption);
      }
      if (item.type === "video") {
        formData.append(`slides[${index}][type]`, item.type);
        if (item.videoFile)
          formData.append(`slides[${index}][videoFile]`, item.videoFile);
        if (item.caption)
          formData.append(`slides[${index}][caption]`, item.caption);
      }
      if (item.type === "imageAudio") {
        formData.append(`slides[${index}][type]`, item.type);
        if (item.imageFile)
          formData.append(`slides[${index}][imageFile]`, item.imageFile);
        if (item.audioFile)
          formData.append(`slides[${index}][audioFile]`, item.audioFile);
        if (item.caption)
          formData.append(`slides[${index}][caption]`, item.caption);
      }
    });
    story.mutate(formData, {
      onSuccess: (result) => {
        console.log(result.data);
        setJob({
          id: result.data.id,
          name: result.data.name,
          status: result.data.status,
        });

        toast.success(result.message);
        reset();
        setOpen(false);
      },
      onError: (error) => {
        toast.error(error.message);
        console.error(error.error);
      },
    });
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
        className="sm:max-w-162.5 h-[80vh] flex flex-col p-0"
      >
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col flex-1 h-full overflow-hidden p-6"
        >
          <DialogHeader className="mb-4 shrink-0">
            <DialogTitle>Create Story</DialogTitle>
            <DialogDescription>
              Story shall expire after 24 hrs of upload
            </DialogDescription>
          </DialogHeader>
          <div className="flex-1 min-h-0 w-full pr-4 pb-4 overflow-y-auto custom-scrollbar">
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
                            {videoSlides?.length ?? 0}/
                            {ALLOWED_STORY_MEDIA.VIDEO}
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
                        <p>
                          Max {ALLOWED_STORY_MEDIA.COMBINED} Combinations
                          allowed
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent className="flex flex-col gap-2 p-0 mt-4 min-h-50">
                {fields.map((field, index) => {
                  const isImageField =
                    field.type === "image" || field.type === "imageAudio";
                  const isAudioField = field.type === "imageAudio";
                  const isVideoField = field.type === "video";
                  return (
                    <Slide
                      key={field.id}
                      item={field}
                      index={index}
                      isImageField={isImageField}
                      isAudioField={isAudioField}
                      isVideoField={isVideoField}
                      control={control}
                      isFirst={index === 0}
                      isLast={index === fields.length - 1}
                      move={move}
                      onRemove={() => remove(index)}
                    />
                  );
                })}
              </CardContent>
              {fields.length !== 0 && (
                <CardFooter className="flex justify-center">
                  {isImgAvail && (
                    <Button
                      type="button"
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
                      type="button"
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
                      type="button"
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
          </div>
          <DialogFooter className="mt-6 pt-4 border-t shrink-0">
            <DialogClose asChild>
              <Button type="button" variant={"outline"}>
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              variant={"secondary"}
              disabled={hasMissingFiles || fields.length === 0}
            >
              Submit
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
