import { Skeleton } from "@/components/ui/skeleton"

export default function UserProfileLoading() {
  return (
    <div className="flex flex-col flex-1 min-h-0 px-4 py-4 gap-4 pb-20">
      <div className="flex items-center gap-3">
        <Skeleton className="w-14 h-14 rounded-2xl" />
        <div className="flex-1 space-y-2">
          <Skeleton className="w-28 h-4" />
          <Skeleton className="w-44 h-3" />
        </div>
        <Skeleton className="w-20 h-9 rounded-xl" />
      </div>

      <Skeleton className="h-44 rounded-2xl" />

      <div className="space-y-2">
        <Skeleton className="w-56 h-5" />
        <Skeleton className="w-full h-3" />
        <Skeleton className="w-5/6 h-3" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Skeleton className="h-12 rounded-xl" />
        <Skeleton className="h-12 rounded-xl" />
      </div>

      <div className="space-y-3">
        <Skeleton className="w-24 h-4" />
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-16 rounded-2xl" />
        ))}
      </div>
    </div>
  )
}

