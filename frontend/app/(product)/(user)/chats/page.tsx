"use client";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import CreateGroup from "@/pages/Chat/CreateGroup";
import CreatePrivate from "@/pages/Chat/CreatePrivate";
import { useState } from "react";

export default function ChatPage() {
  const [chat, setChat] = useState<"PRIVATE" | "GROUP">();
  return (
    <div className="flex flex-col gap-8 w-full max-w-3xl p-4 items-center">
      <div className="w-full max-w-sm">
        <Select onValueChange={(value: "PRIVATE" | "GROUP") => setChat(value)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select chat" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Chat</SelectLabel>
              <SelectItem value="PRIVATE">Private</SelectItem>
              <SelectItem value="GROUP">Group</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      {chat === 'PRIVATE' && <CreatePrivate />}
      {chat === 'GROUP' && <CreateGroup />}
    </div>
  );
}
