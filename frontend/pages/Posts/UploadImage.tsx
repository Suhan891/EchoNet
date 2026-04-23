"use client";
import { useCallback } from "react";

import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Upload } from "lucide-react";

interface UploadTileProps {
  inputId: string;
  label: string;
  /** Controls border/icon color scheme */
  accent?: "default" | "primary";
  isInvalid?: boolean;
  onFile: (file: File) => void;
}

export default function UploadImagePost({
  inputId,
  label,
  accent = "default",
  isInvalid = false,
  onFile,
}: UploadTileProps) {
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) onFile(file);
      // Reset so re-selecting the same file still fires onChange
      e.target.value = "";
    },
    [onFile]
  );

  return (
    <div className="flex flex-col gap-1">
      <Label htmlFor={inputId} className="cursor-pointer">
        <div
          className={cn(
            "flex aspect-square flex-col items-center justify-center",
            "rounded-xl border-2 border-dashed gap-2 p-3 transition-colors",
            accent === "primary"
              ? "border-primary/50 bg-primary/5 hover:bg-primary/10"
              : isInvalid
                ? "border-destructive bg-destructive/5 hover:bg-destructive/10"
                : "border-muted-foreground/30 bg-muted/20 hover:bg-muted/50"
          )}
        >
          <Upload
            className={cn(
              "h-5 w-5",
              accent === "primary"
                ? "text-primary"
                : isInvalid
                  ? "text-destructive"
                  : "text-muted-foreground"
            )}
          />
          <span className="text-center text-[11px] font-medium leading-tight text-muted-foreground">
            {label}
          </span>
          <span className="text-[10px] text-muted-foreground/60">
            PNG · JPG · WEBP
          </span>
        </div>
      </Label>
      <input
        id={inputId}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/jpg"
        className="sr-only"
        onChange={handleChange}
      />
    </div>
  );
}
