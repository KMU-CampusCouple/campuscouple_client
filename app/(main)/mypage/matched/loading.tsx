import { Skeleton } from "@/components/ui/skeleton"

export default function MyPageMatchedLoading() {
  return (
    <div className="flex flex-col flex-1 min-h-0 px-4 py-4 gap-4 pb-20">
      <div className="space-y-2">
        <Skeleton className="w-28 h-5" />
        <Skeleton className="w-56 h-3" />
      </div>

      <div className="space-y-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-20 rounded-2xl" />
        ))}
      </div>
    </div>
  )
}

