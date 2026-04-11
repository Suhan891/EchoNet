"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
// Removed HoverCard and InputGroup imports as they are no longer needed for this layout
import { useVerify } from "@/hooks/useAuth";
import { VerifySchema, VerifyType } from "@/validations/auth/verify";
import { zodResolver } from "@hookform/resolvers/zod";
import { Home, Upload, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";

export default function EmailVerify({ token }: { token: string }) {
  const router = useRouter();
  const [preview, setPreview] = useState<string | null>(null);

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
          toast.error(error.message);
          console.error(error.error);
        },
        onSuccess: (result) => {
          toast.success(result.message);
          console.log(result.data);
          router.push("/login");
        },
      },
    );
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const imgUrl = URL.createObjectURL(file);
    setPreview(imgUrl);
  };

  // 1. Extract react-hook-form's onChange event
  const { onChange: formOnChange, ...avatarRegister } = register("avatar");

  return (
    <div>
      <Card className="card dark:card w-2xl">
        <CardHeader className="w-full justify-center items-center">
          <CardTitle className="text-xl pl-2.0">Email Verification</CardTitle>
          <CardDescription>Create Profile before Login</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-row gap-8 w-full items-start my-3">
              <Field className="w-1/3 shrink-0">
                <FieldLabel htmlFor="avatar" className="pl-3.5">
                  Select profile avatar
                </FieldLabel>
                <div className="ml-2">
                  <div className="relative group flex justify-center items-center w-32 h-32 rounded-full overflow-hidden mt-2 self-start aspect-square">
                    <Avatar className="w-full h-full">
                      <AvatarImage
                        src={preview || ""}
                        className="object-cover"
                      />
                      <AvatarFallback className="bg-muted flex items-center justify-center">
                        Profile Image
                      </AvatarFallback>
                    </Avatar>

                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="outline" size="icon" asChild>
                        <label className="cursor-pointer">
                          <Upload className="w-4 h-4 text-white" />
                          <input
                            className="hidden"
                            type="file"
                            accept="image/*"
                            {...avatarRegister}
                            onChange={(e) => {
                              handleAvatarChange(e);
                              formOnChange(e);
                            }}
                          />
                        </label>
                      </Button>
                    </div>
                  </div>
                </div>
                {errors.avatar ? (
                  <FieldError className="ml-2">
                    {errors.avatar.message}
                  </FieldError>
                ) : (
                  <FieldDescription className="mt-2 ml-4">
                    Image within 5 MB
                  </FieldDescription>
                )}
              </Field>
              <div className="flex-1 flex flex-col gap-6">
                <Field>
                  <FieldLabel htmlFor="username" className="ps-1.5">
                    Name
                  </FieldLabel>
                  <InputGroup>
                    <InputGroupInput
                      {...register("name")}
                      id="username"
                      aria-invalid={!!errors.name}
                      placeholder="Ram Singh"
                    />
                    <InputGroupAddon>
                      <InputGroupButton
                        variant={"outline"}
                        disabled={true}
                        className="bg-gray-700"
                      >
                        <User />
                      </InputGroupButton>
                    </InputGroupAddon>
                  </InputGroup>
                  {errors.name ? (
                    <FieldError errors={[errors.name]} />
                  ) : (
                    <FieldDescription>
                      Please provide your profile name
                    </FieldDescription>
                  )}
                </Field>
                <Field>
                  <FieldLabel htmlFor="bio" className="ps-1.5">
                    Bio
                  </FieldLabel>
                  <Textarea
                    id="bio"
                    placeholder="A small info about yourself"
                    rows={4}
                    {...register("bio")}
                  />
                  {errors.bio ? (
                    <FieldError errors={[errors.bio]} />
                  ) : (
                    <FieldDescription>Please provide Bio</FieldDescription>
                  )}
                </Field>
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="pt-5">
          {verify.isPending ? (
            <Button variant="outline" disabled>
              <Spinner data-icon="inline-start" />
              Createing Profile
            </Button>
          ) : (
            <Button type="submit" variant={"default"} className="w-full">
              Create Profile
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
