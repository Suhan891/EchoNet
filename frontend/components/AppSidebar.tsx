import { ChevronUp, CloudBackup, Plus } from "lucide-react";
import Cookie from 'js-cookie'
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
import { usePathname } from "next/navigation";
import { AlertDialogDestructive } from "./AlertDiialog";
import CreateProfile from "@/pages/Profile/CreateProfile";
import { useToggleProfile } from "@/hooks/useProfile";
import { toast } from "sonner";
import { deleteProfileCookie } from "@/service/common/cookies";
import { useQueryClient } from "@tanstack/react-query";

function AppSidebar() {
  const pathname = usePathname();
  const profiles = useUserStore((state) => state.profiles);

  const toggleProfile = useToggleProfile();
  const queryClient = useQueryClient();

  const activeProfile = profiles.find((profile) => profile.isActive === true);
  const name = activeProfile?.name;
  const avatarUrl = activeProfile?.avatarUrl;

  const handleActivate = (profileId: string) => {
    toggleProfile.mutate(profileId, {
      onSuccess: (result) => {
        console.log(result.data);
        Cookie.set("profile", profileId, { expires: 7, path: '/' });
        toast.success(result.message);
        queryClient.invalidateQueries();
      },
      onError: (errors) => {
        console.error(errors.error);
        toast.error(errors.message);
      },
    });
  };

  const inactiveProfiles = profiles.filter(
    (profile) => profile.id !== activeProfile?.id,
  );
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href={"/"}>
                <Image src={"/vercel.svg"} alt="logo" width={20} height={20} />
                <span>EchoNet</span>
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
                <SidebarMenuItem key={item.title} value={item.title}>
                  <SidebarMenuButton
                    asChild
                    size="lg"
                    isActive={pathname === item.url}
                    tooltip={item.title}
                    className="transition-all duration-200"
                  >
                    <Link
                      href={item.url}
                      className="flex items-center gap-3 w-full group-data-[collapsible=icon]:justify-center"
                    >
                      <item.icon size={20} className="shrink-0" />
                      <span className="font-medium truncate group-data-[collapsible=icon]:hidden">
                        {item.title}
                      </span>
                    </Link>
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
                    <AvatarFallback><CloudBackup /></AvatarFallback>
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
                        <AlertDialogDestructive
                          title="Delete Profile"
                          description="This shall delte all data linked with the profile"
                        >
                          <DropdownMenuItem
                            onSelect={(e) => e.preventDefault()}
                            variant="destructive"
                            className="text-red-500 focus:text-red-500"
                          >
                            Delete
                          </DropdownMenuItem>
                        </AlertDialogDestructive>
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
