"use client";
import { ChevronUp, CloudBackup, Plus } from "lucide-react";
import Cookie from "js-cookie";
import { Trash2Icon } from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "./ui/sidebar";
import Link from "next/link";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { items } from "@/utils/bar.icons";
import { useUserStore } from "@/stores/UserStore";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { usePathname, useRouter } from "next/navigation";
import CreateProfile from "@/pages/Profile/CreateProfile";
import { useRemoveProfile, useToggleProfile } from "@/hooks/useProfile";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/utils/query.key";

function AppSidebar() {
  const pathname = usePathname();
  const profiles = useUserStore((state) => state.profiles);

  const toggleProfile = useToggleProfile();
  const queryClient = useQueryClient();

  const activeProfile = profiles.find((profile) => profile.isActive === true);
  const name = activeProfile?.name;
  const avatarUrl = activeProfile?.avatarUrl;
  const router = useRouter();

  const handleActivate = (profileId: string) => {
    toggleProfile.mutate(profileId, {
      onSuccess: (result) => {
        console.log(result.data);
        Cookie.set("profile", profileId, { expires: 7, path: "/" });
        toast.success(result.message);
        queryClient.invalidateQueries();
      },
      onError: (errors) => {
        console.error(errors.error);
        toast.error(errors.message);
      },
    });
  };

  const removeProfile = useRemoveProfile();

  const handleRemove = (id: string) => {
    removeProfile.mutate(id, {
      onSuccess: (result) => {
        console.log(result.data);
        toast.success(result.message);
      },
      onError: (err) => {
        console.error(err.error)
        toast.error(err.message);
      },
      onSettled: () => queryClient.invalidateQueries({queryKey: [queryKeys.USER]})
    })
  }

  const inactiveProfiles = profiles.filter(
    (profile) => profile.id !== activeProfile?.id,
  );
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href={"/"} className="flex items-center gap-2">
                <Image src={"/vercel.svg"} alt="logo" width={20} height={20} />
                <span className="font-semibold">EchoNet</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    size="lg"
                    isActive={pathname === item.url}
                    className="transition-all duration-200"
                    onClick={() => router.push(item.url)}
                  >
                    <item.icon size={20} className="shrink-0" />
                    <span className="font-medium truncate">{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  <Avatar>
                    <AvatarImage
                      src={avatarUrl}
                      alt="Profile Image"
                      width={10}
                    />
                    <AvatarFallback>
                      <CloudBackup />
                    </AvatarFallback>
                  </Avatar>{" "}
                  {name} <ChevronUp className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="p-3">
                {inactiveProfiles &&
                  inactiveProfiles.map((profile) => (
                    <DropdownMenuSub key={profile.id}>
                      <DropdownMenuSubTrigger className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage
                            src={profile.avatarUrl}
                            alt="Profile Image"
                          />
                          <AvatarFallback>
                            <CloudBackup />
                          </AvatarFallback>
                        </Avatar>
                        <span>{profile.name}</span>
                      </DropdownMenuSubTrigger>

                      <DropdownMenuSubContent>
                        <DropdownMenuItem
                          onClick={() => handleActivate(profile.id)}
                        >
                          Activate
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />

                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <DropdownMenuItem
                                onSelect={(e) => e.preventDefault()}
                                variant="destructive"
                                className="text-red-500 focus:text-red-500"
                                disabled={removeProfile.isPending}
                              >
                                Delete
                              </DropdownMenuItem>
                            </AlertDialogTrigger>
                            <AlertDialogContent size="sm">
                              <AlertDialogHeader>
                                <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
                                  <Trash2Icon />
                                </AlertDialogMedia>
                                <AlertDialogTitle>Delete Profile</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This shall remove all posts and story with the profile
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel variant="outline">
                                  Cancel
                                </AlertDialogCancel>
                                <AlertDialogAction variant="destructive" onClick={() => handleRemove(profile.id)}>
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                      </DropdownMenuSubContent>
                    </DropdownMenuSub>
                  ))}
                {inactiveProfiles.length !== 0 && <DropdownMenuSeparator />}
                <CreateProfile>
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    <Plus className="mr-2" size={16} /> Add a Profile{" "}
                  </DropdownMenuItem>
                </CreateProfile>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

export default AppSidebar;
