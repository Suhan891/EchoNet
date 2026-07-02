"use client";
import { Button } from "@/components/ui/button";
import { useProfileStore } from "@/stores/ProfileStore";
import { useState } from "react";
import { cn } from "@/lib/utils";
import UpdateProfile from "./UpdateProfile";
import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { useUserStore } from "@/stores/UserStore";
import ImageDropdown from "./ImageDropdown";
import { FollowDto, FollowType } from "@/types/follow.type";
import Follow from "../Profiles/Follow";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePrivacy } from "@/hooks/useProfile";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

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

  const userId = useUserStore((state) => state.userId);
  const queryClient = useQueryClient();

  const handleFollow = (type: FollowType) => {
    setFollow({
      id: profileId,
      type,
    });
    setOpen(!open);
  };
  const privacy = usePrivacy();
  const handlePrivacy = (type: "PUBLIC" | "PRIVATE") => {
    if ((isPrivate && type === "PRIVATE") || (!isPrivate && type === "PUBLIC"))
      return;
    privacy.mutate(undefined, {
      onSuccess: (result) => {
        toast.success(result.message);
        queryClient.invalidateQueries({ queryKey: [userId] });
      },
      onError: (errors) => {
        toast.error(errors.message);
        console.error(errors.error);
      },
    });
  };

  const isStory = !!story || !!pendingStoryJobs;
  return (
<div className="relative max-w-3xl mx-auto p-4 md:p-8 text-foreground font-sans">
  <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-10">
    <ImageDropdown name={name} isStory={isStory}>
      <Button
        className={cn(
          "shrink-0 rounded-full transition-all duration-200 border-none bg-transparent p-0 mt-12",
          isStory ? "border-[4px] border-amber-500 p-1 hover:scale-105" : "border-transparent"
        )}
      >
        {/*
          1. CREATE A WRAPPER DIV
          2. MOVE POSITIONING/SIZING CLASSES TO THE DIV
        */}
        <div className="relative w-24 h-24 md:w-32 md:h-32">
          {/*
            3. RESIZE THE AVATAR TO FILL THE DIV
          */}
          <Avatar className="w-full h-full">
            <AvatarImage
              width={"auto"}
              src={avatarUrl}
              alt="Profile Image"
              className="object-cover"
            />
            <AvatarFallback>{name.charAt(0) || "U"}</AvatarFallback>
          </Avatar>

          {/*
            4. MOVE THE BADGE OUTSIDE THE AVATAR TAGS
            5. ADD z-10 (OPTIONAL, but guarantees layering)
          */}
          <AvatarBadge className="z-10 absolute bottom-1 right-1 md:bottom-2 md:right-2 w-6 h-6 md:w-8 md:h-8 rounded-full border-4 border-background bg-green-600 dark:bg-green-800" />
        </div>
      </Button>
    </ImageDropdown>

        <div className="flex flex-col items-center md:items-start gap-4 flex-1">
          <div className="flex flex-col items-center md:items-start space-y-2">
            <div className="flex items-center gap-12">
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                {name}
              </h1>
              <Select
                defaultValue={isPrivate ? "PRIVATE" : "PUBLIC"}
                disabled={privacy.isPending}
                onValueChange={(value: "PRIVATE" | "PUBLIC") =>
                  handlePrivacy(value)
                }
              >
                <SelectTrigger className="w-28 h-8">
                  <SelectValue placeholder="Select a fruit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Privacy</SelectLabel>
                    <SelectItem value="PRIVATE">Private</SelectItem>
                    <SelectItem value="PUBLIC">Public</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <p className="text-muted-foreground text-center md:text-left max-w-md whitespace-pre-line">
              {bio}
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
              <Button
                variant={followings.length ? "outline" : "ghost"}
                disabled={followings.length === 0}
                onClick={() => handleFollow("FOLLOWING")}
              >
                <span className="font-semibold mr-1">{followings.length}</span>{" "}
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
    </div>
  );
}
