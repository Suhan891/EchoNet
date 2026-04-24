"use client"
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { useEffect, useMemo, useRef } from "react";

interface PreviewMediaProps {
  imageFile?: File;
  videoFile?: File;
  audioFile?: File;
}

export default function PreviewMedia({
  imageFile,
  videoFile,
  audioFile,
}: PreviewMediaProps) {
  const file = imageFile || videoFile || audioFile;

  const url = useMemo(() => {
    return file instanceof File ? URL.createObjectURL(file) : null;
  }, [file]);

  const urlRef = useRef<string | null>(null);

  useEffect(() => {
    urlRef.current = url;

    return () => {
      if (urlRef.current) {
        URL.revokeObjectURL(urlRef.current);
        urlRef.current = null;
      }
    };
  }, [url]);

  if (!url) return null;

  return (
    <Card className="w-32">
      {imageFile && (
        <AspectRatio ratio={1 / 1}>
          <Image
            src={url}
            alt="Img preview"
            fill
            unoptimized
            className="rounded-lg object-cover"
          />
        </AspectRatio>
      )}
      {videoFile && (
        <AspectRatio ratio={1 / 1}>
          <video
            controls
            src={url}
            className="object-cover h-36 rounded-lg w-full"
          />
        </AspectRatio>
      )}
      {audioFile && (
        <audio controls src={url} className="z-5 w-full" />
      )}
    </Card>
  );
}
