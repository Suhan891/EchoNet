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
import UpdateAvatar from "./UpdateAvatar";
import { useDeleteStory } from "@/hooks/useStory";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { useUserStore } from "@/stores/UserStore";
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
  const [openUpdateAvatar, setUpdateOpenAvatar] = useState(false);
  const queryClient = useQueryClient();
  const story = useDeleteStory();
  const userId = useUserStore((state) => state.userId);
  function DeleteStory() {
    story.mutate(undefined, {
      onSuccess: (result) => {
        toast.success(result.message);
        queryClient.invalidateQueries({
          queryKey: [userId],
        });
      },
      onError: (error) => {
        toast.error(error.message);
        console.error(error.error);
      },
    });
  }
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
              <DropdownMenuItem onClick={() => setUpdateOpenAvatar(true)}>
                Update
              </DropdownMenuItem>
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
                  <DropdownMenuItem
                    variant={"destructive"}
                    onClick={() => DeleteStory()}
                  >
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
      {openUpdateAvatar && (
        <UpdateAvatar open={openUpdateAvatar} setOpen={setUpdateOpenAvatar} />
      )}
    </DropdownMenu>
  );
}
