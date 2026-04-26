"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { useState } from "react";
import CreateStory from "../Story/Create";
import CreateAvatar from "./CreateAvatar";
interface ImageDropdownProps {
  children: React.ReactNode;
  name: string;
  isStory: boolean;
}
export default function ImageDropdown({
  children,
  name,
  isStory,
}: ImageDropdownProps) {
  const [createStoryOpen, setCreateStoryOpen] = useState(false);
  const [openCreateAvatar, setCreateOpenAvatar] = useState(false)
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent align={"center"}>
        <DropdownMenuItem>{name || "Unknown"}</DropdownMenuItem>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>Avatar</DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              <DropdownMenuItem>View</DropdownMenuItem>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>Update</DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                    <DropdownMenuSubContent>
                        <DropdownMenuItem>Upload</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setCreateOpenAvatar(true)}>Create</DropdownMenuItem>
                    </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>Story</DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              {isStory ? (
                <>
                  <DropdownMenuItem>
                    <Link href={"/profile/story"}>View</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Update</DropdownMenuItem>
                  <DropdownMenuItem variant={"destructive"}>
                    Delete
                  </DropdownMenuItem>
                </>
              ) : (
                <DropdownMenuItem onClick={() => setCreateStoryOpen(true)}>
                  Add
                </DropdownMenuItem>
              )}
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
      </DropdownMenuContent>
      {createStoryOpen && (
        <CreateStory open={createStoryOpen} setOpen={setCreateStoryOpen} />
      )}
      {openCreateAvatar && (
        <CreateAvatar open={openCreateAvatar} setOpen={setCreateOpenAvatar} />
      )}
    </DropdownMenu>
  );
}
