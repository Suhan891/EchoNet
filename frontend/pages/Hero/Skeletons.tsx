import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";

export function LikesSkeleton({count}:{count: number}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <Spinner />
          Loading Like viewers
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-col justify-center">
        {Array.from({ length: count }).map((_, index) => (
          <Card key={index}>
            <div className="flex items-center gap-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-50" />
                <Skeleton className="h-4 w-50" />
              </div>
            </div>
          </Card>
        ))}
      </CardContent>
    </Card>
  );
}

export function CommentsSkeleton(count: number) {}
