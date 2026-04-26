"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldError,
  FieldDescription,
} from "@/components/ui/field";
import {
  Eye,
  EyeClosed,
  GitBranchIcon,
  Lock,
  Mail,
  RectangleGogglesIcon,
} from "lucide-react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import HoverText from "@/components/card-hover";
import Link from "next/link";
import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema, LoginType } from "@/validations/auth/login";
import { useLogin } from "@/hooks/useAuth";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";

export default function Login() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LoginType>({
    resolver: zodResolver(LoginSchema),
    mode: "onSubmit",
  });
  const login = useLogin();
  const [view, setView] = useState(true);

  const onSubmit: SubmitHandler<LoginType> = (data) => {
    login.mutate(data, {
      onSuccess: (result) => {
        toast.success(result.message);
        console.log(result);
        reset();
        router.push("/profile");
      },
      onError: (error) => {
        toast.error(error.message);
        console.error(error.error);
      },
    });
  };
  return (
    <div>
      <Card className="flex-5 w-7xl max-w-sm">
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardHeader className="w-full ">
            <CardTitle className="text-2xl mx-auto">Login to explore</CardTitle>
          </CardHeader>
          <CardContent>
            <FieldGroup>
              <Field>
                <FieldLabel
                  htmlFor="email"
                  aria-invalid={!!errors.email}
                  className="ps-1.5"
                >
                  Email
                </FieldLabel>
                <InputGroup>
                  <InputGroupInput
                    {...register("email")}
                    id="email"
                    aria-invalid={!!errors.email}
                    placeholder="ram@gmail.com"
                  />
                  <InputGroupAddon>
                    <InputGroupButton disabled={true} className="bg-gray-700">
                      <Mail />
                    </InputGroupButton>
                  </InputGroupAddon>
                </InputGroup>
                {errors.email ? (
                  <FieldError errors={[errors.email]} />
                ) : (
                  <FieldDescription>
                    Please provide your registered email
                  </FieldDescription>
                )}
              </Field>
              <Field>
                <FieldLabel htmlFor="password" className="ps-1.5">
                  Password{" "}
                  <div className="ml-auto text-sm text-amber-50 hover:text-blue-400">
                    <Link href={"#"}>Forgot password</Link>{" "}
                  </div>{" "}
                </FieldLabel>
                <InputGroup>
                  <InputGroupInput
                    {...register("password")}
                    aria-invalid={!!errors.password}
                    id="password"
                    type={view ? 'password':'text'}
                    placeholder="••••••••"
                  />
                  <InputGroupAddon>
                    <InputGroupButton disabled={true} className="bg-gray-700">
                      <Lock />
                    </InputGroupButton>
                  </InputGroupAddon>
                  <InputGroupAddon align="inline-end">
                    <Button
                      variant={"ghost"}
                      onClick={(e) => {
                        e.preventDefault();
                        setView(!view);
                      }}
                    >
                      {view ? <Eye /> : <EyeClosed />}
                    </Button>
                  </InputGroupAddon>
                </InputGroup>
                {errors.password ? (
                  <FieldError errors={[errors.password]} />
                ) : (
                  <FieldDescription>
                    Please provide your registered password
                  </FieldDescription>
                )}
              </Field>
            </FieldGroup>
          </CardContent>
          <CardContent className="w-full flex justify-center gap-2.5 my-1.5">
            <Button variant="outline" className="">
              <RectangleGogglesIcon />
              Google
            </Button>
            <Button variant="outline" className="px-1.5">
              <GitBranchIcon /> Github
            </Button>
          </CardContent>
          <CardContent className="w-full flex justify-center text-gray-800">
            <CardDescription>
              Do not have an account{" "}
              <Link href={"/register"} className="hover:text-blue-500">
                SignUp
              </Link>
            </CardDescription>
          </CardContent>
          <CardFooter className="flex-col gap-2">
            {login.isPending ? (
              <Button variant="outline" disabled>
                <Spinner data-icon="inline-start" />
                LogingIn
              </Button>
            ) : (
              <Button type="submit" variant={"default"} className="w-full">
                Login
              </Button>
            )}
            <CardDescription className="text-gray-600 flex px-auto">
              All the data are end to end encrypted.{" "}
              <HoverText
                description="No data shall go outside of this account"
              >
                <Button type="button" variant="link">Privacy</Button>
                </HoverText>
            </CardDescription>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
