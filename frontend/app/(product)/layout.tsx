"use client";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { UserDetails } from "@/features/Auth/user.details";
import { useEffect, useState } from "react";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isLoading, setIsLoading] = useState(false);

  // const isUser = UserDetails();
  // useEffect(() => {
  //   if (isUser) setIsLoading(false);
  // }, [isUser]);

  return (
    <>
      {isLoading ? (
        <Badge variant="secondary">
          Loading
          <Spinner data-icon="inline-end" />
        </Badge>
      ) : (
        children
      )}
    </>
  );
}
