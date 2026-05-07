import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { FollowType } from "@/types/follow.type";
import { useProfileStore } from "@/stores/ProfileStore";
import { useFollow } from "@/hooks/useFollow";
import { Spinner } from "@/components/ui/spinner";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useFollowReq } from "@/features/Common/follow.request";
import { useStore } from "@/stores/Store";
interface FollowProps {
  open: boolean;
  setOpen: (followerOpen: boolean) => void;
  type: FollowType;
  id: string;
}
export default function Follow({ open, setOpen, type, id }: FollowProps) {
  const profileId = useProfileStore((state) => state.id);
  const followings = useProfileStore((state) => state.followings);
  const {
    data: follow,
    isLoading,
    isError,
    isSuccess,
    error,
  } = useFollow(profileId, { type, id });
  const isOngoingFollow = useFollowReq()
  const setFollowReq = useStore(state => state.setFollowReq);
  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <Command>
        <CommandInput placeholder="Search by name" />
        <CommandList>
          {isLoading && (
            <CommandEmpty className="flex justify-center">
              <Spinner />
            </CommandEmpty>
          )}
          {isError && <CommandEmpty>Some error: {error.message}</CommandEmpty>}
          {isSuccess && (
            <CommandGroup heading={type}>
              {follow.data.map((f) => {
                const isFollowing =
                  (f.follower && followings.includes(f.follower.id)) ||
                  (f.following && followings.includes(f.following.id));
                return (
                  <CommandItem key={f.id}>
                    {f.follower && (
                      <Item>
                        <ItemMedia>
                          <Avatar>
                            <AvatarImage src={f.follower.avatarUrl} />
                            <AvatarFallback>
                              {f.follower.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                        </ItemMedia>
                        <ItemContent>
                          <ItemTitle>{f.follower.name}</ItemTitle>
                        </ItemContent>
                        {!isFollowing && (
                          <ItemActions>
                            <Button disabled={isOngoingFollow} onClick={() => setFollowReq({profileId: f.follower.id})}>Follow</Button>
                          </ItemActions>
                        )}
                      </Item>
                    )}
                    {f.following && (
                      <Item>
                        <ItemMedia>
                          <Avatar>
                            <AvatarImage src={f.following.avatarUrl} />
                            <AvatarFallback>
                              {f.following.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                        </ItemMedia>
                        <ItemContent>
                          <ItemTitle>{f.following.name}</ItemTitle>
                        </ItemContent>
                        {!isFollowing && (
                          <ItemActions>
                            <Button disabled={isOngoingFollow} onClick={() => setFollowReq({profileId: f.following.id})}>Follow</Button>
                          </ItemActions>
                        )}
                      </Item>
                    )}
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
