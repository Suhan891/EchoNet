import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandDialog,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { Spinner } from "@/components/ui/spinner";
import { useViewMsg } from "@/hooks/useChat";
import { useUserStore } from "@/stores/UserStore";

export default function ViewMsg({
  msgId,
  open,
  setOpen,
  count,
}: {
  msgId: string;
  open: boolean;
  setOpen: (open: boolean) => void;
  count: number;
}) {
  const { isLoading, isError, isSuccess, data, error } = useViewMsg(msgId, count);
  const onlineProfiles = useUserStore((state) => state.onlineProfiles);

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <Command>
        <CommandInput placeholder="Search by name" />
        <CommandList>
          {isLoading && <Spinner />}
          {isError && <div>Error: {error.message}</div>}
          {isSuccess &&
            data.data.msgView.map((view) => {
              const isOnline = onlineProfiles.includes(view.member.profile.id);

              return (
                <CommandItem key={view.member.profile.id}>
                  <Item className="w-full bg-transparent border-transparent">
                    <ItemMedia>
                      <Avatar>
                        <AvatarImage src={view.member.profile.avatarUrl} />
                        <AvatarFallback>
                          {view.member.profile.name.charAt(0)}
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
                    <ItemContent>
                      <ItemTitle>{view.member.profile.name}</ItemTitle>
                    </ItemContent>
                    <ItemActions>
                      <Button variant={"outline"}>{}</Button>
                    </ItemActions>
                  </Item>
                </CommandItem>
              );
            })}
        </CommandList>
      </Command>
    </CommandDialog>
  );
}
