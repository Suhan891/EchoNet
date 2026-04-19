import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { useProfileStore } from "@/stores/ProfileStore";
import {
  UpdateProfileSchema,
  UpdateProfileType,
} from "@/validations/profile/update.profile";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { useForm, useWatch, SubmitHandler } from "react-hook-form";

export default function UpdateProfile({
  open,
  setOpen,
  children,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  children: React.ReactNode;
}) {
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
  const isDisabled = !newName || newName === name && newBio === bio;
  const onSubmit: SubmitHandler<UpdateProfileType> = (data) => {};
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
              <Textarea
                rows={2}
                id="bio"
                {...register("bio")}
                autoComplete="bio"
              />
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
