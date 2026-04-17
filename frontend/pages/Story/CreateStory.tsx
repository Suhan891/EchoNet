import { useCreateStory } from "@/hooks/useStory";
import { useProfileStore } from "@/stores/ProfileStore";
import { useStoryStore } from "@/stores/StoryStore";
import { storySchema, storyType } from "@/validations/story/story.create";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";

export default function CreateStory() {
  // Later be made within dialog
  const story = useCreateStory();
  const setStory = useProfileStore((state) => state.setStory);
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
        formData.append(`slides[${index}][type]`, item.type)
        if (item.imageFile)
          formData.append(`slides[${index}][imageFile]`, item.imageFile);
        if (item.caption)
          formData.append(`slides[${index}][caption]`, item.caption);
      }
      if (item.type === "video") {
        formData.append(`slides[${index}][type]`, item.type)
        if (item.videoFile)
          formData.append(`slides[${index}][videoFile]`, item.videoFile);
        if (item.caption)
          formData.append(`slides[${index}][caption]`, item.caption);
      }
      if (item.type === "imageAudio") {
        formData.append(`slides[${index}][type]`, item.type)
        if (item.imageFile)
          formData.append(`slides[${index}][imageFile]`, item.imageFile);
        if (item.audioFile)
          formData.append(`slides[${index}][audioFile]`, item.audioFile);
        if (item.caption)
          formData.append(`slides[${index}][caption]`, item.caption);
      }
    });
    story.mutate(formData, {
      onSuccess: (result) => {
        const state = useStoryStore.getState();
        if (result.data.status === "successfull") {
          state.setStory(result.data.storyId);
          state.setExpiresAt(result.data.expiresAt);
          state.setIsUploaded(true);
        }
        setStory(true);
        toast.success(result.message);
        // Closing the dialog => setOpen(false)
      },
      onError: (error) => {
        toast.error(error.message);
        console.error(error.error);
      },
    });
  };
}
