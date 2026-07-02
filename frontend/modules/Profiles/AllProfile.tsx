import { Avatar, AvatarBadge, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { useFollowReq } from "@/features/Common/follow.request";
import { useProfileStore } from "@/stores/ProfileStore";
import { useStore } from "@/stores/Store";
import { useUserStore } from "@/stores/UserStore";
import type { AllProfiles } from "@/types/profiles";
import { useRouter } from "next/navigation";

export default function AllProfiles({ profiles }: { profiles: AllProfiles[] }) {
  const followings = useProfileStore((state) => state.followings);

  const onlineProfiles = useUserStore(state => state.onlineProfiles)

  //const follow = useCreateFolllow();
  const isOngoingFollow = useFollowReq();
  const setFollow = useStore((state) => state.setFollowReq);
  const router = useRouter();
  const handleProfile = (profileId: string) => {
    router.push(`/profiles/${profileId}`);
  };
  return (
    <div className="flex flex-col w-full max-w-2xl mx-auto gap-6 p-4">
      <FieldGroup className="w-full flex justify-center mb-8">
        <Field
          orientation="horizontal"
          className="w-full max-w-md mx-auto flex justify-center items-center gap-2"
        >
          <Input
            type="search"
            placeholder="Search profiles..."
            className="rounded-full bg-muted/50 w-full"
          />
          <Button className="rounded-full px-6">Search</Button>
        </Field>
      </FieldGroup>
      <ItemGroup className="flex flex-col gap-3">
        {profiles.map((profile) => {
          const isFollow = !!followings.includes(profile.id);
          const isOnline = onlineProfiles.includes(profile.id)
          return (
            <Item
              key={profile.id}
              className="flex items-center justify-between p-4 rounded-xl border bg-card text-card-foreground shadow-sm hover:shadow-md hover:border-primary/50 transition-all cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <ItemMedia onClick={() => handleProfile(profile.id)}>
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={profile.avatarUrl} />
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {profile.name.charAt(0)}
                    </AvatarFallback>
                    <AvatarBadge className={isOnline ? "bg-green-600 dark:bg-green-800" : "bg-gray-600 dark:bg-gray-800"} />
                  </Avatar>
                </ItemMedia>

                <ItemContent onClick={() => handleProfile(profile.id)}>
                  <ItemTitle className="font-semibold text-base">
                    {profile.name}
                  </ItemTitle>
                </ItemContent>
              </div>

              {!isFollow && (
                <ItemActions>
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => setFollow({ profileId: profile.id })}
                    disabled={isOngoingFollow}
                    className="rounded-full cursor-pointer"
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
  );
}
