import { Skeleton } from "@/components/ui/skeleton"

export default function ProfileSetupLoading() {
  return (
    <div className="flex flex-col flex-1 min-h-0 px-4 py-6 gap-6 pb-16">
      <div className="space-y-2">
        <Skeleton className="w-44 h-5" />
        <Skeleton className="w-72 h-3" />
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="aspect-square rounded-2xl" />
          ))}
        </div>

        <div className="space-y-2">
          <Skeleton className="w-16 h-3" />
          <Skeleton className="h-12 rounded-xl" />
        </div>
        <div className="space-y-2">
          <Skeleton className="w-16 h-3" />
          <Skeleton className="h-12 rounded-xl" />
        </div>
        <div className="space-y-2">
          <Skeleton className="w-16 h-3" />
          <Skeleton className="h-12 rounded-xl" />
        </div>
      </div>

      <div className="mt-auto">
        <Skeleton className="h-11 rounded-xl" />
      </div>
    </div>
  )
}

