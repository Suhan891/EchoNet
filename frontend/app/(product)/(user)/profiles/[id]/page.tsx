"use client";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Spinner } from "@/components/ui/spinner";
import { useGetSpecificProfile } from "@/hooks/useProfile";
import IndivisualProfile from "@/pages/Profiles/IndivisualProfile";
import { User } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

export default function IndivisualProfilePage() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();

  const { isLoading, data, isSuccess, isError, error } =
    useGetSpecificProfile(id);

  if (isError)
    return (
      <Empty className="h-full bg-muted/30">
        <EmptyHeader>
          <EmptyMedia variant={"icon"}>
            <User />
          </EmptyMedia>
          <EmptyTitle>Profile Details fetched failed</EmptyTitle>
          <EmptyDescription>{error.message}</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button variant={"link"} onClick={() => router.push("/profiles")}>
            Return
          </Button>
        </EmptyContent>
      </Empty>
    );

    if(isLoading)
        return <Spinner className="size-8" />

  return <>{isSuccess && <IndivisualProfile profile={data.data} />}</>;
}
