"use client";

import { useState, useRef, useCallback } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  FormField,
  FormItem,
  FormMessage,
  FormControl,
} from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// ─── Constants ───────────────────────────────────────────────────────────────

const MAX_PER_TYPE = {
  image: 3,
  video: 2,
  imageAudio: 2,
} as const;

const MAX_FILE_SIZES = {
  image: 10 * 1024 * 1024,       // 10 MB
  video: 100 * 1024 * 1024,      // 100 MB
  audio: 20 * 1024 * 1024,       // 20 MB
};

const ALLOWED_MIME = {
  image: ["image/jpeg", "image/png", "image/webp", "image/gif"],
  video: ["video/mp4", "video/webm", "video/quicktime"],
  audio: ["audio/mpeg", "audio/wav", "audio/ogg", "audio/mp4"],
};

// ─── Types ───────────────────────────────────────────────────────────────────

type StoryType = "image" | "video" | "imageAudio";

interface TypeCounts {
  image: number;
  video: number;
  imageAudio: number;
}

// ─── Zod Schemas ─────────────────────────────────────────────────────────────

/** Returns a slide schema that's aware of current type counts */
function createSlideSchema(typeCounts: TypeCounts, slideIndex: number) {
  const fileSchema = (
    allowedMimes: string[],
    maxSize: number,
    label: string
  ) =>
    z
      .instanceof(File, { message: `Please upload a ${label} file` })
      .refine((f) => allowedMimes.includes(f.type), {
        message: `Invalid ${label} type. Allowed: ${allowedMimes.map((m) => m.split("/")[1]).join(", ")}`,
      })
      .refine((f) => f.size <= maxSize, {
        message: `${label} must be under ${maxSize / (1024 * 1024)} MB`,
      });

  return z
    .object({
      storyType: z.enum(["image", "video", "imageAudio"], {
        required_error: "Select a story type",
      }),
      caption: z
        .string()
        .max(150, "Caption max 150 characters")
        .optional()
        .or(z.literal("")),

      // Conditional fields — validated together in superRefine
      imageFile: z.instanceof(File).optional().nullable(),
      videoFile: z.instanceof(File).optional().nullable(),
      audioFile: z.instanceof(File).optional().nullable(),
    })
    .superRefine((data, ctx) => {
      const { storyType } = data;

      // ── image ──────────────────────────────────────────────
      if (storyType === "image") {
        if (typeCounts.image >= MAX_PER_TYPE.image) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Max ${MAX_PER_TYPE.image} image stories reached`,
            path: ["storyType"],
          });
          return;
        }
        const result = fileSchema(
          ALLOWED_MIME.image,
          MAX_FILE_SIZES.image,
          "image"
        ).safeParse(data.imageFile);
        if (!result.success) {
          result.error.issues.forEach((i) =>
            ctx.addIssue({ ...i, path: ["imageFile"] })
          );
        }
      }

      // ── video ──────────────────────────────────────────────
      if (storyType === "video") {
        if (typeCounts.video >= MAX_PER_TYPE.video) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Max ${MAX_PER_TYPE.video} video stories reached`,
            path: ["storyType"],
          });
          return;
        }
        const result = fileSchema(
          ALLOWED_MIME.video,
          MAX_FILE_SIZES.video,
          "video"
        ).safeParse(data.videoFile);
        if (!result.success) {
          result.error.issues.forEach((i) =>
            ctx.addIssue({ ...i, path: ["videoFile"] })
          );
        }
      }

      // ── imageAudio ─────────────────────────────────────────
      if (storyType === "imageAudio") {
        if (typeCounts.imageAudio >= MAX_PER_TYPE.imageAudio) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Max ${MAX_PER_TYPE.imageAudio} image+audio stories reached`,
            path: ["storyType"],
          });
          return;
        }
        const imgResult = fileSchema(
          ALLOWED_MIME.image,
          MAX_FILE_SIZES.image,
          "image"
        ).safeParse(data.imageFile);
        if (!imgResult.success) {
          imgResult.error.issues.forEach((i) =>
            ctx.addIssue({ ...i, path: ["imageFile"] })
          );
        }
        const audResult = fileSchema(
          ALLOWED_MIME.audio,
          MAX_FILE_SIZES.audio,
          "audio"
        ).safeParse(data.audioFile);
        if (!audResult.success) {
          audResult.error.issues.forEach((i) =>
            ctx.addIssue({ ...i, path: ["audioFile"] })
          );
        }
      }
    });
}

type SlideData = z.infer<ReturnType<typeof createSlideSchema>>;

// ─── Default slide data ───────────────────────────────────────────────────────

const defaultSlide = (): SlideData => ({
  storyType: undefined as any,
  caption: "",
  imageFile: null,
  videoFile: null,
  audioFile: null,
});

// ─── FileSizeBar helper ──────────────────────────────────────────────────────

function FileSizeBar({ file, max }: { file: File; max: number }) {
  const pct = Math.min((file.size / max) * 100, 100);
  const isWarning = pct > 80;
  const label =
    file.size < 1024 * 1024
      ? `${(file.size / 1024).toFixed(1)} KB`
      : `${(file.size / (1024 * 1024)).toFixed(2)} MB`;

  return (
    <div className="mt-1 space-y-0.5">
      <div className="flex justify-between text-xs text-muted-foreground">
        <span className="truncate max-w-[60%]">{file.name}</span>
        <span className={isWarning ? "text-amber-500" : ""}>{label}</span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
        <div
          className={cn(
            "h-full rounded-full transition-all",
            isWarning ? "bg-amber-500" : "bg-primary"
          )}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

// ─── FileUploadField ──────────────────────────────────────────────────────────

interface FileUploadFieldProps {
  label: string;
  accept: string;
  maxSize: number;
  value: File | null | undefined;
  onChange: (f: File | null) => void;
  error?: string;
}

function FileUploadField({
  label,
  accept,
  maxSize,
  value,
  onChange,
  error,
}: FileUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="space-y-1">
      <Label className="text-sm font-medium">{label}</Label>
      <div
        onClick={() => inputRef.current?.click()}
        className={cn(
          "border-2 border-dashed rounded-xl p-4 cursor-pointer text-center transition-colors hover:bg-muted/40",
          error ? "border-destructive" : "border-muted-foreground/30",
          value && "border-primary/50 bg-primary/5"
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={(e) => onChange(e.target.files?.[0] ?? null)}
        />
        {value ? (
          <div className="flex flex-col items-center gap-1">
            <span className="text-sm font-medium text-primary">
              File selected
            </span>
            <FileSizeBar file={value} max={maxSize} />
            <button
              type="button"
              className="text-xs text-muted-foreground underline mt-1"
              onClick={(e) => {
                e.stopPropagation();
                onChange(null);
                if (inputRef.current) inputRef.current.value = "";
              }}
            >
              Remove
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-1 py-2">
            <svg
              className="w-8 h-8 text-muted-foreground/50"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
              />
            </svg>
            <span className="text-sm text-muted-foreground">
              Click to upload {label.toLowerCase()}
            </span>
            <span className="text-xs text-muted-foreground/60">
              Max {maxSize / (1024 * 1024)} MB
            </span>
          </div>
        )}
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

// ─── TypeCountBadges ─────────────────────────────────────────────────────────

function TypeCountBadges({ counts }: { counts: TypeCounts }) {
  return (
    <div className="flex gap-2 flex-wrap">
      {(
        [
          { key: "image", label: "Images", color: "bg-blue-100 text-blue-700" },
          { key: "video", label: "Videos", color: "bg-purple-100 text-purple-700" },
          {
            key: "imageAudio",
            label: "Img+Audio",
            color: "bg-amber-100 text-amber-700",
          },
        ] as const
      ).map(({ key, label, color }) => (
        <Badge
          key={key}
          variant="outline"
          className={cn("text-xs font-normal", color)}
        >
          {label}: {counts[key]}/{MAX_PER_TYPE[key]}
        </Badge>
      ))}
    </div>
  );
}

// ─── SlideForm ────────────────────────────────────────────────────────────────

interface SlideFormProps {
  index: number;
  typeCounts: TypeCounts;
  onValidAndNext: (data: SlideData) => void;
  onSubmit: (data: SlideData) => void;
  isLast: boolean;
  isOnly: boolean;
}

function SlideForm({
  index,
  typeCounts,
  onValidAndNext,
  onSubmit,
  isLast,
  isOnly,
}: SlideFormProps) {
  const schema = createSlideSchema(typeCounts, index);

  const form = useForm<SlideData>({
    resolver: zodResolver(schema),
    defaultValues: defaultSlide(),
    mode: "onSubmit",
  });

  const storyType = form.watch("storyType");

  const handleNext = form.handleSubmit(onValidAndNext);
  const handleSubmit = form.handleSubmit(onSubmit);

  return (
    <FormProvider {...form}>
      <div className="space-y-5 px-1">
        {/* Type selector */}
        <FormField
          control={form.control}
          name="storyType"
          render={({ field, fieldState }) => (
            <FormItem>
              <Label className="text-sm font-medium">Story type</Label>
              <div className="grid grid-cols-3 gap-2 mt-1.5">
                {(
                  [
                    { value: "image", label: "Image", icon: "🖼", disabled: typeCounts.image >= MAX_PER_TYPE.image },
                    { value: "video", label: "Video", icon: "🎬", disabled: typeCounts.video >= MAX_PER_TYPE.video },
                    { value: "imageAudio", label: "Img + Audio", icon: "🎵", disabled: typeCounts.imageAudio >= MAX_PER_TYPE.imageAudio },
                  ] as const
                ).map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    disabled={opt.disabled}
                    onClick={() => {
                      field.onChange(opt.value);
                      form.setValue("imageFile", null);
                      form.setValue("videoFile", null);
                      form.setValue("audioFile", null);
                      form.clearErrors();
                    }}
                    className={cn(
                      "flex flex-col items-center gap-1 rounded-xl border p-3 text-sm transition-all",
                      field.value === opt.value
                        ? "border-primary bg-primary/5 font-medium"
                        : "border-muted hover:bg-muted/50",
                      opt.disabled && "opacity-40 cursor-not-allowed"
                    )}
                  >
                    <span className="text-xl">{opt.icon}</span>
                    <span className="leading-tight text-center">{opt.label}</span>
                    {opt.disabled && (
                      <span className="text-[10px] text-muted-foreground">
                        Limit reached
                      </span>
                    )}
                  </button>
                ))}
              </div> 
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Conditional file fields */}
        {storyType === "image" && (
          <FormField
            control={form.control}
            name="imageFile"
            render={({ field, fieldState }) => (
              <FormItem>
                <FileUploadField
                  label="Image"
                  accept={ALLOWED_MIME.image.join(",")}
                  maxSize={MAX_FILE_SIZES.image}
                  value={field.value as File | null}
                  onChange={field.onChange}
                  error={fieldState.error?.message}
                />
              </FormItem>
            )}
          />
        )}

        {storyType === "video" && (
          <FormField
            control={form.control}
            name="videoFile"
            render={({ field, fieldState }) => (
              <FormItem>
                <FileUploadField
                  label="Video"
                  accept={ALLOWED_MIME.video.join(",")}
                  maxSize={MAX_FILE_SIZES.video}
                  value={field.value as File | null}
                  onChange={field.onChange}
                  error={fieldState.error?.message}
                />
              </FormItem>
            )}
          />
        )}

        {storyType === "imageAudio" && (
          <>
            <FormField
              control={form.control}
              name="imageFile"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FileUploadField
                    label="Image"
                    accept={ALLOWED_MIME.image.join(",")}
                    maxSize={MAX_FILE_SIZES.image}
                    value={field.value as File | null}
                    onChange={field.onChange}
                    error={fieldState.error?.message}
                  />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="audioFile"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FileUploadField
                    label="Audio"
                    accept={ALLOWED_MIME.audio.join(",")}
                    maxSize={MAX_FILE_SIZES.audio}
                    value={field.value as File | null}
                    onChange={field.onChange}
                    error={fieldState.error?.message}
                  />
                </FormItem>
              )}
            />
          </>
        )}

        {/* Optional caption */}
        <FormField
          control={form.control}
          name="caption"
          render={({ field, fieldState }) => (
            <FormItem>
              <Label className="text-sm font-medium">
                Caption{" "}
                <span className="text-muted-foreground font-normal">
                  (optional)
                </span>
              </Label>
              <FormControl>
                <div className="relative">
                  <Input
                    {...field}
                    placeholder="Add a caption..."
                    maxLength={150}
                    className="pr-12"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                    {(field.value ?? "").length}/150
                  </span>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Actions */}
        <div className="flex gap-2 pt-1">
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={handleNext}
          >
            + Add slide
          </Button>
          <Button
            type="button"
            className="flex-1"
            onClick={handleSubmit}
          >
            {isOnly ? "Post story" : "Post all stories"}
          </Button>
        </div>
      </div>
    </FormProvider>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function StoryCreator() {
  const [slides, setSlides] = useState<number[]>([0]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [typeCounts, setTypeCounts] = useState<TypeCounts>({
    image: 0,
    video: 0,
    imageAudio: 0,
  });
  const [submittedData, setSubmittedData] = useState<SlideData[] | null>(null);
  const [api, setApi] = useState<CarouselApi>();

  const totalSlides = slides.length;

  // When slide N is validated → add slide N+1 and scroll to it
  const handleValidAndNext = useCallback(
    (data: SlideData) => {
      // Increment count for the type used on this slide
      setTypeCounts((prev) => ({
        ...prev,
        [data.storyType]: prev[data.storyType] + 1,
      }));

      const nextIndex = totalSlides; // 0-based, equals current length before push
      setSlides((prev) => [...prev, nextIndex]);

      // Scroll carousel to next slide after state update
      setTimeout(() => {
        api?.scrollTo(nextIndex);
        setCurrentSlide(nextIndex);
      }, 50);
    },
    [api, totalSlides]
  );

  // Submit = validate last slide then collect
  const handleSubmit = useCallback(
    (data: SlideData) => {
      // In real app: gather all slide data and POST
      console.log("Submitting story with last slide:", data);
      setSubmittedData([data]); // demo: show last slide data
    },
    []
  );

  if (submittedData) {
    return (
      <div className="max-w-sm mx-auto mt-12 p-6 rounded-2xl border text-center space-y-3">
        <div className="text-4xl">🎉</div>
        <h2 className="text-lg font-semibold">Story posted!</h2>
        <p className="text-sm text-muted-foreground">
          Your {totalSlides} {totalSlides === 1 ? "story" : "stories"} have been
          queued for upload.
        </p>
        <Button
          variant="outline"
          onClick={() => {
            setSlides([0]);
            setCurrentSlide(0);
            setTypeCounts({ image: 0, video: 0, imageAudio: 0 });
            setSubmittedData(null);
          }}
        >
          Create another
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-sm mx-auto mt-8 space-y-4">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold">Create story</h1>
          <span className="text-sm text-muted-foreground">
            Slide {currentSlide + 1} / {totalSlides}
          </span>
        </div>
        <TypeCountBadges counts={typeCounts} />
      </div>

      {/* Dot indicators */}
      <div className="flex gap-1.5">
        {slides.map((_, i) => (
          <div
            key={i}
            className={cn(
              "h-1.5 rounded-full transition-all",
              i === currentSlide
                ? "bg-primary w-6"
                : "bg-muted-foreground/30 w-1.5"
            )}
          />
        ))}
      </div>

      {/* Carousel — no prev/next nav, controlled programmatically */}
      <Carousel
        setApi={setApi}
        opts={{ watchDrag: false }} // disable swipe so only validated slides advance
        className="w-full"
      >
        <CarouselContent>
          {slides.map((_, index) => (
            <CarouselItem key={index}>
              <div className="rounded-2xl border bg-card p-5 shadow-sm">
                <p className="text-xs text-muted-foreground font-medium mb-4 uppercase tracking-wide">
                  Story {index + 1}
                </p>
                <SlideForm
                  index={index}
                  typeCounts={typeCounts}
                  onValidAndNext={handleValidAndNext}
                  onSubmit={handleSubmit}
                  isLast={index === totalSlides - 1}
                  isOnly={totalSlides === 1}
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
}