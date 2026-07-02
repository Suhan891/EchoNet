"use client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldLabel, FieldDescription } from "@/components/ui/field";
import { InputGroup, InputGroupInput } from "@/components/ui/input-group";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Spinner } from "@/components/ui/spinner";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  useReRequestEmail,
  useUpdatePassword,
  useValidateOtp,
} from "@/hooks/useAuth";
import {
  updatePasswordSchema,
  upPassType,
  VerifyOtpSchema,
  VerifyOtpType,
} from "@/validations/auth/password-reset";
import { zodResolver } from "@hookform/resolvers/zod";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { Eye, EyeClosed, InfoIcon, Lock, RefreshCwIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, SubmitHandler, useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";

export default function ResetPassword({ token }: { token: string }) {
  const COOLDOWN = 60;
  const [secondsLeft, setSecondsLeft] = useState(COOLDOWN);
  const [verified, setVerified] = useState<boolean>(false);
  const {
    control: otpControl,
    handleSubmit,
    formState: { errors: otpError },
  } = useForm<VerifyOtpType>({
    resolver: zodResolver(VerifyOtpSchema),
    mode: "onChange",
    defaultValues: {
      token,
    },
  });
  useEffect(() => {
    if (secondsLeft <= 0) return;

    const timer = setInterval(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [secondsLeft]);
  const reqEmail = useReRequestEmail();
  const isCoolDown = secondsLeft > 0;
  const watchOtp = useWatch({
    control: otpControl,
    defaultValue: {
      otp: "",
    },
  });
  const verifyOtp = useValidateOtp();

  const handleRequestEmail = () => {
    reqEmail.mutate(
      { token },
      {
        onSuccess: (result) => {
          toast.message(result.message);
          setSecondsLeft(COOLDOWN);
        },
        onError: (err) => {
          console.error(err.error);
          toast.error(err.message);
        },
      },
    );
  };

  const otpSubmit: SubmitHandler<VerifyOtpType> = (data) => {
    verifyOtp.mutate(data, {
      onSuccess: (result) => {
        toast.success(result.message);
        setVerified(true);
      },
      onError: (errors) => {
        console.error(errors.error);
        toast.error(errors.message);
      },
    });
  };

  const [view, setView] = useState(true);
  const upPass = useUpdatePassword();
  const {
    register,
    control,
    handleSubmit: handleUpSubmit,
    formState: { errors },
  } = useForm<upPassType>({
    resolver: zodResolver(updatePasswordSchema),
    mode: "onSubmit",
    defaultValues: {
      token,
    },
  });
  const watchPass = useWatch({
    control,
    defaultValue: {
      password: "",
    },
  });
  const router = useRouter();
  const onSubmit: SubmitHandler<upPassType> = (data) => {
    upPass.mutate(data, {
      onSuccess: (result) => {
        toast.success(result.message);
        router.push(`/login`);
      },
      onError: (err) => {
        console.error(err.error);
        toast.error(err.message);
      },
    });
  };

  return (
    <div className="min-h-screen bg-[#05070a] flex flex-col items-center justify-start pt-16 px-4 selection:bg-primary selection:text-primary-foreground gap-10 relative">
      {/* 1. Refined Alert: Centered and subtle */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 w-full max-w-md px-4">
        <Alert className="mb-6 bg-blue-950/30 border-blue-500/30 text-blue-200">
          <InfoIcon className="h-4 w-4" />
          <div>
            <AlertTitle>Reset in progress</AlertTitle>
            <AlertDescription>
              Please do not hit the refresh button
            </AlertDescription>
          </div>
        </Alert>
      </div>
      {/* 
  <h1 className="text-6xl font-bold text-white tracking-tighter mt-20">Echonet</h1> */}

      {verified ? (
        <Card className="w-full max-w-sm border-white/10 bg-[#0c0f14] shadow-2xl">
          <form onSubmit={handleUpSubmit(onSubmit)}>
            <CardHeader>
              <CardTitle className="text-2xl text-center font-semibold text-white">
                New Password
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Field className="space-y-2">
                <FieldLabel
                  htmlFor="password"
                  className="text-sm text-gray-400 ml-1"
                >
                  Set Password
                </FieldLabel>
                <InputGroup className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                    <Lock size={18} />
                  </div>
                  <InputGroupInput
                    {...register("password")}
                    id="password"
                    type={view ? "text" : "password"}
                    placeholder="••••••••"
                    className="pl-10 pr-10 bg-white/5 border-white/10 text-white"
                  />
                  <button
                    type="button"
                    onClick={() => setView(!view)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                  >
                    {view ? <Eye size={18} /> : <EyeClosed size={18} />}
                  </button>
                </InputGroup>
                <FieldDescription className="text-xs text-gray-500 ml-1">
                  Minimum 8 characters required
                </FieldDescription>
              </Field>
            </CardContent>
            <CardFooter>
              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-500"
                disabled={!watchPass.password}
              >
                {upPass.isPending ? <Spinner className="mr-2 h-4 w-4" /> : null}
                Update Password
              </Button>
            </CardFooter>
          </form>
        </Card>
      ) : (
        <Card className="w-full max-w-sm border-white/10 bg-[#0c0f14] shadow-2xl">
          <form onSubmit={handleSubmit(otpSubmit)}>
            <CardHeader>
              <CardTitle className="text-2xl text-center font-semibold text-white">
                Verify Otp
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-6">
              <Controller
                control={otpControl}
                name={"otp"}
                render={({ field, fieldState }) => (
                  <Field className="w-fit" aria-invalid={fieldState.invalid}>
                    <FieldLabel className="text-sm text-gray-400">
                      Enter 6-digit Code
                    </FieldLabel>
                    <InputOTP
                      maxLength={6}
                      pattern={REGEXP_ONLY_DIGITS}
                      {...field}
                    >
                      <InputOTPGroup className="gap-2">
                        {[0, 1, 2, 3, 4, 5].map((i) => (
                          <InputOTPSlot
                            key={i}
                            index={i}
                            className="bg-white/5 border-white/10 text-white text-xl w-12 h-14 rounded-md"
                          />
                        ))}
                      </InputOTPGroup>
                    </InputOTP>
                  </Field>
                )}
              />
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-500 hover:text-blue-400 text-xs"
                    disabled={isCoolDown}
                    onClick={handleRequestEmail}
                  >
                    <RefreshCwIcon
                      className={`mr-2 h-3 w-3 ${reqEmail.isPending ? "animate-spin" : ""}`}
                    />
                    {isCoolDown ? `Resend in ${secondsLeft}s` : "Resend Code"}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Resend the verification code to your email</p>
                </TooltipContent>
              </Tooltip>
            </CardContent>
            <CardFooter>
              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-500"
                disabled={!watchOtp.otp}
              >
                {verifyOtp.isPending ? (
                  <Spinner className="mr-2 h-4 w-4" />
                ) : (
                  "Verify OTP"
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      )}
    </div>
  );
}
