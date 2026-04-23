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
import { InputGroup, InputGroupAddon, InputGroupText, InputGroupTextarea } from "@/components/ui/input-group";
import { Control, Controller, FieldArrayWithId } from "react-hook-form";

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
}
export default function Slide({
  item,
  index,
  control,
  isImageSlide,
  isVideoSlide,
  isCombinedSlide,
}: SlideProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Image Status</CardTitle>
        <CardDescription>Image is a required field</CardDescription>
        <CardAction>
          <Button variant={"destructive"}>Delete</Button>
        </CardAction>
        <CardContent>
          <FieldGroup>
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
                          {/* Calling a component which shall => Either preview if imgUrl present => upload or preview */}
                        </FieldLabel>
                        <Input
                          {...value}
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
            <Field>
                <FieldLabel htmlFor={`description-${item.id}`}>Description (optional) </FieldLabel>
                <InputGroup>
                    <InputGroupTextarea
                    id={`description-${item.id}`}
                    placeholder="Write a short decription" />
                    <InputGroupAddon align="block-end">
                        <InputGroupText>{0}/{120}</InputGroupText>
                    </InputGroupAddon>
                </InputGroup>
            </Field>
          </FieldGroup>
        </CardContent>

        {/* <CardFooter>This will be only shown if any error</CardFooter> */}
      </CardHeader>
    </Card>
  );
}
