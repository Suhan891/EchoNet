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
  audioUrl,
}: PreviewMediaProps) {
  console.log(imageUrl);
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
    </Card>
  );
}
