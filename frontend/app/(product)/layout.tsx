"use client";
import AppSidebar from "@/components/AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Spinner } from "@/components/ui/spinner";
import { useUserDetails } from "@/features/Auth/user.details";
import Navbar from "@/pages/Hero/Navbar";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isUserDetailsLoaded = useUserDetails();

  if(!isUserDetailsLoaded) return <div className="h-screen w-screen flex justify-center items-center"><Spinner className="size-8" /></div>
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex flex-col w-full background dark:background">
        <Navbar />
        {children}
      </main>
    </SidebarProvider>
  );
}
