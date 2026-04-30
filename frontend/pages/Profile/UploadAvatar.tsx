"use client";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useProfileStore } from "@/stores/ProfileStore";
import { CloudAlert } from "lucide-react";
import { useEffect, useReducer } from "react";
import { Control, Controller, useWatch } from "react-hook-form";

interface UploadAvatarProps {
  control: Control<
    | {
        mode: "create";
        avatarUrl: string;
      }
    | {
        mode: "upload";
        avatar: File;
      },
    | {
        mode: "create";
        avatarUrl: string;
      }
    | {
        mode: "upload";
        avatar: File;
      }
  >;
}

export default function UploadAvatar({ control }: UploadAvatarProps) {
  const avatarUrl = useProfileStore((state) => state.avatarUrl);
  const watchAvatar = useWatch({
    control,
  });
  const [previewUrl, dispatchUrl] = useReducer(
    (_: string | null, action: string) => action,
    null,
  );
  useEffect(() => {
    if (watchAvatar.mode === "upload" && watchAvatar.avatar) {
      const url = URL.createObjectURL(watchAvatar.avatar);
      dispatchUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [watchAvatar]);
  return (
    <FieldGroup>
      <Controller
        control={control}
        name={"avatar"}
        render={({ field: { onChange }, fieldState }) => (
          <Field aria-invalid={fieldState.invalid} className="flex justify-center items-center w-full py-4">
            <FieldLabel htmlFor="avatar">
              <Avatar className="w-48 h-48 mx-auto">
                <AvatarImage
                  src={previewUrl ? previewUrl : avatarUrl}
                  alt={"Avatar"}
                  className="object-cover"
                />
                <AvatarFallback>
                  <CloudAlert size={12} />
                </AvatarFallback>
              </Avatar>
            </FieldLabel>
            <Input
              type="file"
              id="avatar"
              accept="image/jpeg,image/png,image/webp,image/jpg"
              className="sr-only"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file instanceof File) {
                  onChange(file);
                }
              }}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
    </FieldGroup>
  );
}
