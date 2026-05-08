"use client";
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
import { Field, FieldContent, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import {
  Control,
  Controller,
  FieldArrayWithId,
  UseFieldArrayMove,
  useWatch,
} from "react-hook-form";
import PreviewMedia from "./PreviewMedia";
import UploadMedia from "./UploadMedia";
import { ButtonGroup } from "@/components/ui/button-group";
import { ArrowBigDown, ArrowBigUp } from "lucide-react";
import { useEffect, useReducer } from "react";

interface Slides {
  type: "image" | "video" | "imageAudio";
  caption?: string;
  imageFile?: File;
  videoFile?: File;
  audioFile?: File;
}
interface SlideProps {
  item: FieldArrayWithId<
    {
      slides: Slides[];
    },
    "slides",
    "id"
  >;
  index: number;
  control: Control<{
    slides: Slides[];
  }>;
  move: UseFieldArrayMove;
  isLast: boolean;
  isFirst: boolean;
  isImageField: boolean;
  isAudioField: boolean;
  isVideoField: boolean;
  onRemove: () => void;
}

export default function Slide({
  item,
  index,
  control,
  isImageField,
  isVideoField,
  isAudioField,
  move,
  isLast,
  isFirst,
  onRemove,
}: SlideProps) {
  const imageFile = useWatch({ control, name: `slides.${index}.imageFile` });
  const videoFile = useWatch({ control, name: `slides.${index}.videoFile` });
  const audioFile = useWatch({ control, name: `slides.${index}.audioFile` });

  const [imagePreviewUrl, dispatchImage] = useReducer(
    (_: string | null, action: string | null) => action,
    null,
  );

  useEffect(() => {
    if (!imageFile) {
      dispatchImage(null);
      return;
    }
    const url = URL.createObjectURL(imageFile);
    dispatchImage(url);
    return () => URL.revokeObjectURL(url);
  }, [imageFile]);

  const [videoPreviewUrl, dispatchVideo] = useReducer(
    (_: string | null, action: string | null) => action,
    null,
  );

  useEffect(() => {
    if (!videoFile) {
      dispatchVideo(null);
      return;
    }
    const url = URL.createObjectURL(videoFile);
    dispatchVideo(url);
    return () => URL.revokeObjectURL(url);
  }, [videoFile]);

  const [audioPreviewUrl, dispatchAudio] = useReducer(
    (_: string | null, action: string | null) => action,
    null,
  );

  useEffect(() => {
    if (!audioFile) {
      dispatchAudio(null);
      return;
    }
    const url = URL.createObjectURL(audioFile);
    dispatchAudio(url);
    return () => URL.revokeObjectURL(url);
  }, [audioFile]);
  return (
    <Card className="w-full mb-4 shrink-0">
      <CardHeader>
        <CardTitle>
          Add {isAudioField ? "Combined" : isVideoField ? "Video" : "Image"}{" "}
          Status (order:{index + 1})
        </CardTitle>
        <CardDescription>Image is a required field</CardDescription>
        <CardAction>
          <Button variant={"destructive"} onClick={onRemove}>
            Delete
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <Field
          orientation={"horizontal"}
          className="flex justify-around items-center"
        >
          {isImageField && (
            <Controller
              control={control}
              name={`slides.${index}.imageFile`}
              render={({ field: { onChange }, fieldState }) => {
                return (
                  <Field
                    data-invalid={fieldState.invalid}
                    orientation={"horizontal"}
                  >
                    <FieldContent>
                      <FieldLabel className="mb-2 pl-1">
                        Image(required)
                      </FieldLabel>
                      <FieldLabel htmlFor={`image-${item.id}`}>
                        {imagePreviewUrl ? (
                          <PreviewMedia imageUrl={imagePreviewUrl} />
                        ) : (
                          <UploadMedia isImage={true} />
                        )}
                      </FieldLabel>
                      <Input
                        id={`image-${item.id}`}
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/jpg"
                        className="sr-only"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file && file instanceof File) onChange(file);
                        }}
                      />
                    </FieldContent>
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                );
              }}
            />
          )}
          {isVideoField && (
            <Controller
              control={control}
              name={`slides.${index}.videoFile`}
              render={({ field: { onChange }, fieldState }) => {
                return (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldContent>
                      <FieldLabel className="mb-2 pl-1">
                        Video(required)
                      </FieldLabel>
                      <FieldLabel htmlFor={`video-${item.id}`}>
                        {videoPreviewUrl ? (
                          <PreviewMedia videoUrl={videoPreviewUrl} />
                        ) : (
                          <UploadMedia isVideo={true} />
                        )}
                      </FieldLabel>
                      <Input
                        id={`video-${item.id}`}
                        type="file"
                        accept="video/mp4,video/webm,video/quicktime"
                        className="sr-only"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file && file instanceof File) onChange(file);
                        }}
                      />
                    </FieldContent>
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                );
              }}
            />
          )}
          {isAudioField && (
            <Controller
              control={control}
              name={`slides.${index}.audioFile`}
              render={({ field: { onChange }, fieldState }) => {
                return (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldContent>
                      <FieldLabel className="mb-2 pl-1">
                        Audio(required)
                      </FieldLabel>
                      <FieldLabel htmlFor={`audio-${item.id}`}>
                        {audioPreviewUrl ? (
                          <PreviewMedia audioUrl={audioPreviewUrl} />
                        ) : (
                          <UploadMedia isAudio={true} />
                        )}
                      </FieldLabel>
                      <Input
                        id={`audio-${item.id}`}
                        type="file"
                        accept="audio/mpeg,audio/wav,audio/ogg"
                        className="sr-only"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file && file instanceof File) onChange(file);
                        }}
                      />
                    </FieldContent>
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                );
              }}
            />
          )}
          <Controller
            control={control}
            name={`slides.${index}.caption`}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={`description-${item.id}`}>
                  Description (optional){" "}
                </FieldLabel>
                <InputGroup>
                  <InputGroupTextarea
                    id={`description-${item.id}`}
                    {...field}
                    cols={9}
                    rows={3}
                    maxLength={120}
                    placeholder="Write a short decription"
                  />
                  <InputGroupAddon align="block-end">
                    <InputGroupText>
                      {field.value?.length ?? 0}/{120}
                    </InputGroupText>
                  </InputGroupAddon>
                </InputGroup>
              </Field>
            )}
          />
        </Field>
      </CardContent>

      <CardFooter>
        <ButtonGroup>
          {!isFirst && (
            <Button
              type="button"
              variant="outline"
              size="icon-lg"
              onClick={() => move(index, index - 1)}
            >
              <ArrowBigUp />
            </Button>
          )}
          {!isLast && (
            <Button
              type="button"
              variant="outline"
              size="icon-lg"
              onClick={() => move(index, index + 1)}
            >
              <ArrowBigDown />
            </Button>
          )}
        </ButtonGroup>
      </CardFooter>
    </Card>
  );
}
