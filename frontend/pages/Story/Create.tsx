import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
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
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import Slide from "./Slides";

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
  const { fields } = useFieldArray({
    control,
    name: "slides",
  });
  const onSubmit = (data) => {};
  const watchSlides = useWatch({
    control,
  });
  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogContent showCloseButton={false}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Create Story</DialogTitle>
            <DialogDescription>
              Story shall expire after 24 hrs of upload
            </DialogDescription>
          </DialogHeader>
          <ScrollArea>
            <Card>
              <CardHeader>
                <Badge>Image</Badge>
                <Badge>Video</Badge>
                <Badge>Img+Aud</Badge>
              </CardHeader>
              <CardContent>
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
