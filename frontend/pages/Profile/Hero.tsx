"use client";
import { Button } from "@/components/ui/button";
import { useProfileStore } from "@/stores/ProfileStore";
import Image from "next/image";
import { useState } from "react";
import { useShallow } from "zustand/react/shallow";
import FollowerTab from "./Followers";
import FollowingTab from "./Following";
import { cn } from "@/lib/utils";
import { UpdateProfileDialog } from "./UpdateProfile";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function ProfileHero() {
  const [followerOpen, setFollowerOpen] = useState(false);
  const [followingOpen, setFollowingOpen] = useState(false);
  const [upDialogOpen, setUpDialogOpen] = useState(false);
  const { id, name, bio, avatarUrl, followers, followings, storyId } =
    useProfileStore(
      useShallow((state) => ({
        id: state.id,
        avatarUrl: state.avatarUrl,
        name: state.name,
        bio: state.bio,
        followers: state.followers,
        followings: state.followings,
        storyId: state.storyId,
      })),
    );
  return (
<div className="relative max-w-3xl mx-auto p-4 md:p-8 text-foreground font-sans">
  <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-10">
    
    {/* Avatar Section */}
    <button
      disabled={!storyId}
      className={cn(
        "shrink-0 rounded-full transition-all duration-200 border-none bg-transparent p-0",
        storyId &&
          "ring-2 ring-offset-2 ring-offset-background ring-amber-500 hover:scale-105 cursor-pointer"
      )}
    >
      <Avatar className="w-24 h-24 md:w-32 md:h-32">
        <AvatarImage
          src={
            avatarUrl ||
            "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80"
          }
          alt="Profile Image"
          className="object-cover"
        />
        <AvatarFallback>{name?.charAt(0) || "U"}</AvatarFallback>
      </Avatar>
    </button>

    {/* Info and Actions Section */}
    <div className="flex flex-col items-center md:items-start gap-4 flex-1">
      
      {/* Name and Bio */}
      <div className="flex flex-col items-center md:items-start space-y-2">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
          {name || "name"}
        </h1>
        <p className="text-muted-foreground text-center md:text-left max-w-md whitespace-pre-line">
          {bio || "Bio shall be here"}
        </p>
      </div>

      {upDialogOpen && (
        <UpdateProfileDialog open={upDialogOpen} setOpen={setUpDialogOpen} />
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-2">
        <Button variant="secondary" onClick={() => setUpDialogOpen(true)}>
          Edit Profile
        </Button>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            disabled={!followers?.length}
            onClick={() => setFollowerOpen(true)}
          >
            <span className="font-semibold mr-1">{followers?.length || 0}</span>{" "}
            Followers
          </Button>
          
          <Button
            variant="ghost"
            disabled={!followings?.length}
            onClick={() => setFollowingOpen(true)}
          >
            <span className="font-semibold mr-1">
              {followings?.length || 0}
            </span>{" "}
            Following
          </Button>
        </div>
      </div>

    </div>
  </div>
</div>
  );
}
