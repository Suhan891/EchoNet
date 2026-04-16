import { storySchema, storyType } from "@/validations/story/story.create";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";

export default function CreateStory() {
  const { control } = useForm<storyType>({
    resolver: zodResolver(storySchema),
    mode: "onChange",
    defaultValues: {
      slides: [],
    },
  });
  const { fields, append } = useFieldArray({
    control,
    name: "slides",
  });
  const onSubmit: SubmitHandler<storyType> = (data) => {
    const formData = new FormData();
    data.slides.forEach((item, index) => {
      if (item.type === "image") {
        if (item.imageFile)
          formData.append(`image[${index}][file]`, item.imageFile);
        if (item.caption)
          formData.append(`image[${index}][caption]`, item.caption);
        if (item.order)
          formData.append(`image[${index}][order]`, `${item.order}`); // As it accepts only string other than a number
      }
      if (item.type === "video") {
        if (item.videoFile)
          formData.append(`video[${index}][file]`, item.videoFile);
        if (item.caption)
          formData.append(`video[${index}][caption]`, item.caption);
        if (item.order)
          formData.append(`video[${index}][order]`, `${item.order}`);
      }
      if (item.type === "imageAudio") {
        if (item.imageFile)
          formData.append(`imgAudio[${index}][image]`, item.imageFile);
        if (item.audioFile)
          formData.append(`imgAudio[${index}][audio]`, item.audioFile);
        if (item.caption)
          formData.append(`imgAudio[${index}][caption]`, item.caption);
        if (item.order)
          formData.append(`imgAudio[${index}][order]`, `${item.order}`);
      }
    });
  };
}
