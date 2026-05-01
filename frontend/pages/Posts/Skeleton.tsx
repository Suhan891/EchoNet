import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";

export default function PostsSkeleton({ posts }: { posts: number }) {
  return (
    <Card>
      <CardHeader>
        <Spinner /> Loading Posts
      </CardHeader>
      <CardContent>
        {Array.from({ length: posts }).map((_, index) => (
          <Card key={index}>
            <CardHeader>
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </CardHeader>
            <CardContent className="flex justify-evenly items-center">
              <Skeleton className="aspect-square w-1/4" />
              <Skeleton className="aspect-square w-1/4" />
              <Skeleton className="aspect-square w-1/4" />
            </CardContent>
            <CardFooter>
              <Skeleton className="h-4 w-full" />
            </CardFooter>
          </Card>
        ))}
      </CardContent>
    </Card>
  );
}
