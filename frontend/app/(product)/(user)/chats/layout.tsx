"use client"
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import { useAllchat } from "@/hooks/useChat";
import AllChats from "@/modules/Chat/AllChats";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

export default function UserLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    const router = useRouter()
  const { isLoading, isError, isSuccess, data, error } = useAllchat();
  return (
    <>
      {children}
      <div className="fixed right-0 top-0 h-screen w-80 border-l border-gray-200 dark:border-white/10 bg-white dark:bg-[#0c0f14] p-4 pt-16 flex flex-col gap-4 z-10">
        <Button onClick={() => router.push("/chats")}
        className="w-full bg-blue-600 hover:bg-blue-500 text-white shadow-md transition-all flex items-center justify-center gap-2"
      >
        <Plus className="size-4"/>
        Create New Chat
      </Button>
      <Separator />
        {isLoading && <Spinner className="size-6" />}
        {isError && <div>Error: {error.message}</div>}
        {isSuccess && <AllChats chats={data.data} />}
      </div>
    </>
  );
}
