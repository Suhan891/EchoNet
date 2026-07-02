import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldLabel,
  FieldDescription,
} from "@/components/ui/field";
import {
  InputGroup,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Spinner } from "@/components/ui/spinner";
import { useStartReset } from "@/hooks/useAuth";
import {
  startResetSchema,
  startResetType,
} from "@/validations/auth/password-reset";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowBigRight, Mail, SendHorizonal } from "lucide-react";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";

export default function ResetByEmail() {
  const { handleSubmit, register, formState: {errors}, control } = useForm<startResetType>({
    resolver: zodResolver(startResetSchema),
    mode: 'onChange',
    defaultValues: {
      email: "",
    },
  });
  const watchEmail = useWatch({
    control
  })

  const resetStart = useStartReset()
  const router = useRouter()
  const onSubmit: SubmitHandler<startResetType> = (data) => {
    resetStart.mutate(data,{
      onSuccess: (result) => {
        toast.success(result.message);
        router.push(`/reset/${result.data}`)
      },
      onError: (errors) => {
        console.error(errors.error)
        toast.error(errors.message);
      }
    })
  }
  return (
<Card className="w-full max-w-sm border-white/10 bg-[#0c0f14] shadow-2xl">
  <form onSubmit={handleSubmit(onSubmit)}>
    <CardHeader className="space-y-1">
      <CardTitle className="text-2xl text-center font-semibold tracking-tight text-white">
        Password Reset
      </CardTitle>
    </CardHeader>
    
    <CardContent className="grid gap-4">
      <Field className="space-y-2">
        <FieldLabel
          htmlFor="email"
          aria-invalid={!!errors.email}
          className="text-sm font-medium text-gray-400 ml-1"
        >
          Email
        </FieldLabel>
        
        <InputGroup className="relative">
          {/* Positioned the icon as a prefix for a cleaner look */}
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
            <Mail size={18} />
          </div>
          <InputGroupInput
            {...register("email")}
            id="email"
            type="email"
            aria-invalid={!!errors.email}
            placeholder="ram@gmail.com"
            className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-600 focus:ring-blue-500"
          />
        </InputGroup>
        
        <FieldDescription className="text-xs text-gray-500 ml-1">
          Please provide your registered email
        </FieldDescription>
      </Field>
    </CardContent>

    <CardFooter className="pt-2">
      {resetStart.isPending ? (
        <Button variant="outline" disabled className="w-full">
          <Spinner className="mr-2 h-4 w-4 animate-spin" />
          Verifying Email
        </Button>
      ) : (
        <Button 
          type="submit" 
          className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium transition-all" 
          disabled={!!errors.email || !watchEmail}
        >
          <SendHorizonal className="mr-2 h-4 w-4" /> Send Otp
        </Button>
      )}
    </CardFooter>
  </form>
</Card>
  );
}
