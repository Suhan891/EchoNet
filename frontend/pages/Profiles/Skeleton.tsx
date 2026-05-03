import { Item, ItemGroup } from "@/components/ui/item";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProfilesSkeleton() {
  return (
    <ItemGroup>
      {Array.from({ length: 3 }).map((_, index) => (
        <Item key={index} className="flex w-fit items-center gap-4">
          <Skeleton className="size-10 shrink-0 rounded-full" />
          <div className="grid gap-2">
            <Skeleton className="h-4 w-[150px]" />
            <Skeleton className="h-4 w-[100px]" />
          </div>
        </Item>
      ))}
    </ItemGroup>
  );
}
