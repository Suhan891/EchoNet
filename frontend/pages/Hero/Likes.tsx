import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Suspense } from "react";
import { LikesSkeleton } from "./Skeletons";
import { useLikeViews } from "@/hooks/useLike";
import { useProfileStore } from "@/stores/ProfileStore";
import { LikeRequest } from "@/types/like&comment";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";

interface PostLikeViewProps {
  open: boolean;
  setOpen: (open: boolean) => boolean;
  count: number;
  format: LikeRequest;
}
export default function LikesView({
  open,
  setOpen,
  format,
  count,
}: PostLikeViewProps) {
  const profileId = useProfileStore((state) => state.id);
  const follwings = useProfileStore((state) => state.followings);

  const { data: likes } = useLikeViews(profileId, format);
  return (
    <Suspense fallback={<LikesSkeleton count={count} />}>
      <Drawer direction="right" open={open} onOpenChange={setOpen}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>All Liked Profiles</DrawerTitle>
            <DrawerDescription>Please check below</DrawerDescription>
          </DrawerHeader>
          {likes && (
            <div className="no-scrollbar overflow-y-auto px-4">
              <ItemGroup>
                {likes.data.map((like) => {
                  const isFollowing = follwings.includes(like.profile.id);
                  return (
                    <Item
                      key={like.profile.id}
                      size="sm"
                      className="mx-auto w-full max-w-sm"
                      variant="outline"
                      asChild
                      role="listitem"
                    >
                      <ItemMedia>
                        <Avatar>
                          <AvatarImage src={like.profile.avatarUrl} />
                          <AvatarFallback>
                            {like.profile.name.slice(0, 1)}
                          </AvatarFallback>
                        </Avatar>
                      </ItemMedia>
                      <ItemContent>
                        <ItemTitle>{like.profile.name}</ItemTitle>
                        <ItemDescription>
                          Done at:{" "}
                          {like.createdAt.toLocaleTimeString("en-GB", {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: false,
                          })}
                        </ItemDescription>
                      </ItemContent>
                      {!isFollowing && (
                        <ItemActions>
                          <Button
                            size="icon-sm"
                            variant="outline"
                            className="rounded-full"
                            aria-label="follow"
                          >
                            Follow
                          </Button>
                        </ItemActions>
                      )}
                    </Item>
                  );
                })}
              </ItemGroup>
            </div>
          )}
          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </Suspense>
  );
}
