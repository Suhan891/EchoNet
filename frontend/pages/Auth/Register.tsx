import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {Field, FieldGroup, FieldLabel} from '@/components/ui/field'
import { Eye, GitBranchIcon, Home, Lock, Mail, RectangleGogglesIcon } from "lucide-react";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/components/ui/input-group";
import Hovertext from "@/components/card-hover";
import Link from "next/link";

export default function Register() {
  return (
    <div>
      <Card className="flex-5 w-7xl max-w-sm">
        <CardHeader className="w-full ">
          <CardTitle className="text-2xl mx-auto">Register the  experience</CardTitle>
        </CardHeader>
        <CardContent>
          <form>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email" className="ps-1.5">Email</FieldLabel>
                <InputGroup>
                    <InputGroupInput id="email" placeholder="ram@gmail.com" />
                    <InputGroupAddon>
                        <InputGroupButton disabled={true} className="bg-gray-700" ><Mail /></InputGroupButton>
                    </InputGroupAddon>
                </InputGroup>
              </Field>
              <Field>
                <FieldLabel htmlFor="username" className="ps-1.5">Username</FieldLabel>
                <InputGroup>
                    <InputGroupInput id="username" placeholder="Ram Singh" />
                    <InputGroupAddon>
                        <InputGroupButton variant={"outline"} disabled={true} className="bg-gray-700" ><Home /></InputGroupButton>
                    </InputGroupAddon>
                </InputGroup>
              </Field>
                <Field>
                <FieldLabel htmlFor="password" className="ps-1.5">Password </FieldLabel>
                <InputGroup>
                    <InputGroupInput id="password" placeholder="******" />
                    <InputGroupAddon >
                        <InputGroupButton disabled={true} className="bg-gray-700" ><Lock /></InputGroupButton>
                    </InputGroupAddon>
                    <InputGroupAddon align="inline-end">
                    <Eye />
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
            <CardDescription>Already have an account <Link href={"/login"} className="hover:text-blue-500">SignIn</Link> </CardDescription>
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <Button type="submit" className="w-full">
            Register
          </Button>
          <CardDescription className="text-gray-600 flex px-auto">
            By registering you agree to our extensive <Hovertext title="Terms" description="Valid email should be provided as verification link shall be shared in inbox" /> and Conditions
          </CardDescription>
        </CardFooter>
      </Card>
    </div>
  );
}
