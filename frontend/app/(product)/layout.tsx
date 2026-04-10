"use client";
import { Badge } from "@/components/ui/badge";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Spinner } from "@/components/ui/spinner";
import { UserDetails } from "@/features/Auth/user.details";
import Navbar from "@/pages/Hero/Navbar";
import { useIsFetching } from "@tanstack/react-query";
import { useEffect, useState } from "react";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Based on this  it shall call loading.js => To make user understand from which component user is going =>

  // Or should be used useSuspension => from tanstack query

  // const isFetching = useIsFetching({queryKey: ['user']})
  // if(isFetching)
  //   return ()
  return (
    <SidebarProvider>
      <main className="flex flex-col w-full">
        <Navbar />
        {children}
      </main>
    </SidebarProvider>
  );
}
