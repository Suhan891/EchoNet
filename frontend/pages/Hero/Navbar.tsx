import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useProfileStore } from "@/stores/ProfileStore";
import { useUserStore } from "@/stores/UserStore";
import { Bell, LogOut, Moon, Sun, User } from "lucide-react";
import { useTheme } from "next-themes";
import React from "react";
import { useShallow } from "zustand/react/shallow";

export default function Navbar() {
  const { setTheme } = useTheme();
  const { username, email } = useUserStore(
    useShallow((state) => ({
      username: state.username,
      email: state.email,
    })),
  );
  const avatarUrl = useProfileStore(state => state.avatarUrl)
  const name = useProfileStore(state => state.name)
  return (
    <nav className="bg-transparent w-full border  dark:border backdrop-blur-2xl flex justify-between top-0 sticky z-5 px-10 py-3 pb-5">
      <SidebarTrigger />
      <section className="bg-blend-color-burn-200 w-20 gap-3 rounded-xl border-0 flex justify-evenly mr-10">
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
            <Button variant={"ghost"}>
              <Bell size={10} />
            </Button>
          </DropdownMenuTrigger>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
              <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setTheme("light")}>
              Light
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("dark")}>
              Dark
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("system")}>
              System
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant={"ghost"}>
              <User size={30} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuGroup>
              <DropdownMenuLabel>
                <h3 className="text-xl">{username || "name"}</h3>
                <p>{email || "no@gmail.com"}</p>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="">
                <Avatar>
                  <AvatarImage
                    src={avatarUrl ?? 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80'}
                    alt="Profile Image"
                    width={10}
                  />
                  <AvatarFallback>SP</AvatarFallback>
                </Avatar>
                <span className="text-xl">{name}</span>
              </DropdownMenuItem>
              <DropdownMenuItem variant="destructive">
                <LogOut className="h-[1.2rem] w-[1.2rem] mr-3" /> Logout
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </section>
    </nav>
  );
}
