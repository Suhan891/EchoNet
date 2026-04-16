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

export default function FollowerTab({
  followerOpen,
  setFollowerOpen,
}: {
  followerOpen: boolean;
  setFollowerOpen: (followerOpen: boolean) => void;
}) {
  const followers = useFollowStore(state => state.followers)

  return (
    <div className="flex flex-col gap-4">
      <CommandDialog open={followerOpen} onOpenChange={setFollowerOpen}>
        <Command>
          <CommandInput placeholder="Enter a name to search..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Suggestions">
              {followers?.map((follower) => (
                <CommandItem key={follower.id}>
                  <Avatar>
                    <AvatarImage
                      src={follower.follower.avatarUrl}
                      alt={follower.follower.name.slice(0, 1).toUpperCase()}
                    />
                    <AvatarFallback>
                      {follower.follower.name.slice(0, 1).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span>{follower.follower.name}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </CommandDialog>
    </div>
  );
}
