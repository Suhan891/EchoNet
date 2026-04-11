import { useVerify } from "@/hooks/useAuth";
import { VerifySchema, VerifyType } from "@/validations/auth/verify";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";

export default function EmailVerify({token}:{token: string}) {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
      } = useForm<VerifyType>({
        resolver: zodResolver(VerifySchema),
        mode: "onSubmit",
        defaultValues: {
          token,
          name: "",
          bio: "",
        },
      });
      const verify = useVerify();
      const onSubmit: SubmitHandler<VerifyType> = () => {}
    return (
        <div>Email Verify</div>
    )
}