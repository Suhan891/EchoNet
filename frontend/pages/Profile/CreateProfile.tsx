"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  profileSchema,
  profileType,
} from "@/validations/profile/create.profile";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, SubmitHandler, useForm, useWatch } from "react-hook-form";
import { useUserStore } from "@/stores/UserStore";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from "@/components/ui/field";
import { User } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import CreateAvatar from "./CreateAvatar";
import UploadAvatar from "./UploadAvatar";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import { useProfileStore } from "@/stores/ProfileStore";
import { Separator } from "@/components/ui/separator";
import { useCreateProfile } from "@/hooks/useProfile";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { deleteProfileCookie } from "@/service/common/cookies";
import { Checkbox } from "@/components/ui/checkbox";

export default function CreeateProfile({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const newProfile = useCreateProfile();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<profileType>({
    resolver: zodResolver(profileSchema),
    mode: "onSubmit",
    defaultValues: {
      avatar: { mode: "create", avatarUrl: "" },
      name: "",
      bio: "",
      isPrivate: false,
    },
  });
  const watchProfile = useWatch({
    control,
  });
  const email = useUserStore((state) => state.email);
  const queryCLient = useQueryClient();
  //const userId = useUserStore(state => state.userId)
  const availProfilesCount = useUserStore((state) => state.profiles).length;
  const name = useProfileStore((state) => state.name);
  const bio = useProfileStore((state) => state.bio);
  const onSubmit: SubmitHandler<profileType> = (data) => {
    console.log(data);
    const formData = new FormData();
    formData.append("name", data.name);
    if (data.avatar.mode === "create")
      formData.append("avatarUrl", data.avatar.avatarUrl);
    if (data.avatar.mode === "upload")
      formData.append("avatar", data.avatar.avatar);
    if (data.bio) formData.append("bio", data.bio);
    formData.append("private", data.isPrivate ? "0" : "1");
    newProfile.mutate(formData, {
      onSuccess: (result) => {
        console.log(result.data);
        deleteProfileCookie();
        toast.success(result.message);
        queryCLient.invalidateQueries();
        setOpen(false);
      },
      onError: (errors) => {
        console.error(errors.error);
        toast.error(errors.message);
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Profile creation</DialogTitle>
          <DialogDescription>{email}</DialogDescription>
        </DialogHeader>
        <Card className="w-full">
          <form onSubmit={handleSubmit(onSubmit)}>
            <CardHeader className="w-full">
              <CardTitle className="mx-auto">
                New Profile (Avail: {availProfilesCount})
              </CardTitle>
              <CardDescription className="mx-auto">
                All the fields has to be completed
              </CardDescription>
            </CardHeader>
            <Separator className="my-3" />
            <CardContent className="flex flex-col sm:flex-row gap-6">
              <FieldSet className="flex-1 w-full flex flex-col">
                <FieldLegend>Avatar</FieldLegend>
                <FieldDescription>Add your Avatar</FieldDescription>
                <FieldGroup className="flex-end right-0">
                  <Controller
                    control={control}
                    name={"avatar.mode"}
                    render={({ field, fieldState }) => (
                      <Field
                        orientation="horizontal"
                        className="w-fit"
                        data-invalid={fieldState.invalid}
                      >
                        <FieldLabel htmlFor="switch">
                          Avatar {field.value}
                        </FieldLabel>
                        <Switch
                          checked={field.value === "upload"}
                          id="switch"
                          {...field}
                          aria-invalid={fieldState.invalid}
                          onCheckedChange={(checked) => {
                            field.onChange(checked ? "upload" : "create");
                          }}
                        />
                      </Field>
                    )}
                  />
                </FieldGroup>
                <FieldGroup>
                  <FieldSeparator />
                </FieldGroup>
                <FieldGroup>
                  {watchProfile.avatar?.mode === "create" ? (
                    <CreateAvatar control={control} isUpdate={false} />
                  ) : (
                    <UploadAvatar control={control} isUpdate={false} />
                  )}
                </FieldGroup>
                {errors.avatar && <FieldError errors={[errors.avatar]} />}
              </FieldSet>
              <FieldSet className="flex-1">
                <FieldLegend>Personal Info</FieldLegend>
                <FieldDescription>
                  All the fields has to be completed
                </FieldDescription>
                <FieldGroup>
                  <Controller
                    name={"name"}
                    control={control}
                    render={({ field, fieldState }) => (
                      <Field>
                        <FieldLabel htmlFor="username" className="ps-1.5">
                          Name
                        </FieldLabel>
                        <FieldDescription className="ps-1.5">
                          Please provide a unique name
                        </FieldDescription>
                        <InputGroup>
                          <InputGroupInput
                            id="username"
                            {...field}
                            aria-invalid={fieldState.invalid}
                            placeholder={name}
                          />
                          <InputGroupAddon>
                            <InputGroupButton
                              variant={"outline"}
                              disabled={true}
                              {...field}
                              className="bg-gray-700"
                            >
                              <User />
                            </InputGroupButton>
                          </InputGroupAddon>
                        </InputGroup>
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                  <Controller
                    control={control}
                    name="bio"
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor={`bio`}>
                          Description (optional){" "}
                        </FieldLabel>
                        <FieldDescription>
                          Shortly about yourself
                        </FieldDescription>
                        <InputGroup>
                          <InputGroupTextarea
                            id={`description`}
                            {...field}
                            cols={9}
                            rows={3}
                            maxLength={120}
                            placeholder={bio}
                          />
                          <InputGroupAddon align="block-end">
                            <InputGroupText>
                              {field.value?.length ?? 0}/{120}
                            </InputGroupText>
                          </InputGroupAddon>
                        </InputGroup>
                      </Field>
                    )}
                  />
                </FieldGroup>
              </FieldSet>
            </CardContent>
            <CardContent>
              <FieldGroup>
                <FieldSeparator />
                <div className="w-full mb-2">
                  <Controller
                    control={control}
                    name={"isPrivate"}
                    render={({ field }) => (
                      <Field orientation={"horizontal"}>
                        <Checkbox
                          id={"private-checkbox"}
                          name={field.name}
                          onCheckedChange={field.onChange}
                          checked={field.value}
                        />
                        <FieldLabel
                          htmlFor="private-checkbox"
                          className="font-normal"
                        >
                          Make my profile private
                        </FieldLabel>
                      </Field>
                    )}
                  />
                </div>
              </FieldGroup>
            </CardContent>
            <CardFooter>
              {newProfile.isPending ? (
                <Button variant={"outline"} disabled>
                  Creating
                </Button>
              ) : (
                <Button type="submit" className="w-full">
                  Submit
                </Button>
              )}
            </CardFooter>
          </form>
        </Card>
      </DialogContent>
    </Dialog>
  );
}
