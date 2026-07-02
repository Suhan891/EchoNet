"use client";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useProfileStore } from "@/stores/ProfileStore";
import { avatarType } from "@/validations/profile/create.avatar";
import { profileType } from "@/validations/profile/create.profile";
import { CloudAlert, CloudUpload } from "lucide-react";
import { useEffect, useReducer } from "react";
import { Controller, useWatch, Path, FieldPath, useFormContext } from "react-hook-form";

interface UploadAvatarProps<T extends avatarType | profileType> {
  name: FieldPath<T>;
  isUpdate: boolean;
}

export default function UploadAvatar<T extends avatarType | profileType>({ name, isUpdate }: UploadAvatarProps<T>) {
  const avatarUrl = useProfileStore((state) => state.avatarUrl);
  const {control} = useFormContext<T>()
  const mode = useWatch({
    control,
    name: (isUpdate ? "mode" : "avatar.mode") as Path<T>,
  });
  const file = useWatch({
    control,
    name: (isUpdate ? "avatar" : "avatar.avatar") as Path<T>,
  });
  const [previewUrl, dispatchUrl] = useReducer(
    (_: string | null, action: string) => action,
    null,
  );
  useEffect(() => {
    if (mode === "upload" && file instanceof File) {
      const url = URL.createObjectURL(file);
      dispatchUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [mode, file]);
  return (
    <FieldGroup>
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange }, fieldState }) => (
          <Field aria-invalid={fieldState.invalid} className="flex justify-center items-center w-full py-4">
            <FieldLabel htmlFor="avatar">
              <Avatar className="w-48 h-48 mx-auto">
                <AvatarImage
                  src={previewUrl || (isUpdate ? avatarUrl : undefined)}
                  alt={"Avatar"}
                  className="object-cover"
                />
                <AvatarFallback>
                  {isUpdate && <CloudAlert />}
                  {!isUpdate && <CloudUpload />}
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
