import { Skeleton } from "@/components/ui/skeleton"

export default function FriendsLoading() {
  return (
    <div className="flex flex-col flex-1 min-h-0 px-4 py-4 gap-4">
      <div className="space-y-2">
        <Skeleton className="w-28 h-5" />
        <Skeleton className="w-52 h-3" />
      </div>

      <div className="flex gap-2">
        <Skeleton className="h-10 flex-1 rounded-xl" />
        <Skeleton className="h-10 w-24 rounded-xl" />
      </div>

      <div className="space-y-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <Skeleton className="w-12 h-12 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="w-32 h-4" />
              <Skeleton className="w-48 h-3" />
            </div>
            <Skeleton className="w-16 h-8 rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  )
}

