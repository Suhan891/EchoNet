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
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
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
import { useState } from "react";

export default function Login() {
  const [view, setView] = useState(false);
  return (
    <div>
      <Card className="flex-5 w-7xl max-w-sm">
        <CardHeader className="w-full ">
          <CardTitle className="text-2xl mx-auto">Login to explore</CardTitle>
        </CardHeader>
        <CardContent>
          <form>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email" className="ps-1.5">
                  Email
                </FieldLabel>
                <InputGroup>
                  <InputGroupInput id="email" placeholder="ram@gmail.com" />
                  <InputGroupAddon>
                    <InputGroupButton disabled={true} className="bg-gray-700">
                      <Mail />
                    </InputGroupButton>
                  </InputGroupAddon>
                </InputGroup>
              </Field>
              <Field>
                <FieldLabel htmlFor="password" className="ps-1.5">
                  Password{" "}
                  <div className="ml-auto text-sm text-amber-50 hover:text-blue-400">
                    <Link href={"#"}>Forgot{" "} password</Link>{" "}
                  </div>{" "}
                </FieldLabel>
                <InputGroup>
                  <InputGroupInput id="password" type={view ? "password" : "text"} placeholder="******" />
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
              </Field>
            </FieldGroup>
          </form>
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
          <Button type="submit" className="w-full">
            Register
          </Button>
          <CardDescription className="text-gray-600 flex px-auto">
            All the data are end to end encrypted.{" "}
            <Hovertext
              title="Privacy"
              description="No data shall go outside of this account"
            />
          </CardDescription>
        </CardFooter>
      </Card>
    </div>
  );
}
