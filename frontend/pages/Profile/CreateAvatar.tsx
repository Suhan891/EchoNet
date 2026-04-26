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
} from "@/components/ui/drawer";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Item, ItemContent, ItemHeader, ItemTitle } from "@/components/ui/item";
import { useMemo, useState } from "react";
import Image from "next/image";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { SubmitHandler, useForm, useWatch } from "react-hook-form";
import { searchSchema, searchType } from "@/validations/profile/create.avatar";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "lucide-react";

function avatarOptions(name: string | undefined) {
  if(!name) return null;
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
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  const [submittedName, setSubmittedName] = useState<string>()
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
  const onSubmit: SubmitHandler<searchType> = (data) => {
    console.log(data);
    setSubmittedName(data.name)
    // How to make a call to avatar options functions to get data
  };
  const avatars = useMemo(() => avatarOptions(submittedName), [submittedName]);
  console.log(avatars);
  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>Select Avatar</DrawerTitle>
            <DrawerDescription>Select the best</DrawerDescription>
          </DrawerHeader>
          <FieldGroup>
            <Form onSubmit={handleSearchSubmit(onSubmit)}>
            <Field>
              <FieldLabel htmlFor="input-button-group">Search</FieldLabel>
              <ButtonGroup>
                <Input
                  id="input-button-group"
                  placeholder="Type to search..."
                  {...register("name")}
                />
                <Button variant="outline" disabled={canSearch} type="submit">
                  Search
                </Button>
              </ButtonGroup>
            </Field>
            </Form>
            {errors.name ? (
              <FieldError errors={[errors.name]} />
            ) : (
              <FieldDescription>Enter a minimum 3 characters name</FieldDescription>
            )}
          </FieldGroup>
          {avatars && (
            <RadioGroup className="grid grid-cols-4 gap-4 w-full">
              {avatars.map((avatar, index) => (
                <FieldLabel key={index} htmlFor={`radio-${index}`}>
                  <Item variant={"outline"}>
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
                        <RadioGroupItem value="do" id={`radio-${index}`} />
                      </ItemTitle>
                    </ItemContent>
                  </Item>
                </FieldLabel>
              ))}
            </RadioGroup>
          )}
          <DrawerFooter>
            <Button>Submit</Button>
            <DrawerClose asChild>
              <Button variant={"outline"}>Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
