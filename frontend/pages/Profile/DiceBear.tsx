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
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Spinner } from "@/components/ui/spinner";
import {
  Item,
  ItemContent,
  ItemHeader,
  ItemTitle,
} from "@/components/ui/item";
import { useMemo, useState } from "react";
import Image from "next/image";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

function avatarOptions(name: string) {
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
export default function DiceBear({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  const [name, setName] = useState("hello");
  const avatars = useMemo(() => avatarOptions(name), [name]);
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
            <Field>
              <FieldLabel htmlFor="input-button-group">Search</FieldLabel>
              <ButtonGroup>
                <InputGroupInput>
                  <Input
                    id="input-button-group"
                    placeholder="Type to search..."
                  />
                  {
                    <InputGroupAddon align="inline-end">
                      <Spinner />
                    </InputGroupAddon>
                  }
                </InputGroupInput>
                <Button variant="outline">Search</Button>
              </ButtonGroup>
            </Field>
          </FieldGroup>
          {avatars && (
            <RadioGroup className="grid grid-cols-4 gap-4 w-full">
              {avatars.map((avatar, index) => (
                <Item key={index} variant={"outline"}>
                  <FieldLabel htmlFor={`radio-${index}`}>
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
                  </FieldLabel>
                </Item>
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
