"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { cn } from "@/lib/utils";
import { AspectRatio } from "@/components/ui/aspect-ratio";

import { Label } from "@/components/ui/label";
import UploadImagePost from "./UploadImage";

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1 text-xs text-destructive">{message}</p>;
}
interface ImageSlotPreviewProps {
  inputId: string;
  value: File | undefined;
  onChange: (file: File) => void;
  onRemove: () => void;
  isInvalid: boolean;
  errorMessage?: string;
  accent?: "default" | "primary";
}

export default function ImagePreview({
  inputId,
  value,
  onChange,
  onRemove,
  isInvalid,
  errorMessage,
  accent = "default",
}: ImageSlotPreviewProps) {
  const urlRef = useRef<string | null>(null);
  const imageUrl = useMemo(() => (value instanceof File ? URL.createObjectURL(value) : null), [value]);

  useEffect(() => {
    urlRef.current = imageUrl;
    return () => {
      if (urlRef.current) {
        URL.revokeObjectURL(urlRef.current);
        urlRef.current = null;
      }
    };
  }, [value, imageUrl]);

  const handleReplaceChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) onChange(file);
      e.target.value = "";
    },
    [onChange]
  );

  if (!imageUrl) {
    return (
      <div className="flex flex-col gap-1">
        <UploadImagePost
          inputId={inputId}
          label={accent === "primary" ? "Add image" : "Click to upload"}
          isInvalid={isInvalid}
          accent={accent}
          onFile={onChange}
        />
        <FieldError message={errorMessage} />
      </div>
    );
  }

  // ── Filled state → preview with hover overlay ───────────────────────────
  return (
    <div className="group relative overflow-hidden rounded-xl border bg-muted shadow-sm">
      <AspectRatio ratio={1}>
        <Image
          src={imageUrl}
          alt="Uploaded image preview"
          fill
          className="object-cover transition-all duration-300 group-hover:brightness-60"
        />
      </AspectRatio>

      {/* Hover overlay */}
      <div
        className={cn(
          "absolute inset-0 flex items-center justify-center gap-2",
          "opacity-0 transition-opacity duration-200 group-hover:opacity-100"
        )}
      >
        {/* Replace — Label points at hidden input below */}
        <Label
          htmlFor={inputId}
          className={cn(
            "cursor-pointer rounded-md bg-background/90 px-3 py-1.5",
            "text-xs font-medium shadow-sm transition-colors hover:bg-background"
          )}
        >
          Replace
        </Label>
        <button
          type="button"
          onClick={onRemove}
          aria-label="Remove image"
          className={cn(
            "rounded-md bg-destructive/90 px-3 py-1.5",
            "text-xs font-medium text-destructive-foreground shadow-sm",
            "transition-colors hover:bg-destructive"
          )}
        >
          Remove
        </button>
      </div>

      {/* Hidden replacement input — id matches the Label above */}
      <input
        id={inputId}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/jpg"
        className="sr-only"
        onChange={handleReplaceChange}
      />
    </div>
  );
}
