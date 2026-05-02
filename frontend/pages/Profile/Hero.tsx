"use client";
import { Button } from "@/components/ui/button";
import { useProfileStore } from "@/stores/ProfileStore";
import { useState } from "react";
import { cn } from "@/lib/utils";
import UpdateProfile from "./UpdateProfile";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUserStore } from "@/stores/UserStore";
import ImageDropdown from "./ImageDropdown";
import { FollowDto, FollowType } from "@/types/follow.type";
import Follow from "./Follow";

export default function ProfileHero() {
  const [open, setOpen] = useState(false);
  const profileId = useProfileStore((state) => state.id);
  const [follow, setFollow] = useState<FollowDto>({
    type: "FOLLOWERS",
    id: profileId,
  });
  const [editOpen, setEditOpen] = useState(false);

  const story = useProfileStore((state) => state.story);
  const name = useProfileStore((state) => state.name);
  const avatarUrl = useProfileStore((state) => state.avatarUrl);
  const bio = useProfileStore((state) => state.bio);
  const followers = useProfileStore((state) => state.followers);
  const followings = useProfileStore((state) => state.followings);
  const isPrivate = useProfileStore((state) => state.isPrivate);
  const jobs = useUserStore((state) => state.jobs);
  const pendingStoryJobs = jobs.find((job) => job.name === "STORY");

  const handleFollow = (type: FollowType) => {
    setFollow({
      id: profileId,
      type,
    });
    setOpen(!open);
  };

  const isStory = !!story || !!pendingStoryJobs;
  return (
    <div className="relative max-w-3xl mx-auto p-4 md:p-8 text-foreground font-sans">
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-10">
        {/* Avatar Section */}
        <ImageDropdown name={name} isStory={isStory}>
          <Button
            //disabled={!storyId}
            className={cn(
              "shrink-0 rounded-full transition-all duration-200 border-none bg-transparent p-0 mt-12",
              isStory &&
                "ring-2 ring-offset-2 ring-offset-background ring-amber-500 hover:scale-105 cursor-pointer",
            )}
          >
            <Avatar className="w-24 h-24 md:w-32 md:h-32">
              <AvatarImage
                width={"auto"}
                src={avatarUrl}
                alt="Profile Image"
                className="object-cover"
              />
              <AvatarFallback>{name?.charAt(0) || "U"}</AvatarFallback>
            </Avatar>
          </Button>
        </ImageDropdown>

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
                variant={followers.length ? "outline" : "ghost"}
                disabled={followers.length === 0}
                onClick={() => handleFollow("FOLLOWERS")}
              >
                <span className="font-semibold mr-1">{followers.length}</span>{" "}
                Followers
              </Button>
              {/* {followerOpen && (
                <FollowerTab
                  followerOpen={followerOpen}
                  setFollowerOpen={setFollowerOpen}
                />
              )} */}
              <Button
                variant={followings.length ? "outline" : "ghost"}
                disabled={followings.length === 0}
                onClick={() => handleFollow("FOLLOWING")}
              >
                <span className="font-semibold mr-1">{followings.length}</span>{" "}
                Following
              </Button>
              {/* {followingOpen && (
                <FollowingTab
                  followingOpen={followingOpen}
                  setFollowingOpen={setFollowingOpen}
                />
              )} */}
            </div>

            <Button type="button" variant={"default"}>
              {isPrivate ? "Private" : "Public"}
            </Button>
          </div>
        </div>
      </div>
      {open && <Follow open={open} setOpen={setOpen} type={follow.type} id={follow.id} />}
    </div>
  );
}
