import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useProfileStore } from "@/stores/ProfileStore";
import { useUserStore } from "@/stores/UserStore";
import { ChatDto } from "@/types/chat";
import { usePathname, useRouter } from "next/navigation";

export default function AllChats({ chats }: { chats: ChatDto[] }) {

  const id = useProfileStore((state) => state.id);
  const onlineUers = useUserStore((state) => state.onlineProfiles);
  const router = useRouter()

    const pathname = usePathname();
  return (
   <ScrollArea className="h-full w-full pr-4 pb-20 ">
      {chats.map((chat) => {
        const otherMembers = chat.chat.members.find(
          (member) => member.profile.id !== id,
        );
        const avatarUrl = otherMembers?.profile.avatarUrl ?? "";
        const isOnline = onlineUers.includes(otherMembers?.profile.id ?? "");
        const isChat = `/chats/${chat.chat.id}` === pathname;
        return (
          <Item className={`border border-gray-200 dark:border-white/10 bg-transparent hover:bg-gray-100 dark:hover:bg-white/5 transition-colors p-3 mb-2 rounded-xl ${isChat ? "border-2 bg-card text-card-foreground shadow-md border-primary/50 transition-all": "cursor-pointer"}`} key={chat.chat.id} onClick={() => router.push(`/chats/${chat.chat.id}`)}>
            <ItemMedia>
              <Avatar className="size-10">
                <AvatarImage
                  src={
                    chat.chat.type === "GROUP" ? chat.chat.mediaUrl : avatarUrl
                  }
                />
                <AvatarFallback>G</AvatarFallback>
                {chat.chat.type === "PRIVATE" && (
                  <AvatarBadge
                    className={
                      isOnline
                        ? "bg-green-600 dark:bg-green-800"
                        : "bg-gray-600 dark:bg-gray-800"
                    }
                  />
                )}
              </Avatar>
            </ItemMedia>
            <ItemContent>
              <ItemTitle className="text-gray-900 dark:text-white font-medium text-sm">
                {chat.chat.type === "GROUP"
                  ? chat.chat.name
                  : otherMembers?.profile.name}
              </ItemTitle>
              <ItemDescription>
                {chat.chat.type}
              </ItemDescription>
            </ItemContent>
          </Item>
        );
      })}
    </ScrollArea>
  );
}
