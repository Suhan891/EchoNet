import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
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
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldError,
  FieldContent,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCreateStory } from "@/hooks/useStory";
import { cn } from "@/lib/utils";
import { useProfileStore } from "@/stores/ProfileStore";
import { useStoryStore } from "@/stores/StoryStore";
import { SlideType } from "@/types/story.detils";
import {
  ALLOWED_STORY_MEDIA,
  SLIDE_HEADER,
  SLIDES_DESCRIPTION,
} from "@/utils/constants";
import { storySchema, storyType } from "@/validations/story/story.create";
import { zodResolver } from "@hookform/resolvers/zod";
import { ImageIcon, Plus, Upload } from "lucide-react";
import Image from "next/image";
import {
  Controller,
  SubmitHandler,
  useFieldArray,
  useForm,
  useWatch,
} from "react-hook-form";
import { toast } from "sonner";

export default function CreateStory({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  const story = useCreateStory();
  const setStory = useProfileStore((state) => state.setStory);
  const { control, reset, handleSubmit, trigger } = useForm<storyType>({
    resolver: zodResolver(storySchema),
    mode: "onSubmit",
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "slides",
  });
  const onSubmit: SubmitHandler<storyType> = (data) => {
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
        const state = useStoryStore.getState();
        if (result.data.status === "successfull") {
          state.setStory(result.data.storyId);
          state.setExpiresAt(result.data.expiresAt);
          state.setIsUploaded(true);
        }
        setStory(true);
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
  const slides = useWatch({
    control,
    name: "slides",
    defaultValue: [],
  });
  const isDisabled = slides.length === 0 || slides.some((slide) => {
  if (slide.type === "image") return !slide.imageFile;
  if (slide.type === "video") return !slide.videoFile;
  if (slide.type === "imageAudio") return !slide.imageFile || !slide.audioFile;
});
  const imageSlide = slides.filter((slide) => slide.type === "image").length;
  const videoSlide = slides.filter((slide) => slide.type === "video").length;
  const combinedSlide = slides.filter(
    (slide) => slide.type === "imageAudio",
  ).length;
  const isImageSlideAvail = imageSlide < ALLOWED_STORY_MEDIA.IMAGES;
  const isVideoSlideAvail = videoSlide < ALLOWED_STORY_MEDIA.VIDEO;
  const isCombinedSlideAvail = combinedSlide < ALLOWED_STORY_MEDIA.COMBINED;
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-2xl w-full">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            Story Creation
            <DialogDescription>
              {SLIDE_HEADER.map(({ key, label, icon: Icon, color }) => (
                <Badge
                  key={key}
                  variant={"outline"}
                  className={cn("text-xs font-normal", color)}
                >
                  {" "}
                  <Icon size={14} />
                  {label} : {imageSlide} /{" "}
                  {ALLOWED_STORY_MEDIA[key as keyof typeof ALLOWED_STORY_MEDIA]}
                </Badge>
              ))}
            </DialogDescription>
          </DialogHeader>
          <DialogTitle className="sr-only">Upload Story</DialogTitle>
          <div className="-mx-4 max-h-[50vh] overflow-y-auto px-4">
            <Carousel
              opts={{ align: "start" }}
              orientation="vertical"
              className="w-full max-w-3xl"
            >
              <CarouselContent className="-mt-1 h-100">
                {fields.length === 0 && (
                  <div className="flex gap-2 my-2.5 justify-center">
                    {isImageSlideAvail && (
                      <Button onClick={() => append({ type: "image" })}>
                        {" "}
                        <Plus /> Image{" "}
                      </Button>
                    )}
                    {isVideoSlideAvail && (
                      <Button onClick={() => append({ type: "video" })}>
                        {" "}
                        <Plus /> Video{" "}
                      </Button>
                    )}
                    {isCombinedSlideAvail && (
                      <Button onClick={() => append({ type: "imageAudio" })}>
                        {" "}
                        <Plus /> Image+Audio{" "}
                      </Button>
                    )}
                  </div>
                )}
                {fields.map((item, index) => {
                  // const isDisabled = item[item.length - 1]['imageFile'] === null 
                  const isImageSlide =
                    item.type === "image" || item.type === "imageAudio";
                  const isCombinedSlide = item.type === "imageAudio";
                  const isVideoSlide = item.type === "video";
                  const handleNext = async (type: SlideType) => {
                    slides[index].type = item.type;
                    const isSucess = await trigger(`slides.${index}`);
                    if (isSucess) append({ type });
                  };
                  return (
                    <CarouselItem key={index} className="basis-1/2 pt-1">
                      <div className="p-1">
                        <Card>
                          <CardHeader>
                            <CardTitle>{item.type}</CardTitle>
                            <CardDescription>
                              {SLIDES_DESCRIPTION[item.type]}
                            </CardDescription>
                            <CardAction>
                              <Button
                                variant={"destructive"}
                                onClick={() => remove(index)}
                              >
                                Delete
                              </Button>
                            </CardAction>
                          </CardHeader>
                          <CardContent>
                            <FieldGroup className="flex flex-row gap-3.5 w-full items-start">
                              {isImageSlide && (
                                <Controller
                                  control={control}
                                  name={`slides.${index}.imageFile`}
                                  render={({
                                    field: { onChange, value },
                                    fieldState,
                                  }) => {
                                    const imageUrl =
                                      value instanceof File
                                        ? URL.createObjectURL(value)
                                        : null;
                                    return (
                                      <Field
                                        data-invalid={fieldState.invalid}
                                        orientation="horizontal"
                                        //className="w-full"
                                      >
                                        {imageUrl ? (
                                          <div className="flex flex-col w-full gap-3 p-4 border rounded-lg border-border bg-card">
                                            <div className="flex items-center justify-between">
                                              <span className="text-sm font-medium text-muted-foreground">
                                                Image Preview
                                              </span>
                                              <label
                                                htmlFor={`${item.id}-image`}
                                                className="text-xs cursor-pointer text-primary hover:underline"
                                              >
                                                Change File
                                              </label>
                                            </div>
                                            <Image
                                              src={imageUrl}
                                              alt="Preview"
                                              className="object-cover w-full rounded-md h-36 bg-muted"
                                            />
                                          </div>
                                        ) : (
                                          <FieldLabel
                                            htmlFor={`${item.id}-image`}
                                            className="w-full cursor-pointer"
                                          >
                                            <div
                                              className={`flex flex-col items-center justify-center w-full h-32 gap-2 transition-colors border-2 border-dashed rounded-lg bg-muted/20 hover:bg-muted/50 ${
                                                fieldState.invalid
                                                  ? "border-destructive"
                                                  : "border-muted-foreground/25"
                                              }`}
                                            >
                                              <ImageIcon className="w-8 h-8 text-muted-foreground" />
                                              <span className="text-sm font-medium">
                                                Click to upload image
                                              </span>
                                              <span className="text-xs text-muted-foreground">
                                                PNG, JPG, WEBP
                                              </span>
                                            </div>
                                          </FieldLabel>
                                        )}
                                        <Input
                                          id={`${item.id}-image`}
                                          {...value}
                                          disabled={fields.length - 1 !== index}
                                          type="file"
                                          accept="image/*"
                                          className="hidden"
                                          onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) onChange(file);
                                          }}
                                        />
                                        {fieldState.invalid && (
                                          <FieldError
                                            errors={[fieldState.error]}
                                          />
                                        )}
                                      </Field>
                                    );
                                  }}
                                />
                              )}

                              {isVideoSlide && (
                                <Controller
                                  control={control}
                                  name={`slides.${index}.videoFile`}
                                  render={({
                                    field: { onChange, value },
                                    fieldState,
                                  }) => {
                                    const videoUrl =
                                      value instanceof File
                                        ? URL.createObjectURL(value)
                                        : null;
                                    return (
                                      <Field
                                        data-invalid={fieldState.invalid}
                                        orientation="horizontal"
                                        //className="w-full"
                                      >
                                        {videoUrl ? (
                                          <div className="flex flex-col w-full gap-3 p-4 border rounded-lg border-border bg-card">
                                            <div className="flex items-center justify-between">
                                              <span className="text-sm font-medium text-muted-foreground">
                                                Video Preview
                                              </span>
                                              <label
                                                htmlFor={`${item.id}-video`}
                                                className="text-xs cursor-pointer text-primary hover:underline"
                                              >
                                                Change File
                                              </label>
                                            </div>
                                            <video
                                              controls
                                              src={videoUrl}
                                              className="object-cover w-full rounded-md h-36 bg-muted"
                                            />
                                          </div>
                                        ) : (
                                          <FieldLabel
                                            htmlFor={`${item.id}-video`}
                                            className="w-full cursor-pointer"
                                          >
                                            <div
                                              className={`flex flex-col items-center justify-center w-full h-32 gap-2 transition-colors border-2 border-dashed rounded-lg bg-muted/20 hover:bg-muted/50 ${
                                                fieldState.invalid
                                                  ? "border-destructive"
                                                  : "border-muted-foreground/25"
                                              }`}
                                            >
                                              <Upload className="w-8 h-8 text-muted-foreground" />
                                              <span className="text-sm font-medium">
                                                Click to upload video
                                              </span>
                                              <span className="text-xs text-muted-foreground">
                                                Max 100MB (MP4, MOV)
                                              </span>
                                            </div>
                                          </FieldLabel>
                                        )}
                                        <Input
                                          id={`${item.id}-video`}
                                          disabled={fields.length - 1 !== index}
                                          type="file"
                                          {...value}
                                          accept="video/*"
                                          className="hidden"
                                          onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) onChange(file);
                                          }}
                                        />
                                        {fieldState.invalid && (
                                          <FieldError
                                            errors={[fieldState.error]}
                                          />
                                        )}
                                      </Field>
                                    );
                                  }}
                                />
                              )}
                              {isCombinedSlide && (
                                <Controller
                                  control={control}
                                  name={`slides.${index}.audioFile`}
                                  render={({
                                    field: { onChange, value },
                                    fieldState,
                                  }) => {
                                    const audioUrl =
                                      value instanceof File
                                        ? URL.createObjectURL(value)
                                        : null;

                                    return (
                                      <Field
                                        data-invalid={fieldState.invalid}
                                        orientation={"horizontal"}
                                        //className="w-full"
                                      >
                                        {audioUrl ? (
                                          <div className="flex flex-col w-full gap-3 p-4 border rounded-lg border-border bg-card">
                                            <div className="flex items-center justify-between">
                                              <span className="text-sm font-medium text-muted-foreground">
                                                Audio Preview
                                              </span>
                                              <label
                                                htmlFor={`${item.id}-audio`}
                                                className="text-xs cursor-pointer text-primary hover:underline"
                                              >
                                                Change File
                                              </label>
                                            </div>

                                            <audio
                                              controls
                                              src={audioUrl}
                                              className="w-full h-10 rounded-md outline-none bg-muted"
                                            />
                                          </div>
                                        ) : (
                                          <FieldLabel
                                            htmlFor={`${item.id}-audio`}
                                            className="w-full cursor-pointer"
                                          >
                                            <div
                                              className={`flex flex-col items-center justify-center w-full h-32 gap-2 transition-colors border-2 border-dashed rounded-lg bg-muted/20 hover:bg-muted/50 ${
                                                fieldState.invalid
                                                  ? "border-destructive"
                                                  : "border-muted-foreground/25"
                                              }`}
                                            >
                                              <Upload className="w-8 h-8 text-muted-foreground" />
                                              <span className="text-sm font-medium">
                                                Click to upload audio
                                              </span>
                                              <span className="text-xs text-muted-foreground">
                                                Max 20MB (MP3, WAV)
                                              </span>
                                            </div>
                                            {fieldState.invalid && (
                                              <FieldError
                                                errors={[fieldState.error]}
                                              />
                                            )}
                                          </FieldLabel>
                                        )}

                                        <Input
                                          id={`${item.id}-audio`}
                                          disabled={fields.length - 1 !== index}
                                          type="file"
                                          accept="audio/*"
                                          className="hidden"
                                          onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                              onChange(file);
                                            }
                                          }}
                                        />
                                      </Field>
                                    );
                                  }}
                                />
                              )}

                              <Controller
                                control={control}
                                name={`slides.${index}.caption`}
                                render={({ field, fieldState }) => (
                                  <Field
                                    data-invalid={fieldState.invalid}
                                    orientation="horizontal"
                                    className="w-full"
                                  >
                                    <FieldContent>
                                      <FieldLabel
                                        htmlFor={`item.${index}.caption`}
                                      >Enter Caption(Optional)</FieldLabel>
                                      <Textarea
                                        {...field}
                                        id={`item.${index}.caption`}
                                        rows={2}
                                      ></Textarea>
                                      {fieldState.invalid && (
                                        <FieldError
                                          errors={[fieldState.error]}
                                        />
                                      )}
                                    </FieldContent>
                                  </Field>
                                )}
                              />

                              {/* Later => <Field orientation="horizontal" className="w-fit">
                              <FieldLabel htmlFor="ai">
                                AI brief description
                              </FieldLabel>
                              <Switch id="ai" />
                            </Field> */}
                            </FieldGroup>
                          </CardContent>
                          <CardFooter className="flex justify-center gap-3">
                            {index === fields.length - 1 &&
                              isImageSlideAvail && (
                                <Button
                                  variant={"outline"}
                                  disabled={isDisabled}
                                  onClick={() => handleNext("image")}
                                >
                                  <Plus /> Image
                                </Button>
                              )}
                            {index === fields.length - 1 &&
                              isVideoSlideAvail && (
                                <Button
                                disabled={isDisabled}
                                  variant={"outline"}
                                  onClick={() => handleNext("video")}
                                >
                                  <Plus /> Video
                                </Button>
                              )}
                            {index === fields.length - 1 &&
                              isCombinedSlideAvail && (
                                <Button
                                  variant={"outline"}
                                  disabled={isDisabled}
                                  onClick={() => handleNext("imageAudio")}
                                >
                                  <Plus /> Image+Audio
                                </Button>
                              )}
                          </CardFooter>
                        </Card>
                      </div>
                    </CarouselItem>
                  );
                })}
                {/* </FieldGroup> */}
              </CarouselContent>
            </Carousel>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isDisabled}>Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
