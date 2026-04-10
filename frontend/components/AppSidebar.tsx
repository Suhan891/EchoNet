import { ChevronUp, Plus } from "lucide-react";
import React from "react";
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
import { useProfileStore } from "@/stores/ProfileStore";
import { useShallow } from "zustand/react/shallow";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { usePathname } from "next/navigation";

function AppSidebar() {
  const pathname = usePathname();
  const profiles = useUserStore((state) => state.profiles);
  const { name, id, avatarUrl } = useProfileStore(
    useShallow((state) => ({
      id: state.id,
      name: state.name,
      avatarUrl: state.avatarUrl,
    })),
  );

  const inactiveProfiles = profiles.filter((profile) => profile.id !== id);
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
                      src={
                        avatarUrl ||
                        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80"
                      }
                      alt="Profile Image"
                      width={10}
                    />
                    <AvatarFallback>SP</AvatarFallback>
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
                            src={
                              profile.avatarUrl ||
                              "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80"
                            }
                            alt="Profile Image"
                          />
                          <AvatarFallback>SP</AvatarFallback>
                        </Avatar>
                        <span>{profile.name}</span>
                      </DropdownMenuSubTrigger>

                      <DropdownMenuSubContent>
                        <DropdownMenuItem
                          variant="destructive"
                          className="text-red-500 focus:text-red-500"
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuSubContent>
                    </DropdownMenuSub>
                  ))}
                {inactiveProfiles.length !== 0 && <DropdownMenuSeparator />}
                <DropdownMenuItem>
                  <Plus className="mr-2" size={16} /> Add a Profile{" "}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

export default AppSidebar;
