import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { useCreateFolllow } from "@/hooks/useFollow";
import { useProfileStore } from "@/stores/ProfileStore";
import { useUserStore } from "@/stores/UserStore";
import type { AllProfiles } from "@/types/profiles";
import { queryKeys } from "@/utils/query.key";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function AllProfiles({ profiles }: { profiles: AllProfiles[] }) {
  const followings = useProfileStore((state) => state.followings);
  const activeProfileId = useProfileStore((state) => state.id);

  const follow = useCreateFolllow();
  const userId = useUserStore((state) => state.userId);
  const queryClient = useQueryClient();
  const router = useRouter()
  const handleProfile = (profileId: string) => {
    console.log("Profile Id CLicked", profileId);
    router.push(`/profiles/${profileId}`)
  };
  const handleFollow = (profileId: string) => {
    follow.mutate(profileId, {
      onSuccess: (result) => {
        console.log(result.data);
        toast.success(result.message);
        
        // Invalidate active user's profile and the general profiles list
        queryClient.invalidateQueries({ queryKey: [userId] });
        queryClient.invalidateQueries({ queryKey: [activeProfileId, queryKeys.PROFILE] });
        
        // Invalidate BOTH target user's and active user's follow data
        queryClient.invalidateQueries({ queryKey: [queryKeys.FOLLOW, profileId] });
        queryClient.invalidateQueries({ queryKey: [queryKeys.FOLLOW, activeProfileId] });
      },
      onError: (errors) => {
        console.error(errors.error);
        toast.error(errors.message);
      },
    });
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
                    onClick={() => handleFollow(profile.id)}
                    disabled={follow.isPending}
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
