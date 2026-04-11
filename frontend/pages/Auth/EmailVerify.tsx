import { useVerify } from "@/hooks/useAuth";
import { VerifySchema, VerifyType } from "@/validations/auth/verify";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";

export default function EmailVerify({ token }: { token: string }) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
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
  const onSubmit: SubmitHandler<VerifyType> = (data) => {
    const token = data.token;
    const formData = new FormData();
    formData.append("avatar", data.avatar);
    formData.append("bio", data.bio ?? "");
    formData.append("name", data.name);
    verify.mutate(
      { token, formData },
      {
        onError: (error) => {
            toast.error(error.message)
            console.error(error.error)
        },
        onSuccess: (result) => {
          toast.success(result.message);
          console.log(result.data);
          router.push("/login");
        },
      },
    );
  };
  return <div>Email Verify</div>;
}
