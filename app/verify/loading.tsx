import { Skeleton } from "@/components/ui/skeleton"

export default function VerifyLoading() {
  return (
    <div className="flex flex-col flex-1 min-h-0 px-4 py-6 gap-6">
      <div className="space-y-2">
        <Skeleton className="w-40 h-5" />
        <Skeleton className="w-64 h-3" />
      </div>

      <div className="space-y-3">
        <Skeleton className="h-12 rounded-xl" />
        <div className="flex gap-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-12 flex-1 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-10 rounded-xl" />
      </div>

      <div className="mt-auto space-y-2 pb-4">
        <Skeleton className="h-11 rounded-xl" />
        <Skeleton className="h-11 rounded-xl" />
      </div>
    </div>
  )
}

