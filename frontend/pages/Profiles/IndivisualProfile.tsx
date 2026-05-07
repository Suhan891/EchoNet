"use client";
import { useProfileStore } from "@/stores/ProfileStore";
import { FollowDto, FollowType } from "@/types/follow.type";
import { ProfileDto } from "@/types/profiles";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Follow from "./Follow";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Lock, Plus } from "lucide-react";
import PostAndReel from "./PostReel";
import { Field } from "@/components/ui/field";
import { useStore } from "@/stores/Store";
import { useFollowReq } from "@/features/Common/follow.request";
export default function IndivisualProfile({
  profile,
}: {
  profile: ProfileDto;
}) {
  const [open, setOpen] = useState(false);
  const profileId = useProfileStore((state) => state.id);
  const followings = useProfileStore((state) => state.followings);
  const followers = useProfileStore((state) => state.followers);
  const isOngoingFollow = useFollowReq();
  const setFollowReq = useStore((state) => state.setFollowReq);
  const [follow, setFollow] = useState<FollowDto>({
    type: "FOLLOWERS",
    id: profile.id,
  });
  const handleFollow = (type: FollowType) => {
    setFollow({
      id: profile.id,
      type,
    });
    setOpen(!open);
    console.log("Profiles", profile);
  };
  const isFollowing = !!followings.includes(profile.id);
  const isAllowed = !profile.isPrivate || isFollowing;
  return (
    <main>
      <div className="relative max-w-3xl mx-auto p-4 md:p-8 text-foreground font-sans">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-10">
          <Button
            className={cn(
              "shrink-0 rounded-full transition-all duration-200 border-none bg-transparent p-0 mt-8",
              profile.story &&
                "ring-2 ring-offset-2 ring-offset-background ring-amber-500 hover:scale-105 cursor-pointer",
            )}
          >
            <Avatar className="w-24 h-24 md:w-32 md:h-32">
              <AvatarImage
                width={"auto"}
                src={profile.avatarUrl}
                alt="Profile Image"
                className="object-cover"
              />
              <AvatarFallback>{profile.name || "U"}</AvatarFallback>
            </Avatar>
          </Button>

          <div className="flex flex-col items-center md:items-start gap-4 flex-1">
            <div className="flex flex-col items-center md:items-start space-y-2">
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                {profile.name}
              </h1>
              <p className="text-muted-foreground text-center md:text-left max-w-md whitespace-pre-line">
                {profile.bio || "Bio shall be here"}
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-2">
              <div className="flex items-center gap-2">
                <Button
                  variant={profile._count.followers ? "outline" : "ghost"}
                  disabled={profile._count.followers === 0}
                  onClick={() => handleFollow("FOLLOWERS")}
                >
                  <span className="font-semibold mr-1">
                    {profile._count.followers}
                  </span>{" "}
                  Followers
                </Button>
                <Button
                  variant={profile._count.followings ? "outline" : "ghost"}
                  disabled={profile._count.followings === 0}
                  onClick={() => handleFollow("FOLLOWING")}
                >
                  <span className="font-semibold mr-1">
                    {profile._count.followings}
                  </span>{" "}
                  Following
                </Button>
              </div>
            </div>
          </div>
        </div>

        {open && (
          <Follow
            open={open}
            setOpen={setOpen}
            type={follow.type}
            id={follow.id}
          />
        )}
        <div className="flex gap-2 -ml-2.5">
          <Button variant={"secondary"}>Message</Button>
          <Button
            variant={"secondary"}
            disabled={isOngoingFollow}
            onClick={() => setFollowReq({ profileId: profile.id })}
          >
            {isFollowing ? "UnFollow" : "Follow"}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="posts" className="">
        <TabsList className="w-full max-w-4xl mx-auto flex justify-center gap-8 border-t border-border bg-transparent rounded-none h-14 p-0">
          <TabsTrigger
            value="posts"
            className="h-14 rounded-none bg-transparent px-4 py-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground border-t-2 border-transparent shadow-none data-[state=active]:text-foreground data-[state=active]:rounded-2xl transition-all"
          >
            Posts
          </TabsTrigger>
          <TabsTrigger
            value="reels"
            className="h-14 rounded-none bg-transparent px-4 py-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground border-t-2 border-transparent shadow-none data-[state=active]:text-foreground data-[state=active]:rounded-2xl transition-all"
          >
            Reels
          </TabsTrigger>
        </TabsList>
        <div className="w-full max-w-4xl mx-auto pt-4">
          <TabsContent value="posts" className="min-w-full">
            {isAllowed ? (
              <PostAndReel
                count={profile._count.posts}
                type={"POST"}
                profileId={profile.id}
              />
            ) : (
              <Empty>
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <Lock />
                  </EmptyMedia>
                  <EmptyTitle>Profile is Locked</EmptyTitle>
                  <EmptyDescription className="max-w-xs text-pretty">
                    User has to follow to view posts
                  </EmptyDescription>
                </EmptyHeader>
                <EmptyContent>
                  <Button variant="outline">
                    <Plus />
                    Follow
                  </Button>
                </EmptyContent>
              </Empty>
            )}
          </TabsContent>
          <TabsContent value="reels" className="min-w-full">
            {isAllowed ? (
              <PostAndReel
                count={profile._count.reels}
                type={"REEL"}
                profileId={profile.id}
              />
            ) : (
              <Empty>
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <Lock />
                  </EmptyMedia>
                  <EmptyTitle>Profile is Locked</EmptyTitle>
                  <EmptyDescription className="max-w-xs text-pretty">
                    User has to follow to view reels
                  </EmptyDescription>
                </EmptyHeader>
                <EmptyContent>
                  <Button variant="outline">
                    <Plus />
                    Follow
                  </Button>
                </EmptyContent>
              </Empty>
            )}
          </TabsContent>
        </div>
      </Tabs>
    </main>
  );
}
