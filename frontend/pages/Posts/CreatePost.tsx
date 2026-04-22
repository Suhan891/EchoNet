"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { ALLOWED_POSTS } from "@/utils/constants";
import {
  createPostSchema,
  createPostType,
} from "@/validations/posts/create.post";
import { zodResolver } from "@hookform/resolvers/zod";
import { ImageIcon, Upload } from "lucide-react";
import Image from "next/image";
import {
  SubmitHandler,
  useFieldArray,
  useForm,
  useWatch,
} from "react-hook-form";

export default function CreatePost({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<createPostType>({
    resolver: zodResolver(createPostSchema),
    mode: "onSubmit",
    defaultValues: {
      caption: "",
      images: [{ file: undefined as unknown as File }],
    },
  });
  const { remove, append, fields } = useFieldArray({
    control,
    name: "images",
  });
  const formData = useWatch({
    control,
    defaultValue: {
      images: [{ file: undefined as unknown as File }],
    },
  });
  const onSubmit: SubmitHandler<createPostType> = (data) => {
    console.log(data);
  };

  const handleNewSlide = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (
      index === fields.length - 1 &&
      formData.images &&
      formData.images?.length < ALLOWED_POSTS
    ) {
      append({ file: undefined as unknown as File });
    }
  };

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Create Post</DialogTitle>
            <DialogDescription>
              <Badge variant={"outline"} className={cn("text-xs font-normal")}>
                {" "}
                <ImageIcon size={14} />
                Image : {formData.images ? formData.images.length : "0"} /{" "}
                {ALLOWED_POSTS}
              </Badge>
            </DialogDescription>
          </DialogHeader>
          <Card className={cn("p-2", errors.form && "border-red-600")}>
            <CardContent>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="caption">
                    Give a unique captcha
                  </FieldLabel>
                  <Input
                    id="caption"
                    {...register("caption")}
                    type="text"
                    aria-invalid={!!errors.caption}
                  />
                  {errors.caption ? (
                    <FieldError errors={[errors.caption]} />
                  ) : (
                    <FieldDescription>
                      This is a required field
                    </FieldDescription>
                  )}
                </Field>
                <Field>
                  <FieldLabel htmlFor="description">
                    Give description
                  </FieldLabel>
                  <Textarea
                    id="description"
                    {...register("description")}
                    aria-invalid={!!errors.description}
                  />
                  {errors.description ? (
                    <FieldError errors={[errors.description]} />
                  ) : (
                    <FieldDescription>
                      This is an optional field
                    </FieldDescription>
                  )}
                </Field>
                <Field orientation={"responsive"}>
                  <FieldContent>
                    <Carousel className="w-full max-w-48 sm:max-w-xs md:max-w-sm">
                      <CarouselContent className="-ml-1">
                        {fields.map((field, index) => (
                          <CarouselItem
                            key={field.id}
                            className="basis-1/2 pl-1 lg:basis-1/3"
                          >
                            <div className="p-1">
                              {formData?.images?.[index]?.file ? (
                                <Card className="relative mx-auto w-full max-w-sm pt-0">
                                  <div className="absolute inset-0 z-30 aspect-video bg-black/35" />
                                  <Image
                                    src="https://avatar.vercel.sh/shadcn1"
                                    alt="Event cover"
                                    fill={true}
                                    className="relative z-20 aspect-video w-full object-cover brightness-60 grayscale dark:brightness-40"
                                  />
                                  <CardFooter>
                                    <Button
                                      variant={"destructive"}
                                      className="w-full"
                                      type="button"
                                      onClick={() => remove(index)}
                                    >
                                      Delete
                                    </Button>
                                  </CardFooter>
                                </Card>
                              ) : (
                                <Card>
                                  <CardContent className="flex aspect-square items-center justify-center p-6">
                                    <Card className="relative mx-auto w-full max-w-sm pt-0">
                                      <div className="absolute inset-0 z-30 aspect-video bg-black/35 border-dashed">
                                        <FieldLabel htmlFor={`field.${index}`}>
                                          <Upload className="z-20" />
                                        </FieldLabel>
                                        {(() => {
                                          const {
                                            onChange: formOnChange,
                                            ...rest
                                          } = register(`images.${index}.file`);
                                          return (
                                            <Input
                                              type="file"
                                              id={`field.${index}`}
                                              {...rest}
                                              onChange={(e) => {
                                                formOnChange(e);
                                                handleNewSlide(e, index);
                                              }}
                                              className="hidden"
                                            />
                                          );
                                        })()}
                                      </div>
                                    </Card>
                                  </CardContent>
                                </Card>
                              )}
                            </div>
                          </CarouselItem>
                        ))}
                      </CarouselContent>
                      <CarouselPrevious />
                      <CarouselNext />
                    </Carousel>
                  </FieldContent>
                </Field>
              </FieldGroup>
            </CardContent>
            {errors.images && (
              <CardFooter className="text-amber-800">
                File error: {errors.images[0]?.message}
              </CardFooter>
            )}
          </Card>
          <DialogFooter>
            <Button variant={"outline"} type={"button"} onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant={"secondary"}>
              Submit
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
