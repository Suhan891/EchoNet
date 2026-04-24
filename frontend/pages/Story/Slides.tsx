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
import {
  Field,
  FieldContent,
  FieldLabel,
} from "@/components/ui/field";
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
} from "react-hook-form";
import PreviewMedia from "./PreviewMedia";
import UploadMedia from "./UploadMedia";
import { ButtonGroup } from "@/components/ui/button-group";
import { ArrowBigDown, ArrowBigUp } from "lucide-react";

interface SlideProps {
  item: FieldArrayWithId<
    {
      slides: {
        type: "image" | "video" | "imageAudio";
        caption?: string;
        imageFile?: File;
        videoFile?: File;
        audioFile?: File;
      }[];
    },
    "slides",
    "id"
  >;
  index: number;
  control: Control<{
    slides: {
      type: "image" | "video" | "imageAudio";
      caption?: string;
      imageFile?: File;
      videoFile?: File;
      audioFile?: File;
    }[];
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
  return (
    <Card className="w-full mb-4 shrink-0">
      <CardHeader>
        <CardTitle>Add {isAudioField ? "Combined" : isVideoField ? "Video" : "Image"} Status (order:{index + 1})</CardTitle>
        <CardDescription>Image is a required field</CardDescription>
        <CardAction>
          <Button variant={"destructive"} onClick={onRemove}>
            Delete
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <Field orientation={"horizontal"} className="flex justify-around items-center">
          {isImageField && (
            <Controller
              control={control}
              name={`slides.${index}.imageFile`}
              render={({ field: { onChange, value }, fieldState }) => {
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
                        {value instanceof File ? (
                          <PreviewMedia imageFile={value} />
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
                          if (file) onChange(file);
                        }}
                      />
                    </FieldContent>
                  </Field>
                );
              }}
            />
          )}
          {isVideoField && (
            <Controller
              control={control}
              name={`slides.${index}.videoFile`}
              render={({ field: { value, onChange }, fieldState }) => {
                return (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldContent>
                      <FieldLabel className="mb-2 pl-1">
                        Video(required)
                      </FieldLabel>
                      <FieldLabel htmlFor={`video-${item.id}`}>
                        {value instanceof File ? (
                          <PreviewMedia videoFile={value} />
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
                          if (file) onChange(file);
                        }}
                      />
                    </FieldContent>
                  </Field>
                );
              }}
            />
          )}
          {isAudioField && (
            <Controller
              control={control}
              name={`slides.${index}.audioFile`}
              render={({ field: { value, onChange }, fieldState }) => {
                return (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldContent>
                      <FieldLabel className="mb-2 pl-1">
                        Audio(required)
                      </FieldLabel>
                      <FieldLabel htmlFor={`audio-${item.id}`}>
                        {value instanceof File ? (
                          <PreviewMedia audioFile={value} />
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
                          if (file) onChange(file);
                        }}
                      />
                    </FieldContent>
                  </Field>
                );
              }}
            />
          )}
          <Controller
            control={control}
            name={`slides.${index}.caption`}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className="">
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

      {/* <CardFooter>This will be only shown if any error</CardFooter> */}
      <CardFooter>
        <ButtonGroup>
          {!isFirst && (
            <Button
              variant="outline"
              size="icon-lg"
              onClick={() => move(index, index - 1)}
            >
              <ArrowBigUp />
            </Button>
          )}
          {!isLast && (
            <Button
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
