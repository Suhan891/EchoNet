"use client";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useFollowStore } from "@/stores/FollowStore";

export default function FollowingTab({
  followingOpen,
  setFollowingOpen,
}: {
  followingOpen: boolean;
  setFollowingOpen: (followingOpen: boolean) => void;
}) {
  const followings = useFollowStore(state => state.followings)

  return (
    <div className="flex flex-col gap-4">
      <CommandDialog open={followingOpen} onOpenChange={setFollowingOpen}>
        <Command>
          <CommandInput placeholder="Enter a name to search..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Suggestions">
              {followings?.map((following) => (
                <CommandItem key={following.id}>
                  <Avatar>
                    <AvatarImage
                      src={following.following.avatarUrl}
                      alt={following.following.name.slice(0, 1).toUpperCase()}
                    />
                    <AvatarFallback>
                      {following.following.name.slice(0, 1).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span>{following.following.name}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </CommandDialog>
    </div>
  );
}
