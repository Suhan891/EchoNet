"use client";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { useMyself } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const user = useMyself();

  if (user.isError) {
    toast.error("Invalid token relogin"); // After error once trial => going to fetch newtoken shall be done
    router.push("/login");
  }
  if (user.isSuccess) {
    toast.success("User details fetched");
  }
  return (
    <>
      {user.isLoading ? (
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
