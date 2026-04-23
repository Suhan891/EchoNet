"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { AspectRatio } from "@/components/ui/aspect-ratio";

import { Label } from "@/components/ui/label";
import UploadImagePost from "./UploadImage";

// ---------------------------------------------------------------------------
// Primitives
// ---------------------------------------------------------------------------

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1 text-xs text-destructive">{message}</p>;
}

// ---------------------------------------------------------------------------
// ImageSlot — handles ONE grid tile, either filled or empty
//
// When value is undefined  → renders UploadTile (empty state)
// When value is a File     → renders image preview with Replace / Remove
//
// AppendSlot is intentionally deleted — CreatePost renders ImageSlot with
// value={undefined} for the append tile, controlling only what onChange does.
// ---------------------------------------------------------------------------

interface ImageSlotPreviewProps {
  /** Stable id: field.id from useFieldArray, or useId() for the append tile */
  inputId: string;
  value: File | undefined;
  onChange: (file: File) => void;
  onRemove: () => void;
  isInvalid: boolean;
  errorMessage?: string;
  /** Passed through to UploadTile — "primary" for the append tile */
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
  // Keep a ref to the current object URL so we can revoke it correctly
  const urlRef = useRef<string | null>(null);
  const imageUrl = value instanceof File ? URL.createObjectURL(value) : null;

  useEffect(() => {
    // Revoke the previous URL when value changes
    if (urlRef.current && urlRef.current !== imageUrl) {
      URL.revokeObjectURL(urlRef.current);
    }
    urlRef.current = imageUrl;

    return () => {
      // Revoke on unmount
      if (urlRef.current) {
        URL.revokeObjectURL(urlRef.current);
        urlRef.current = null;
      }
    };
    // imageUrl is derived from value — rerun only when value changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const handleReplaceChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) onChange(file);
      e.target.value = "";
    },
    [onChange]
  );

  // ── Empty state → delegate entirely to UploadTile ──────────────────────
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
