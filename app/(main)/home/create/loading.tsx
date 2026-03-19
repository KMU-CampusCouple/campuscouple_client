import { Skeleton } from "@/components/ui/skeleton"

export default function CreatePostLoading() {
  return (
    <div className="flex flex-col flex-1 min-h-0 px-4 py-6 gap-5 pb-20">
      <div className="space-y-2">
        <Skeleton className="w-28 h-5" />
        <Skeleton className="w-56 h-3" />
      </div>

      <div className="space-y-3">
        <Skeleton className="h-12 rounded-xl" />
        <Skeleton className="h-12 rounded-xl" />
        <Skeleton className="h-28 rounded-xl" />
        <Skeleton className="h-12 rounded-xl" />
      </div>

      <div className="mt-auto">
        <Skeleton className="h-11 rounded-xl" />
      </div>
    </div>
  )
}

