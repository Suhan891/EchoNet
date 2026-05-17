"use client";
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
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
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
import { Amphora } from "lucide-react";

interface PostLikeViewProps {
  open: boolean;
  setOpen: (open: boolean) => void;
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

  const {
    data: likes,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useLikeViews(profileId, format, count);

  return (
    <Drawer direction="right" open={open} onOpenChange={setOpen}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>All Liked Profiles</DrawerTitle>
          <DrawerDescription>Please check below</DrawerDescription>
        </DrawerHeader>
        {!count && (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Amphora />
              </EmptyMedia>
              <EmptyTitle>No Likes</EmptyTitle>
              <EmptyDescription className="max-w-xs text-pretty">
                No profile has liked yet
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        )}
        {isLoading && <LikesSkeleton count={count} />}
        {isError && <div>Error: {error.message}</div>}
        {isSuccess && (
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
  );
}
