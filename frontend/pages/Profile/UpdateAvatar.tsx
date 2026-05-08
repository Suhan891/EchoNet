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
import { Field, FieldError, FieldGroup, FieldSet } from "@/components/ui/field";
import {
  Controller,
  FormProvider,
  SubmitHandler,
  useForm,
  useWatch,
} from "react-hook-form";
import { avatarSchema, avatarType } from "@/validations/profile/create.avatar";
import { zodResolver } from "@hookform/resolvers/zod";
import { Switch } from "@/components/ui/switch";
import CreateAvatar from "./CreateAvatar";
import UploadAvatar from "./UploadAvatar";
import { useUpdateAvatar } from "@/hooks/useProfile";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { useUserStore } from "@/stores/UserStore";
import { queryKeys } from "@/utils/query.key";
import { Spinner } from "@/components/ui/spinner";

export default function UpdateAvatar({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  const upAvatar = useUpdateAvatar();
  const form = useForm<avatarType>({
    resolver: zodResolver(avatarSchema) as any,
    mode: "onSubmit",
    defaultValues: {
      mode: "create",
      avatarUrl: "",
    },
  });
  const queryClient = useQueryClient();
  const userId = useUserStore((state) => state.userId);

  const onSubmit: SubmitHandler<avatarType> = (data) => {
    const formData = new FormData();

    if (data.mode === "create") formData.append("avatarUrl", data.avatarUrl);
    if (data.mode === "upload") formData.append("avatar", data.avatar);
    upAvatar.mutate(formData, {
      onSuccess: (result) => {
        toast.success(result.message);
        console.log(result.data);
        setOpen(false);
        queryClient.invalidateQueries({ queryKey: [queryKeys.USER] });
        queryClient.invalidateQueries({ queryKey: [userId] });
      },
      onError: (err) => {
        toast.error(err.message);
        console.error(err.error);
      },
    });
  };
  const watchAvatar = useWatch({
    control: form.control,
    defaultValue: {
      mode: "create",
      avatarUrl: "",
    },
  });
  const isReady =
    (watchAvatar.mode === "create" &&
      watchAvatar.avatarUrl != null &&
      watchAvatar.avatarUrl !== "") ||
    (watchAvatar.mode === "upload" && watchAvatar.avatar != undefined);
  return (
    <Drawer onOpenChange={setOpen} open={open}>
      <DrawerContent>
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="mx-auto w-full max-w-sm">
              <DrawerHeader>
                <DrawerTitle className="flex justify-between items-center">
                  <h1>Update Avatar</h1>
                  <FieldSet>
                    <FieldGroup>
                      <Controller
                        control={form.control}
                        name={"mode"}
                        render={({ field }) => (
                          <Field orientation={"horizontal"}>
                            {field.value === "create" && <span>Create</span>}
                            <Switch
                              checked={field.value === "upload"}
                              {...field}
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
                <DrawerDescription>
                  {watchAvatar.mode === "create"
                    ? "Search and Select an Avatar"
                    : "Upload an Image"}
                </DrawerDescription>
              </DrawerHeader>
              {watchAvatar.mode === "create" ? (
                <CreateAvatar<avatarType> name={"avatarUrl"} />
              ) : (
                <UploadAvatar<avatarType> name={"avatar"} isUpdate={true} />
              )}
              <FieldError errors={[form.formState.errors.mode]} />
              <DrawerFooter>
                {upAvatar.isPending ? (
                  <Button variant={"outline"} disabled>
                    <Spinner />
                    Uploading Avatar
                  </Button>
                ) : (
                  <Button type="submit" disabled={!isReady}>
                    Submit
                  </Button>
                )}
                <DrawerClose asChild>
                  <Button variant={"outline"}>Cancel</Button>
                </DrawerClose>
              </DrawerFooter>
            </div>
          </form>
        </FormProvider>
      </DrawerContent>
    </Drawer>
  );
}
