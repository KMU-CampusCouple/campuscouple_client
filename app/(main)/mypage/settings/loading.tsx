import { Skeleton } from "@/components/ui/skeleton"

export default function MyPageSettingsLoading() {
  return (
    <div className="flex flex-col flex-1 min-h-0 px-4 py-6 gap-5 pb-20">
      <div className="space-y-2">
        <Skeleton className="w-28 h-5" />
        <Skeleton className="w-64 h-3" />
      </div>

      <div className="space-y-2">
        {Array.from({ length: 7 }).map((_, i) => (
          <Skeleton key={i} className="h-14 rounded-2xl" />
        ))}
      </div>
    </div>
  )
}

