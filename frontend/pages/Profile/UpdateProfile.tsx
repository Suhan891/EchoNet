import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useProfileStore } from "@/stores/ProfileStore";
import {
  UpdateProfileSchema,
  UpdateProfileType,
} from "@/validations/profile/update.profile";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch, SubmitHandler } from "react-hook-form";

export function UpdateProfileDialog({ open, setOpen }: { open: boolean, setOpen: (open: boolean) => void }) {
  const name = useProfileStore((state) => state.name);
  const bio = useProfileStore((state) => state.bio);
  const { register, handleSubmit, control } = useForm<UpdateProfileType>({
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
  const isDisabled = newName === name || newBio === bio;
  const onSubmit: SubmitHandler<UpdateProfileType> = (data) => {};
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you&apos;re
              done.
            </DialogDescription>
          </DialogHeader>
          <FieldGroup>
            <Field>
              <Label htmlFor="name-1">Name</Label>
              <Input id="name-1" {...register("name")} />
            </Field>
            <Field>
              <Label htmlFor="bio">Bio</Label>
              <Input id="bio" {...register("bio")} />
            </Field>
          </FieldGroup>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            </DialogClose>
            <Button disabled={isDisabled} type="submit">
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
