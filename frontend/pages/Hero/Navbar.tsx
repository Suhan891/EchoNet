import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarLabel,
  MenubarMenu,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useLogout } from "@/hooks/useAuth";
import { deleteCookie } from "@/service/common/cookies";
import { useProfileStore } from "@/stores/ProfileStore";
import { useUserStore } from "@/stores/UserStore";
import { queryKeys } from "@/utils/query.key";
import { useQueryClient } from "@tanstack/react-query";
import { BadgeCheckIcon, Bell, LogOut, Moon, Sun, User } from "lucide-react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useShallow } from "zustand/react/shallow";

export default function Navbar() {
  const { theme, setTheme } = useTheme();
  const queryClient = useQueryClient();
  const router = useRouter();
  const { username, email } = useUserStore(
    useShallow((state) => ({
      username: state.username,
      email: state.email,
    })),
  );
  const logout = useLogout();
  function onLogout() {
    logout.mutate(undefined, {
      onSuccess: (result) => {
        deleteCookie();
        queryClient.invalidateQueries({
          queryKey: [queryKeys.USER, result.data.id],
        });
        queryClient.invalidateQueries({
          queryKey: [queryKeys.PROFILE, result.data.profile[0].id], // Later key checking shall be done
        });
        toast.success(result.message);
        router.push("/login");
      },
      onError: (error) => {
        toast.error(error.message)
        console.error(error.error);
      }
    });
  }
  const avatarUrl = useProfileStore((state) => state.avatarUrl);
  const name = useProfileStore((state) => state.name);
  return (
    <nav className="sticky top-0 z-50 flex w-full items-center justify-between p-4 md:px-6 pointer-events-none">
      <div className="pointer-events-auto">
        <SidebarTrigger className="h-10 w-10 rounded-md border border-border bg-background shadow-sm" />
      </div>

      <Menubar className="pointer-events-auto h-12 gap-1 rounded-full border border-border bg-background/95 px-3 shadow-md backdrop-blur supports-[backdrop-filter]:bg-background/60">
        {/* Notifications */}
        <MenubarMenu>
          <MenubarTrigger className="cursor-pointer rounded-full p-2 focus:bg-accent data-[state=open]:bg-accent">
            <Bell className="h-5 w-5" />
          </MenubarTrigger>
        </MenubarMenu>

        <MenubarMenu>
          <MenubarTrigger className="relative cursor-pointer rounded-full p-2 focus:bg-accent data-[state=open]:bg-accent">
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </MenubarTrigger>
          <MenubarContent align="end" className="rounded-xl">
            <MenubarRadioGroup value={theme} onValueChange={setTheme}>
              <MenubarRadioItem value="light">Light</MenubarRadioItem>
              <MenubarRadioItem value="dark">Dark</MenubarRadioItem>
              <MenubarRadioItem value="system">System</MenubarRadioItem>
            </MenubarRadioGroup>
          </MenubarContent>
        </MenubarMenu>

        {/* User Profile */}
        <MenubarMenu>
          <MenubarTrigger className="cursor-pointer rounded-full p-1.5 focus:bg-accent data-[state=open]:bg-accent">
            <User className="h-5 w-5" />
          </MenubarTrigger>

          <MenubarContent align="end" className="w-64 rounded-xl p-2">
            <MenubarLabel className="pb-3 pt-2">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">
                  {username || "User Name"}
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  {email || "user@example.com"}
                </p>
              </div>
            </MenubarLabel>

            <MenubarSeparator />

            <MenubarItem className="flex cursor-pointer items-center gap-3 py-2">
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src={
                    avatarUrl ??
                    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=64&q=80"
                  }
                  alt="Profile"
                />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
              <span className="font-medium">{name || "Your Profile"}</span>
            </MenubarItem>

            <MenubarItem
              className="flex items-center gap-3 py-2 text-blue-500 focus:text-blue-600"
              disabled
            >
              <BadgeCheckIcon className="h-5 w-5" />
              <span className="text-xs font-semibold">Verified Account</span>
            </MenubarItem>

            <MenubarSeparator />

            <MenubarItem
              className="flex cursor-pointer items-center gap-3 py-2 text-destructive focus:bg-destructive/10 focus:text-destructive"
              onClick={() => onLogout()}
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    </nav>
  );
}
