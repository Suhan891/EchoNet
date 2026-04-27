"use client";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { createAvatar, Style } from "@dicebear/core";
import { lorelei, bottts, avataaars, pixelArt } from "@dicebear/collection";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
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
import { useMemo, useState } from "react";
import Image from "next/image";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Controller, SubmitHandler, useForm, useWatch } from "react-hook-form";
import {
  avatarSchema,
  avatarType,
  searchSchema,
  searchType,
} from "@/validations/profile/create.avatar";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "lucide-react";

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
console.log(avatarOptions("hello"));
export default function CreateAvatar({
  open,
  setOpen
}: {
  open: boolean;
  setOpen: (open:boolean) => void

}) {
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
    console.log(data);
    setSubmittedName(data.name);
    // How to make a call to avatar options functions to get data
  };
  const { control, handleSubmit } = useForm<avatarType>({
    resolver: zodResolver(avatarSchema),
    mode: "onSubmit",
    defaultValues: {
      avatar: "",
    },
  });
  const onSubmit: SubmitHandler<avatarType> = (data) => {
    console.log(data);
  };
  const avatars = useMemo(() => avatarOptions(submittedName), [submittedName]);
  console.log(avatars);
  return (
    <Drawer onOpenChange={setOpen} open={open}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DrawerContent>
          <div className="mx-auto w-full max-w-sm">
            <DrawerHeader>
              <DrawerTitle>Select Avatar</DrawerTitle>
              <DrawerDescription>Select the best</DrawerDescription>
            </DrawerHeader>
            <FieldGroup>
              
                <Field>
                  <FieldLabel htmlFor="input-button-group">Search</FieldLabel>
                  <ButtonGroup>
                    <Input
                      id="input-button-group"
                      placeholder="Type to search..."
                      {...register("name")}
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
             
              {errors.name ? (
                <FieldError errors={[errors.name]} />
              ) : (
                <FieldDescription>
                  Enter a minimum 3 characters name
                </FieldDescription>
              )}
            </FieldGroup>
            {avatars && (
              <FieldGroup>
                <Controller
                  control={control}
                  name="avatar"
                  render={({ field, fieldState }) => (
                    <FieldSet>
                      <FieldLegend>Select a avatar</FieldLegend>
                      <FieldDescription>
                        Atleast a item has to be selected
                      </FieldDescription>
                      <RadioGroup
                        name={field.name}
                        value={field.value}
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
            <DrawerFooter>
              <Button type="submit">Submit</Button>
              <DrawerClose asChild>
                <Button variant={"outline"}>Cancel</Button>
              </DrawerClose>
            </DrawerFooter>
          </div>
        </DrawerContent>
      </form>
    </Drawer>
  );
}
