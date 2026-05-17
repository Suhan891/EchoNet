import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { commentSchema, commentType } from "@/validations/common/comment";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useForm } from "react-hook-form";

interface CommentProps {
  type: "POST" | "REEL";
  id: string;
  count: number;
}
export default function Comment({ type, id, count }: CommentProps) {
  const {} = useForm<commentType>({
    resolver: zodResolver(commentSchema),
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Sticky Footer</Button>
      </DialogTrigger>

      <DialogContent>
        {count === 0 && (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Plus />
              </EmptyMedia>
              <EmptyTitle>No comment yet</EmptyTitle>
              <EmptyDescription className="max-w-xs text-pretty">
                Be the first to make a comment
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              
            </EmptyContent>
          </Empty>
        )}
        {count > 0 && (
          <div>
            <DialogHeader>
              <DialogTitle>Comments</DialogTitle>
              <DialogDescription>
                {type === "POST" && "All post comment"}
                {type === "REEL" && "All reel comment"}
              </DialogDescription>
            </DialogHeader>
            <div className="-mx-4 no-scrollbar max-h-[50vh] overflow-y-auto px-4">
              {Array.from({ length: 10 }).map((_, index) => (
                // <div className="flex w-full max-w-lg flex-col gap-6">
                <Item key={index} className={"border-none "}>
                  <ItemMedia>
                    <Avatar className="size-10">
                      <AvatarImage src="https://github.com/evilrabbit.png" />
                      <AvatarFallback>ER</AvatarFallback>
                    </Avatar>
                  </ItemMedia>
                  <ItemContent>
                    <ItemTitle>{"name"}</ItemTitle>
                    <ItemDescription>{"comment description"}</ItemDescription>
                  </ItemContent>
                  <ItemActions>
                    <Button size="sm" variant="outline" className="rounded-xl">
                      Reply
                    </Button>
                  </ItemActions>
                </Item>
              ))}
            </div>
          </div>
        )}
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
