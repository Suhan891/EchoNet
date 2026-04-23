import { AudioLines, Image, Video } from "lucide-react";

export const SLIDE_HEADER = [
  { key: 'IMAGES', label: "Images", icon: Image, color: "bg-blue-100 text-blue-700" },
  { key: "VIDEO", label: "Videos", icon: Video, color: "bg-purple-100 text-purple-700" },
  {
    key: "COMBINED",
    label: "Img+Audio",
    icon: AudioLines,
    color: "bg-amber-100 text-amber-700",
  },
];
export const SLIDES_DESCRIPTION = {
  image: "Upload an image",
  video: "Upload a video",
  imageAudio: "Upload image and audio",
};
export const ALLOWED_STORY_MEDIA = {
  IMAGES: 10,
  COMBINED: 5,
  VIDEO: 5,
};
export const MAX_ALLOWED_POSTS = 15 // Maximum 15 photos can be uploaded all together