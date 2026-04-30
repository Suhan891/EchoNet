"use client";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import {
  Field,
  FieldGroup,
  FieldSet,
} from "@/components/ui/field";
import { Controller, SubmitHandler, useForm, useWatch } from "react-hook-form";
import {
  avatarSchema,
  avatarType,
} from "@/validations/profile/create.avatar";
import { zodResolver } from "@hookform/resolvers/zod";
import { Switch } from "@/components/ui/switch";
import CreateAvatar from "./CreateAvatar";
import UploadAvatar from "./UploadAvatar";

export default function UpdateAvatar({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  const {
    control,
    handleSubmit,
    formState: { errors: avatarError },
  } = useForm<avatarType>({
    resolver: zodResolver(avatarSchema),
    mode: "onSubmit",
  });

  if (avatarError) console.log(avatarError);
  const onSubmit: SubmitHandler<avatarType> = (data) => {
    console.log("Submitted id: ", data);
  };
  const watchAvatar = useWatch({
    control,
    defaultValue: {
      mode: 'create',
      avatarUrl: "",
    }
  });
  const isReady = watchAvatar.mode === 'create' && watchAvatar.avatarUrl != null || watchAvatar.mode === 'upload' && watchAvatar.avatar != undefined
  return (
    <Drawer onOpenChange={setOpen} open={open}>
      <DrawerContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mx-auto w-full max-w-sm">
            <DrawerHeader>
              <DrawerTitle className="flex justify-between items-center">
                <h1>Update Avatar</h1>
                <FieldSet>
                  <FieldGroup>
                    <Controller
                      control={control}
                      name={"mode"}
                      render={({ field }) => (
                        <Field orientation={"horizontal"}>
                          {field.value === "create" && <span>Create</span>}
                          <Switch
                            checked={field.value === "upload"}
                            onCheckedChange={(checked) => {
                              field.onChange(checked ? "upload" : "create");
                            }}
                          />
                          {field.value === "upload" && <span>Upload</span>}
                        </Field>
                      )}
                    />
                  </FieldGroup>
                </FieldSet>
              </DrawerTitle>
              <DrawerDescription>{watchAvatar.mode === 'create' ? "Search and Select an Avatar" : "Upload an Image"}</DrawerDescription>
            </DrawerHeader>
            {watchAvatar.mode === 'create' ? (
              <CreateAvatar control={control} />
            ) : (<UploadAvatar control={control} />)}
            <DrawerFooter>
              <Button type="submit" disabled={!isReady}>Submit</Button>
              <DrawerClose asChild>
                <Button variant={"outline"}>Cancel</Button>
              </DrawerClose>
            </DrawerFooter>
          </div>
        </form>
      </DrawerContent>
    </Drawer>
  );
}
