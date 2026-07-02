import { Card } from "@/components/ui/card";
import {
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Upload } from "lucide-react";

interface UploadMediaProps {
  isImage?: boolean;
  isVideo?: boolean;
  isAudio?: boolean;
}

export default function UploadMedia({
  isImage,
  isAudio,
  isVideo,
}: UploadMediaProps) {
  return (
    <Card size={"sm"} className="w-32 rounded-lg border border-dashed">
      <EmptyHeader>
        <EmptyMedia variant={"icon"}>
          <Upload />
        </EmptyMedia>
        <EmptyTitle>Upload</EmptyTitle>
        <EmptyDescription>
          {isImage && (
            <div className="flex-col justify-center items-center">
              <p>PNG, JPG, WEBP</p>
              <p>Max 5MB</p>
            </div>
          )}
          {isVideo && (
            <div className="flex-col justify-center items-center">
              <p>MP4, MOV</p>
              <p>Max 100MB</p>
            </div>
          )}
          {isAudio && (
            <div className="flex-col justify-center items-center">
              <p>MP3, WAV</p>
              <p>Max 20MB</p>
            </div>
          )}
        </EmptyDescription>
      </EmptyHeader>
    </Card>
  );
}
