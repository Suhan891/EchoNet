'use client'
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  Eye,
  EyeClosed,
  GitBranchIcon,
  Home,
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
import Hovertext from "@/components/card-hover";
import Link from "next/link";
import { SubmitHandler, useForm } from "react-hook-form";
import { RegisterSchema, RegisterType } from "@/validations/auth/register";
import { useRegister } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import { useState } from "react";

export default function Register() {
  const registers = useRegister();
  const [view, setView] = useState(false)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RegisterType>({
    resolver: zodResolver(RegisterSchema),
    mode: "onSubmit",
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });
  if(errors)
    console.log(errors)
  const onSubmit: SubmitHandler<RegisterType> = (data) => {
    registers.mutate(data, {
      onSuccess: (result) => {
        toast.success(result.message);
        console.log(result);
        reset();
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
          <CardTitle className="text-2xl mx-auto">
            Register the experience
          </CardTitle>
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
                    Please provide a valid unique email
                  </FieldDescription>
                )}
              </Field>
              <Field>
                <FieldLabel htmlFor="username" className="ps-1.5">
                  Username
                </FieldLabel>
                <InputGroup>
                  <InputGroupInput
                    {...register("username")}
                    id="username"
                    aria-invalid={!!errors.username}
                    placeholder="Ram Singh"
                  />
                  <InputGroupAddon>
                    <InputGroupButton
                      variant={"outline"}
                      disabled={true}
                      className="bg-gray-700"
                    >
                      <Home />
                    </InputGroupButton>
                  </InputGroupAddon>
                </InputGroup>
                {errors.username ? (
                  <FieldError errors={[errors.username]} />
                ) : (
                  <FieldDescription>
                    Please provide your username
                  </FieldDescription>
                )}
              </Field>
              <Field>
                <FieldLabel htmlFor="password" className="ps-1.5">
                  Password{" "}
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
                    <Button variant={"ghost"} onClick={(e) => {e.preventDefault();setView(!view);}}>
                      {view ? <Eye /> : <EyeClosed />}
                    </Button>
                  </InputGroupAddon>
                </InputGroup>
                {errors.password ? (
                  <FieldError errors={[errors.password]} />
                ) : (
                  <FieldDescription>
                    Please provide a strong password
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
            Already have an account{" "}
            <Link href={"/login"} className="hover:text-blue-500">
              SignIn
            </Link>{" "}
          </CardDescription>
        </CardContent>
        <CardFooter className="flex-col gap-2">
          {registers.isPending ? (
            <Button variant="outline" disabled>
              <Spinner data-icon="inline-start" />
              Registering
            </Button>
          ) : (
            <Button type="submit" variant={"default"} className="w-full">
              Register
            </Button>
          )}
          <CardDescription className="text-gray-600 flex px-auto">
            By registering you agree to our extensive{" "}
            <Hovertext
              title="Terms"
              description="Valid email should be provided as verification link shall be shared in inbox"
            />{" "}
            and Conditions
          </CardDescription>
      
        </CardFooter>
        </form>
      </Card>
    </div>
  );
}
