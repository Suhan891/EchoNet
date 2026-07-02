"use client";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Spinner } from "@/components/ui/spinner";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import {
  useAddMember,
  useGroupMembers,
  useProfileGroupAdd,
} from "@/hooks/useChat";
import { useUserStore } from "@/stores/UserStore";
import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/dist/client/components/navigation";

export default function ChatMembers({
  open,
  setOpen,
  isAdmin,
  chatId,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  isAdmin: boolean;
  chatId: string;
}) {
  const [work, setWork] = useState<"VIEW" | "ADD">("VIEW");
  const {
    isLoading: viewLoading,
    isError: isViewError,
    isSuccess: isViewSuccess,
    data: viewData,
    error: viewError,
  } = useGroupMembers(chatId, work);
  const {
    data: addData,
    isSuccess: isAddSuccess,
    isLoading: addLoading,
    isError: isAddError,
    error: addError,
  } = useProfileGroupAdd(chatId, work);
  const addMemb = useAddMember();
  const queryClient = useQueryClient();
  const router = useRouter();

  const handleAddMember = (name: string) => {
    addMemb.mutate(
      { chatId, name },
      {
        onSuccess: (result) => {
          toast.success(result.message);
          queryClient.invalidateQueries({ queryKey: [chatId, "VIEW"] });
          queryClient.invalidateQueries({ queryKey: [chatId, "ADD"] });
        },
        onError: (err) => {
          console.error(err);
          toast.error(err.message);
        },
      },
    );
  };

  const onlineProfiles = useUserStore((state) => state.onlineProfiles);
  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <Command>
        <CommandInput placeholder="Search by name" />
        <CommandList>
          {addLoading ||
            (viewLoading && (
              <CommandEmpty className="flex justify-center">
                <Spinner />
              </CommandEmpty>
            ))}
          {isViewError && (
            <CommandEmpty>Some error: {viewError.message}</CommandEmpty>
          )}
          {isAddError && (
            <CommandEmpty>Some error: {addError.message}</CommandEmpty>
          )}
          {work === "VIEW" && isViewSuccess && (
            <CommandGroup heading={"Members"}>
              <CommandEmpty>No such member found</CommandEmpty>
              {viewData.data.members.map((memb) => {
                const isOnline = onlineProfiles.includes(memb.profile.id);
                return (
                  <CommandItem key={memb.id}>
                    <Item className="w-full bg-transparent border-transparent">
                      <ItemMedia onClick={() => router.push(`/profiles/${memb.profile.id}`)}>
                        <Avatar>
                          <AvatarImage src={memb.profile.avatarUrl} />
                          <AvatarFallback>
                            {memb.profile.name.charAt(0)}
                          </AvatarFallback>
                          <AvatarBadge
                            className={
                              isOnline
                                ? "bg-green-600 dark:bg-green-800"
                                : "bg-gray-600 dark:bg-gray-800"
                            }
                          />
                        </Avatar>
                      </ItemMedia>
                      <ItemContent onClick={() => router.push(`/profiles/${memb.profile.id}`)}>
                        <ItemTitle>{memb.profile.name}</ItemTitle>
                      </ItemContent>
                      {isAdmin && (
                        <ItemActions>
                          <Button>Remove</Button>
                        </ItemActions>
                      )}
                    </Item>
                  </CommandItem>
                );
              })}
              {isAdmin && (
                <CommandItem className="p-0">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setWork("ADD")}
                  >
                    Add Member
                  </Button>
                </CommandItem>
              )}
            </CommandGroup>
          )}
          {work === "ADD" && isAddSuccess && (
            <CommandGroup heading={"Group Members"}>
              <CommandEmpty>No such profile found</CommandEmpty>
              <CommandItem className="p-0">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setWork("VIEW")}
                >
                  Cancel
                </Button>
              </CommandItem>
              {addData.data.map((prof) => {
                const isOnline = onlineProfiles.includes(prof.id);
                return (
                  <CommandItem key={prof.id}>
                    <Item className="w-full bg-transparent border-transparent">
                      <ItemMedia onClick={() => router.push(`/profiles/${prof.id}`)}>
                        <Avatar>
                          <AvatarImage src={prof.avatarUrl} />
                          <AvatarFallback>{prof.name.charAt(0)}</AvatarFallback>
                          <AvatarBadge
                            className={
                              isOnline
                                ? "bg-green-600 dark:bg-green-800"
                                : "bg-gray-600 dark:bg-gray-800"
                            }
                          />
                        </Avatar>
                      </ItemMedia>
                      <ItemContent onClick={() => router.push(`/profiles/${prof.id}`)}>
                        <ItemTitle>{prof.name}</ItemTitle>
                      </ItemContent>
                      <ItemActions>
                        <Button onClick={() => handleAddMember(prof.name)}>
                          Add
                        </Button>
                      </ItemActions>
                    </Item>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          )}
        </CommandList>
      </Command>
    </CommandDialog>
  );
}
