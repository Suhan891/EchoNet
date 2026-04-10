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
import { useProfileStore } from "@/stores/ProfileStore";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function FollowingTab({
  followingOpen,
  setFollowingOpen,
}: {
  followingOpen: boolean;
  setFollowingOpen: (followingOpen: boolean) => void;
}) {
  // const [open, setOpen] = React.useState(false)
  const { followings } = useProfileStore((state) => ({
    followings: state.followings,
  }));

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
                      src={following.followings.avatarUrl}
                      alt={following.followings.name.slice(0, 1).toUpperCase()}
                    />
                    <AvatarFallback>
                      {following.followings.name.slice(0, 1).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span>{following.followings.name}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </CommandDialog>
    </div>
  );
}
