"use client";

import { useCallback, useId } from "react";
import {
  Controller,
  SubmitHandler,
  useFieldArray,
  useForm,
  useWatch,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ImageIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  createPostSchema,
  createPostType,
} from "@/validations/posts/create.post";
import { MAX_ALLOWED_POSTS } from "@/utils/constants";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import ImagePreview from "./ImagePreview";

// ---------------------------------------------------------------------------
// Primitives
// ---------------------------------------------------------------------------

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1 text-xs text-destructive">{message}</p>;
}

function FieldHint({ children }: { children: React.ReactNode }) {
  return <p className="mt-1 text-xs text-muted-foreground">{children}</p>;
}
// ---------------------------------------------------------------------------
// CreatePost — owns all form state, renders the grid
// ---------------------------------------------------------------------------

interface CreatePostProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function CreatePost({ open, setOpen }: CreatePostProps) {
  // Stable unique id for the append tile — not in useFieldArray, so no field.id.
  // useId() is SSR-safe and unique even if CreatePost mounts multiple times.
  const appendTileId = useId();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<createPostType>({
    resolver: zodResolver(createPostSchema),
    mode: "onSubmit",
    defaultValues: {
      caption: "",
      description: "",
      images: [], // empty array — no phantom entries, Zod .min(1) works correctly
    },
  });

  const { append, remove, fields } = useFieldArray({
    control,
    name: "images",
  });

  // Scoped watch — only re-renders badge, not the whole dialog
  const watchedImages = useWatch({ control, name: "images" });
  const imageCount = watchedImages?.length ?? 0;
  const canAddMore = imageCount < MAX_ALLOWED_POSTS;

  const onSubmit: SubmitHandler<createPostType> = (data) => {
    const formData = new FormData();
    formData.append("caption", data.caption);
    if (data.description) formData.append("description", data.description);
    data.images.forEach((image) => {
      formData.append("image", image.file);
    });
    console.log("Data: ", data);
    console.log("Form data: ", formData);
  };

  const handleClose = useCallback(() => setOpen(false), [setOpen]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className={cn(
          "flex max-h-[90dvh] w-full flex-col overflow-hidden p-0",
          "sm:max-w-xl",
        )}
      >
        {/* ── Header ───────────────────────────────────────────────────── */}
        <DialogHeader className="shrink-0 border-b px-6 py-4">
          <DialogTitle className="text-base font-semibold">
            Create Post
          </DialogTitle>
          <DialogDescription asChild>
            <div className="flex items-center gap-2 pt-0.5">
              <Badge variant="outline" className="gap-1.5 text-xs font-normal">
                <ImageIcon size={11} />
                {imageCount} / {MAX_ALLOWED_POSTS} images
              </Badge>
            </div>
          </DialogDescription>
        </DialogHeader>

        {/* ── Scrollable body ───────────────────────────────────────────── */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="flex flex-1 flex-col overflow-hidden"
        >
          <div className="flex-1 min-h-0 w-full overflow-y-auto custom-scrollbar">
            <div className="space-y-5 px-6 py-5">
              {/* Caption */}
            <div className="space-y-1.5">
              <Label htmlFor="caption">Caption</Label>
              <Input
                id="caption"
                {...register("caption")}
                type="text"
                placeholder="Write a short, memorable caption…"
                aria-invalid={!!errors.caption}
                className={cn(
                  errors.caption &&
                    "border-destructive focus-visible:ring-destructive",
                )}
              />
              {errors.caption ? (
                <FieldError message={errors.caption.message} />
              ) : (
                <FieldHint>Required · min 3 characters</FieldHint>
              )}
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <Label htmlFor="description">
                Description{" "}
                <span className="text-xs font-normal text-muted-foreground">
                  (optional)
                </span>
              </Label>
              <Textarea
                id="description"
                {...register("description")}
                placeholder="Add more context about your post…"
                rows={3}
                aria-invalid={!!errors.description}
                className={cn(
                  "resize-none",
                  errors.description &&
                    "border-destructive focus-visible:ring-destructive",
                )}
              />
              {errors.description ? (
                <FieldError message={errors.description.message} />
              ) : (
                <FieldHint>Min 10 characters if provided</FieldHint>
              )}
            </div>
            
              {/* Image grid */}
              <div className="space-y-2">
                <Label>
                  Images{" "}
                  <span className="text-xs font-normal text-muted-foreground">
                    (up to {MAX_ALLOWED_POSTS})
                  </span>
                </Label>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {/* Existing entries — each has a stable field.id from RHF */}
                  {fields.map((field, index) => (
                    <Controller
                      key={field.id}
                      control={control}
                      name={`images.${index}.file`}
                      render={({ field: { value, onChange }, fieldState }) => (
                        <ImagePreview
                          inputId={field.id} // ← RHF-generated UUID, always unique
                          value={value as File | undefined}
                          onChange={onChange}
                          onRemove={() => remove(index)}
                          isInvalid={fieldState.invalid}
                          errorMessage={fieldState.error?.message}
                        />
                      )}
                    />
                  ))}
                  {canAddMore && (
                    <ImagePreview
                      inputId={appendTileId}
                      value={undefined}
                      onChange={(file) => append({ file })}
                      onRemove={() => {}}
                      isInvalid={false}
                      accent="primary"
                    />
                  )}
                </div>
              </div>

              {/* Array-level errors — .min/.max live on errors.images.root in RHF v7+ */}
              {errors.images?.root?.message && (
                <FieldError message={errors.images.root.message} />
              )}
            
            </div>
          </div>

          {/* ── Footer ───────────────────────────────────────────────────── */}
          <DialogFooter className="shrink-0 border-t px-6 py-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Posting…" : "Post"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
