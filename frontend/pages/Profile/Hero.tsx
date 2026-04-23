"use client";
import { Button } from "@/components/ui/button";
import { useProfileStore } from "@/stores/ProfileStore";
import { useState } from "react";
import { useShallow } from "zustand/react/shallow";
import FollowerTab from "./Followers";
import FollowingTab from "./Following";
import { cn } from "@/lib/utils";
import UpdateProfile from "./UpdateProfile";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import CreateStory from "../Story/CreateStory";
import Create from "../Story/Create";

export default function ProfileHero() {
  const [followerOpen, setFollowerOpen] = useState(false);
  const [followingOpen, setFollowingOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [createStoryOpen, setCreateStoryOpen] = useState(false);
  const { name, bio, avatarUrl, followers, followings, story } =
    useProfileStore(
      useShallow((state) => ({
        id: state.id,
        avatarUrl: state.avatarUrl,
        name: state.name,
        bio: state.bio,
        followers: state.followers,
        followings: state.followings,
        story: state.story,
      })),
    );
  return (
    <div className="relative max-w-3xl mx-auto p-4 md:p-8 text-foreground font-sans">
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-10">
        {/* Avatar Section */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              //disabled={!storyId}
              className={cn(
                "shrink-0 rounded-full transition-all duration-200 border-none bg-transparent p-0 mt-12",
                story &&
                  "ring-2 ring-offset-2 ring-offset-background ring-amber-500 hover:scale-105 cursor-pointer",
              )}
            >
              <Avatar className="w-24 h-24 md:w-32 md:h-32">
                <AvatarImage
                  width={"auto"}
                  src={
                    avatarUrl ??
                    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80"
                  }
                  alt="Profile Image"
                  className="object-cover"
                />
                <AvatarFallback>{name?.charAt(0) || "U"}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align={"center"}>
            <DropdownMenuItem>{name || "Unknown"}</DropdownMenuItem>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>Avatar</DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  <DropdownMenuItem>View</DropdownMenuItem>
                  <DropdownMenuItem>Update</DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>Story</DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  {story ? (
                    <>
                      <DropdownMenuItem>
                        <Link href={"/profile/story"}>View</Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>Update</DropdownMenuItem>
                      <DropdownMenuItem variant={"destructive"}>
                        Delete
                      </DropdownMenuItem>
                    </>
                  ) : (
                    <DropdownMenuItem onClick={() => setCreateStoryOpen(true)}>
                      Add
                    </DropdownMenuItem>
                  )}
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
          </DropdownMenuContent>
        </DropdownMenu>
        {createStoryOpen && (
          <Create open={createStoryOpen} setOpen={setCreateStoryOpen} />
        )}

        <div className="flex flex-col items-center md:items-start gap-4 flex-1">

          <div className="flex flex-col items-center md:items-start space-y-2">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              {name || "name"}
            </h1>
            <p className="text-muted-foreground text-center md:text-left max-w-md whitespace-pre-line">
              {bio || "Bio shall be here"}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-2">
            <UpdateProfile open={editOpen} setOpen={setEditOpen}>
              <Button
                variant="secondary"
                type={"button"}
                onClick={() => setEditOpen(true)}
              >
                Edit Profile
              </Button>
            </UpdateProfile>

            <div className="flex items-center gap-2">
              <Button
                variant={followers ? "outline" : "ghost"}
                disabled={!followers}
                onClick={() => setFollowerOpen(true)}
              >
                <span className="font-semibold mr-1">{followers}</span>{" "}
                Followers
              </Button>
              {followerOpen && (
                <FollowerTab
                  followerOpen={followerOpen}
                  setFollowerOpen={setFollowerOpen}
                />
              )}
              <Button
                variant={followings ? "outline" : "ghost"}
                disabled={!followings}
                onClick={() => setFollowingOpen(true)}
              >
                <span className="font-semibold mr-1">{followings}</span>{" "}
                Following
              </Button>
              {followingOpen && (
                <FollowingTab
                  followingOpen={followingOpen}
                  setFollowingOpen={setFollowingOpen}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
