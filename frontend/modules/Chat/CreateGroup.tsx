import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
  useComboboxAnchor,
} from "@/components/ui/combobox";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSet,
  FieldError,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { Spinner } from "@/components/ui/spinner";
import { useAllProfileForGroup, useCreateGroup } from "@/hooks/useChat";
import { CreateChatDto } from "@/types/chat";
import { queryKeys } from "@/utils/query.key";
import { groupSchema, groupType } from "@/validations/chats/create.group";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { Upload } from "lucide-react";
import { Fragment } from "react";
import { Controller, SubmitHandler, useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";

export default function CreateGroup() {
  const anchor = useComboboxAnchor();
  const { data, isSuccess, isLoading, isError, error } =
    useAllProfileForGroup();

  const { control, handleSubmit, reset } = useForm<groupType>({
    resolver: zodResolver(groupSchema),
  });
  const watchGroup = useWatch({
    control,
    defaultValue: {
      media: undefined,
      name: "",
      profiles: [],
    },
  });
  const isAllowed =
    watchGroup.media === undefined ||
    watchGroup.name === null ||
    (watchGroup.profiles?.length ?? 0) < 2

  const queryClient = useQueryClient();

  const groupChat = useCreateGroup();
  const onSubmit: SubmitHandler<groupType> = (data) => {
    const formData = new FormData();
    formData.append(`name`, data.name);
    formData.append(`avatar`, data.media);
    data.profiles.forEach(prof => {
      formData.append(`profiles`, prof);
    });
    groupChat.mutate(formData, {
      onSuccess: (result) => {
        toast.success(result.message);
      },
      onError: (err) => {
        toast.error(err.message);
        console.error(err);
      },
      onSettled: () => {
        reset();
        queryClient.invalidateQueries({queryKey: [queryKeys.CHAT]})
      },
    });
  };

  if (isLoading) return <Spinner className="size-6" />;
  if (isError) return <div>Error: {error.message}</div>;

  return (
    <>
      {isSuccess && (
        <FieldSet className="flex flex-col gap-4 max-w-lg">
          <div>
            <FieldLabel className="text-lg text-white font-semibold">
              Group Chat
            </FieldLabel>
            <FieldDescription className="text-sm text-gray-400">
              Select profiles to create group chat
            </FieldDescription>
          </div>
          <FieldGroup>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-4"
            >
              <Controller
                control={control}
                name={"media"}
                render={({ field, fieldState }) => {
                  const previewUrl =
                    field.value instanceof File
                      ? URL.createObjectURL(field.value)
                      : "";

                  return (
                    <Field
                      aria-invalid={fieldState.invalid}
                      className="flex justify-center items-center w-full py-4"
                    >
                      <FieldLabel htmlFor="group-avatar">
                        <Avatar className="w-32 h-32 mx-auto">
                          <AvatarImage src={previewUrl} />
                          <AvatarFallback>
                            <Upload />
                          </AvatarFallback>
                        </Avatar>
                      </FieldLabel>
                      <Input
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/jpg"
                        id="group-avatar"
                        className="sr-only"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file instanceof File) {
                            field.onChange(file);
                          }
                        }}
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  );
                }}
              />
              <Controller
                control={control}
                name={"name"}
                render={({ field, fieldState }) => (
                  <Field aria-invalid={fieldState.invalid}>
                    <Input
                      placeholder="Enter group name..."
                      {...field}
                      className="w-full bg-transparent text-white border-white/20"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                control={control}
                name="profiles"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <Combobox
                      multiple
                      autoHighlight
                      items={data.data}
                      value={data.data.filter((item) =>
                        field.value?.includes(item.id),
                      )}
                      onValueChange={(selectedItems: CreateChatDto[]) => {
                        field.onChange(selectedItems.map((item) => item.id));
                      }}
                    >
                      <ComboboxChips
                        ref={anchor}
                        className="w-full bg-transparent border-white/20"
                      >
                        <ComboboxValue>
                          {(values: CreateChatDto[]) => (
                            <Fragment>
                              {values.map((value) => (
                                <ComboboxChip
                                  key={value.id}
                                  className="bg-white/10 text-white border-white/20"
                                >
                                  {value.name}
                                </ComboboxChip>
                              ))}
                              <ComboboxChipsInput
                                placeholder="Search profiles..."
                                className="text-white placeholder:text-gray-500"
                                aria-invalid={fieldState.invalid}
                              />
                            </Fragment>
                          )}
                        </ComboboxValue>
                      </ComboboxChips>

                      <ComboboxContent anchor={anchor}>
                        <ComboboxEmpty>No profile found.</ComboboxEmpty>
                        <ComboboxList>
                          {(item: CreateChatDto) => (
                            <ComboboxItem key={item.id} value={item}>
                              <ItemMedia>
                                <Avatar className="size-10">
                                  <AvatarImage src={item.avatarUrl} />
                                  <AvatarFallback>ER</AvatarFallback>
                                </Avatar>
                              </ItemMedia>
                              <ItemContent>
                                <ItemTitle className="text-white">
                                  {item.name}
                                </ItemTitle>
                                <ItemDescription className="text-gray-400">
                                  {item.isPrivate ? "PRIVATE" : "PUBLIC"}
                                </ItemDescription>
                              </ItemContent>
                            </ComboboxItem>
                          )}
                        </ComboboxList>
                      </ComboboxContent>
                    </Combobox>
                    <FieldDescription>Select atleast two profiles</FieldDescription>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              {!isAllowed && (
                <Field className="mt-4">
                  <Button
                    disabled={groupChat.isPending}
                    type="submit"
                    className="w-full max-w-sm bg-blue-600 hover:bg-blue-500 text-white"
                  >
                    Continue
                  </Button>
                </Field>
              )}
            </form>
          </FieldGroup>
        </FieldSet>
      )}
    </>
  );
}
