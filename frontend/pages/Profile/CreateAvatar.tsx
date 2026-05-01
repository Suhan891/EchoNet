"use client";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Item, ItemContent, ItemHeader, ItemTitle } from "@/components/ui/item";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { avatarType, searchSchema, searchType } from "@/validations/profile/create.avatar";
import { profileType } from "@/validations/profile/create.profile";
import { avataaars, bottts, lorelei, pixelArt } from "@dicebear/collection";
import { createAvatar, Style } from "@dicebear/core";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useMemo, useState } from "react";
import {
  Control,
  Controller,
  Path,
  SubmitHandler,
  useForm,
  useWatch,
} from "react-hook-form";

interface CreateAvatarProps<T extends avatarType | profileType> {
  control: Control<T>;
  isUpdate: boolean;
}

function avatarOptions(name: string | undefined) {
  if (!name) return null;
  const styles: Style<object>[] = [lorelei, bottts, avataaars, pixelArt];
  return styles.map((style) => {
    return createAvatar(style, {
      seed: name,
      randomizeIds: true,
      size: 128,
    }).toDataUri();
  });
}
export default function CreateAvatar<T extends avatarType | profileType>({ control, isUpdate }: CreateAvatarProps<T>) {
  const [submittedName, setSubmittedName] = useState<string>();
  const {
    control: searchControl,
    register,
    handleSubmit: handleSearchSubmit,
    formState: { errors },
  } = useForm<searchType>({
    resolver: zodResolver(searchSchema),
  });
  const searchWatch = useWatch({
    control: searchControl,
    defaultValue: {
      name: "",
    },
  });
  const canSearch = !searchWatch.name;
  const onSearchSubmit: SubmitHandler<searchType> = (data) => {
    //console.log(data);
    setSubmittedName(data.name);
    // How to make a call to avatar options functions to get data
  };
  const avatars = useMemo(() => avatarOptions(submittedName), [submittedName]);
  return (
    <FieldSet>
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="input-button-group">Search</FieldLabel>
          <ButtonGroup>
            <Input
              id="input-button-group"
              placeholder="Type to search..."
              {...register("name", { required: true })}
            />
            <Button
              variant="outline"
              disabled={canSearch}
              type="button"
              onClick={handleSearchSubmit(onSearchSubmit)}
            >
              Search
            </Button>
          </ButtonGroup>
        </Field>
        {errors.name && <FieldError errors={[errors.name]} />}
      </FieldGroup>
      {avatars && (
        <FieldGroup>
          <Controller
            control={control}
            name={(isUpdate ? "avatarUrl" : "avatar.avatarUrl") as Path<T>}
            render={({ field, fieldState }) => (
              <FieldSet>
                <FieldLegend>Select a avatar</FieldLegend>
                <FieldDescription>
                  Atleast a item has to be selected
                </FieldDescription>
                <RadioGroup
                  name={field.name}
                  value={field.value as string}
                  onValueChange={field.onChange}
                  aria-invalid={fieldState.invalid}
                  className="grid grid-cols-4 gap-4 w-full"
                >
                  {avatars.map((avatar, index) => (
                    <FieldLabel key={index} htmlFor={`radio-${index}`}>
                      <Item
                        variant={"outline"}
                        aria-invalid={fieldState.invalid}
                      >
                        <ItemHeader>
                          <Image
                            src={avatar}
                            width={128}
                            alt={`Generated avatar ${index}`}
                            height={128}
                            className="aspect-square w-full rounded-sm object-cover"
                          />
                        </ItemHeader>
                        <ItemContent>
                          <ItemTitle>
                            <RadioGroupItem
                              value={avatar}
                              id={`radio-${index}`}
                              aria-invalid={fieldState.invalid}
                            />
                          </ItemTitle>
                        </ItemContent>
                      </Item>
                    </FieldLabel>
                  ))}
                </RadioGroup>
              </FieldSet>
            )}
          />
        </FieldGroup>
      )}
    </FieldSet>
  );
}
