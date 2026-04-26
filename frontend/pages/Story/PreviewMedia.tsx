import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Card } from "@/components/ui/card";
import Image from "next/image";

interface PreviewMediaProps {
  imageUrl?: string;
  videoUrl?: string;
  audioUrl?: string;
}

export default function PreviewMedia({
  imageUrl,
  videoUrl,
  audioUrl
}: PreviewMediaProps) {

  return (
    <Card className="w-32">
      {imageUrl && (
        <AspectRatio ratio={1 / 1}>
          <Image
            src={imageUrl}
            alt="Img preview"
            fill
            unoptimized
            className="rounded-lg object-cover"
          />
        </AspectRatio>
      )}
      {videoUrl && (
        <AspectRatio ratio={1 / 1}>
          <video
            controls
            src={videoUrl}
            className="object-cover h-36 rounded-lg w-full"
          />
        </AspectRatio>
      )}
      {audioUrl && (
        <audio controls src={audioUrl} className="z-5 w-full" />
      )}
    </Card>
  );
}
