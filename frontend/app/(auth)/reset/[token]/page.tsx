"use client";

import ResetPassword from "@/modules/Auth/ResetPass";
import { tokenSchema } from "@/validations/auth/password-reset";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

export default function ResetPage() {
  const params = useParams();
  const router = useRouter();
  const token = params?.token as string;
  useEffect(() => {
    if (!token) {
      toast.error("You do not have token to access this route");
      router.push("/verify");
      return;
    }
    const isValid = tokenSchema.safeParse(token).success
    if(!isValid) {
      toast.error("Invalid token");
      router.push("/verify")
    }
  }, [token, router]);

  return <ResetPassword token={token} />
}
