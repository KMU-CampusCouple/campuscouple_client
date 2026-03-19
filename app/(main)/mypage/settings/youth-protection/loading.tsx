import { Skeleton } from "@/components/ui/skeleton"

export default function YouthProtectionLoading() {
  return (
    <div className="flex flex-col flex-1 min-h-0 overflow-y-auto px-4 py-6 pb-20 gap-4">
      <Skeleton className="w-40 h-5" />
      <div className="space-y-2">
        <Skeleton className="w-full h-3" />
        <Skeleton className="w-5/6 h-3" />
        <Skeleton className="w-11/12 h-3" />
      </div>

      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="space-y-2 pt-2">
          <Skeleton className="w-44 h-4" />
          <Skeleton className="w-full h-3" />
          <Skeleton className="w-5/6 h-3" />
        </div>
      ))}
    </div>
  )
}

