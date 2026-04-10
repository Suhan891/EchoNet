"use client";
import { Button } from "@/components/ui/button";
import { useProfileStore } from "@/stores/ProfileStore";
import Image from "next/image";
import { useShallow } from "zustand/react/shallow";

export default function ProfileHero() {
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
    <div className="min-h-screen bg-white text-slate-950 font-sans">
      <div className="shrink-0 mx-auto md:mx-0">
        <div className="w-32 h-32 md:w-40 md:h-40 relative rounded-full overflow-hidden border border-slate-200">
          <Image
            src={avatarUrl}
            width={200}
            loading="eager"
            height={200}
            fill={true}
            className="object-cover"
            alt="Profile Image"
          />
        </div>
      </div>
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-center sm:text-left">
        <h1 className="text-xl md:text-2xl whitespace-nowrap">{name || 'name'}</h1>
        <p className="whitespace-pre-line mt-1">{bio || 'hello world'}</p>
      </div>

      <div className="hidden md:flex items-center gap-8">
        <Button variant={'default'}>{followers?.length} Followers</Button>
        <Button variant={'outline'}>{followings?.length}Following</Button>
      </div>
    </div>

    
  );
}
