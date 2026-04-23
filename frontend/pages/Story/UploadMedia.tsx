import { Card } from "@/components/ui/card";
import { EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { Upload } from "lucide-react";

interface UploadMediaProps {
    isImage?: boolean;
    isVideo?: boolean;
    isAudio?: boolean;
}

export default function UploadMedia({isImage, isAudio, isVideo}: UploadMediaProps) {
    return (
        <Card size={'sm'} className="border-dashed">
            <EmptyHeader>
                <EmptyMedia variant={'icon'}>
                    <Upload />
                </EmptyMedia>
                <EmptyTitle>Upload</EmptyTitle>
            </EmptyHeader>
        </Card>
    )
}