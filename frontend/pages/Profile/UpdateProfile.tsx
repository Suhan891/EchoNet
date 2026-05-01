import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useUpdateProfile } from "@/hooks/useProfile";
import { useProfileStore } from "@/stores/ProfileStore";
import { useUserStore } from "@/stores/UserStore";
import { queryKeys } from "@/utils/query.key";
import {
  UpdateProfileSchema,
  UpdateProfileType,
} from "@/validations/profile/update.profile";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { X } from "lucide-react";
import { useForm, useWatch, SubmitHandler } from "react-hook-form";
import { toast } from "sonner";

export default function UpdateProfile({
  open,
  setOpen,
  children,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  children: React.ReactNode;
}) {
  const profile = useUpdateProfile();
  const querClient = useQueryClient();
  const userId = useUserStore((state) => state.userId);
  const setBio = useProfileStore((state) => state.setBio);
  const name = useProfileStore((state) => state.name);
  const bio = useProfileStore((state) => state.bio);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<UpdateProfileType>({
    resolver: zodResolver(UpdateProfileSchema),
  });
  const newName = useWatch({
    control,
    name: "name",
    defaultValue: name,
  });
  const newBio = useWatch({
    control,
    name: "bio",
    defaultValue: bio,
  });
  const isDisabled = !newName || (newName === name && newBio === bio);
  const onSubmit: SubmitHandler<UpdateProfileType> = (data) => {
    profile.mutate(data, {
      onSuccess: (result) => {
        console.log(result.data);
        toast.success(result.message);
        setOpen(false);
        if (result.data.bio !== bio) setBio(result.data.bio);
        if (result.data.name !== name) {
          querClient.invalidateQueries({ queryKey: [queryKeys.USER] });
          querClient.invalidateQueries({ queryKey: [userId] });
        }
      },
      onError: (errors) => {
        console.error(errors.error);
        toast.error(errors.message);
      },
    });
  };
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent align={"center"}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <PopoverHeader>
            <PopoverTitle className="w-full flex px-1 justify-between">
              <h1 className="text-xl font-bold pl-1 py-2.5"> Update Profile</h1>
              <Button
                variant={"outline"}
                type={"button"}
                onClick={() => setOpen(false)}
              >
                <X />
              </Button>
            </PopoverTitle>
          </PopoverHeader>
          <FieldGroup>
            <Field>
              <Label htmlFor="name-1">Name</Label>
              <Input id="name-1" {...register("name")} autoComplete="name" />
              {errors.name ? (
                <FieldError errors={[errors.name]} />
              ) : (
                <FieldDescription>Name should be unique</FieldDescription>
              )}
            </Field>
            <Field>
              <Label htmlFor="bio">Bio</Label>
              <InputGroup>
                <InputGroupTextarea
                  id={`description`}
                  {...register("bio")}
                  cols={9}
                  rows={3}
                  maxLength={120}
                />
                <InputGroupAddon align="block-end">
                  <InputGroupText>
                    {newBio?.length ?? 0}/{120}
                  </InputGroupText>
                </InputGroupAddon>
              </InputGroup>
              {errors.bio ? (
                <FieldError errors={[errors.bio]} />
              ) : (
                <FieldDescription>Bio is an optional field</FieldDescription>
              )}
            </Field>
            <FieldSeparator />
            <Field>
              <Button variant={"secondary"} disabled={isDisabled}>
                Update
              </Button>
            </Field>
          </FieldGroup>
        </form>
      </PopoverContent>
    </Popover>
  );
}
