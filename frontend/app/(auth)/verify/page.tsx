"use client"
import EmailVerify from "@/pages/Auth/EmailVerify";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

export default function VerifyPage () {
    const router = useRouter()
    const params = useSearchParams()
    const token = params?.get('token')
    useEffect(() => {
      if(!token){
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
