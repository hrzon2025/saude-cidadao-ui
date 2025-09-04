import { Skeleton } from "../ui/skeleton";
import { Card } from "../ui/card";

export function SkeletonCard() {
  return (
    <Card className="p-4">
      <div className="space-y-3">
        <div className="flex items-start justify-between">
          <div className="space-y-2 flex-1">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-16" />
          </div>
          <Skeleton className="h-8 w-16 ml-2" />
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center">
            <Skeleton className="h-4 w-4 mr-2" />
            <Skeleton className="h-4 w-32" />
          </div>
          <div className="flex items-center">
            <Skeleton className="h-4 w-4 mr-2" />
            <Skeleton className="h-4 w-40" />
          </div>
          <div className="flex items-center">
            <Skeleton className="h-4 w-4 mr-2" />
            <Skeleton className="h-4 w-36" />
          </div>
        </div>
      </div>
    </Card>
  );
}

export function SkeletonCardList({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}