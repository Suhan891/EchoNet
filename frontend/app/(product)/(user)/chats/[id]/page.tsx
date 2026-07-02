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
import { useAllChatMsgs } from "@/hooks/useChat";
import IndivisualChat from "@/modules/Chat/IndivisualChat";
import { MessageCircleOff } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

export default function ChatPage() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  const { isError, error, isLoading, isSuccess, data } = useAllChatMsgs(id);
  if (isError)
    return (
      <Empty className="h-full bg-muted/30">
        <EmptyHeader>
          <EmptyMedia variant={"icon"}>
            <MessageCircleOff />
          </EmptyMedia>
          <EmptyTitle>Chat Details Fetched failed</EmptyTitle>
          <EmptyDescription>{error.message}</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button variant={"link"} onClick={() => router.push("/chats")}>
            Return
          </Button>
        </EmptyContent>
      </Empty>
    );

  if (isLoading) return <div className="h-screen w-full flex justify-center items-center"><Spinner className="size-8" /></div>

  if (isSuccess) return <IndivisualChat data={data.data} />;
}
