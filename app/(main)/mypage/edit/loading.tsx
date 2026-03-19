import { Skeleton } from "@/components/ui/skeleton"

export default function ProfileEditLoading() {
  return (
    <div className="flex flex-col flex-1 min-h-0 px-4 py-6 gap-5 pb-20">
      <div className="space-y-2">
        <Skeleton className="w-36 h-5" />
        <Skeleton className="w-60 h-3" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="aspect-square rounded-2xl" />
        ))}
      </div>

      <div className="space-y-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="w-20 h-3" />
            <Skeleton className="h-12 rounded-xl" />
          </div>
        ))}
      </div>

      <div className="space-y-2">
        <Skeleton className="w-20 h-3" />
        <Skeleton className="h-12 rounded-xl" />
        <Skeleton className="h-12 rounded-xl" />
      </div>
    </div>
  )
}

