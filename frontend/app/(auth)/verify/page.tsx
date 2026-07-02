"use client"
import { Spinner } from "@/components/ui/spinner";
import EmailVerify from "@/modules/Auth/EmailVerify";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, Suspense } from "react";
import { toast } from "sonner";

function VerifyContent() {
    const router = useRouter()
    const params = useSearchParams()
    const token = params?.get('token')

    useEffect(() => {
      if (!token) {
        toast.error('You do not have token to access this route')
        router.push('/register')
        return;
      }
    }, [token, router])

    return (
        <div>
            <EmailVerify token={token!} />
        </div>
    )
}

export default function VerifyPage() {
    return (
        <Suspense fallback={<Spinner />}>
            <VerifyContent />
        </Suspense>
    )
}