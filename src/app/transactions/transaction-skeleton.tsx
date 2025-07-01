import { Skeleton } from "@/components/ui/skeleton";

export function TransactionSkeleton() {
  return (
    <div className="flex items-center gap-4 p-3">
      <div className="flex-1 grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-2">
        {/* Description */}
        <Skeleton className="h-5 w-3/4" />
        {/* Amount */}
        <Skeleton className="h-6 w-24 justify-self-end" />
        {/* Account & Category */}
        <Skeleton className="h-4 w-1/2" />
        {/* Merchant */}
        <Skeleton className="h-4 w-1/4 justify-self-end" />
      </div>
    </div>
  );
}