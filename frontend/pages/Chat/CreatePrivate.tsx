import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import {
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { Spinner } from "@/components/ui/spinner";
import { useAllProfileForPrivate } from "@/hooks/useChat";
import { CreateChatDto } from "@/types/chat";
import { privateSchema, privateType } from "@/validations/chats/create.private";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, SubmitHandler, useForm, useWatch } from "react-hook-form";

export default function CreatePrivate() {
  const { data, isSuccess, isLoading, isError, error } =
    useAllProfileForPrivate();

  const { control, handleSubmit} = useForm<privateType>({
    resolver: zodResolver(privateSchema),
    defaultValues: {
      profile: ""
    }
  });
  const watch = useWatch({
    control,
    defaultValue: {
      profile: "",
    },
  });
  const isSelected = !!watch.profile;

  const onSubmit: SubmitHandler<privateType> = (data) => {
    console.log(data);
  };

  if (isLoading) return <Spinner className="size-6" />;
  if (isError) return <div>Error: {error.message}</div>;

  return (
    <>
      {isSuccess && (
        <FieldSet className="flex flex-col gap-4 max-w-lg">
          <div>
            <FieldLabel className="text-lg text-white font-semibold">
              Private Chat
            </FieldLabel>
            <FieldDescription className="text-sm text-gray-400">
              Select a profile to start a private conversation
            </FieldDescription>
          </div>
          <FieldGroup>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Controller
                name={"profile"}
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <Combobox
                      items={data.data.map((item) => item) || []}
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <ComboboxInput
                        placeholder="Select a Profile"
                        showClear
                        aria-invalid={fieldState.invalid}
                        className="w-full"
                      />
                      <ComboboxContent>
                        <ComboboxEmpty>No profile found.</ComboboxEmpty>
                        <ComboboxList>
                          {(item: CreateChatDto) => (
                            <ComboboxItem key={item.id} value={item.name}>
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
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              {isSelected && (
                <Field className="mt-4">
                  <Button
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
