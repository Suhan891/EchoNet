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
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import { Control, Controller, FieldArrayWithId } from "react-hook-form";
import PreviewMedia from "./PreviewMedia";
import UploadMedia from "./UploadMedia";

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
  isImageSlide: boolean;
  isCombinedSlide: boolean;
  isVideoSlide: boolean;
  onRemove: () => void;
}
export default function Slide({
  item,
  index,
  control,
  isImageSlide,
  isVideoSlide,
  isCombinedSlide,
  onRemove,
}: SlideProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Image Status</CardTitle>
        <CardDescription>Image is a required field</CardDescription>
        <CardAction>
          <Button variant={"destructive"} onClick={onRemove}>
            Delete
          </Button>
        </CardAction>
        <CardContent>
          <FieldGroup className="flex">
            {isImageSlide && (
              <Controller
                control={control}
                name={`slides.${index}.imageFile`}
                render={({ field: { onChange, value }, fieldState }) => {
                  const imageUrl =
                    value instanceof File
                      ? URL.createObjectURL(value)
                      : undefined;
                  return (
                    <Field
                      data-invalid={fieldState.invalid}
                      orientation={"horizontal"}
                    >
                      <FieldContent>
                        <FieldLabel htmlFor={`image-${item.id}`}>
                          {imageUrl ? (
                            <PreviewMedia imageUrl={imageUrl} />
                          ) : (
                            <UploadMedia isImage={true} />
                          )}
                        </FieldLabel>
                        <Input
                          //{...value}
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
            <Controller
              control={control}
              name={`slides.${index}.caption`}
              render={({ field, fieldState }) => (
                <Field
                  data-invalid={fieldState.invalid}
                 // orientation={"horizontal"}
                >
                  <FieldLabel htmlFor={`description-${item.id}`}>
                    Description (optional){" "}
                  </FieldLabel>
                  <InputGroup>
                    <InputGroupTextarea
                      id={`description-${item.id}`}
                      {...field}
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
          </FieldGroup>
        </CardContent>

        {/* <CardFooter>This will be only shown if any error</CardFooter> */}
      </CardHeader>
    </Card>
  );
}
