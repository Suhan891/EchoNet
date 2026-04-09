"use client";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { useEffect, useState } from "react";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isLoading, setIsLoading] = useState(true);

  const isUser = ();
  useEffect(() => {
    if (isUser) setIsLoading(false);
  }, [isUser]);

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