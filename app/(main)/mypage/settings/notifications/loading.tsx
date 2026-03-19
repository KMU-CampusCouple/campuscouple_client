import { Skeleton } from "@/components/ui/skeleton"

export default function NotificationSettingsLoading() {
  return (
    <div className="flex flex-col flex-1 min-h-0 overflow-y-auto px-4 py-6 pb-20 gap-6">
      <div className="space-y-2">
        <Skeleton className="w-28 h-5" />
        <Skeleton className="w-72 h-3" />
      </div>

      <div className="space-y-5">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex items-center justify-between gap-4">
            <div className="flex-1 space-y-2">
              <Skeleton className="w-32 h-4" />
              <Skeleton className="w-72 h-3" />
            </div>
            <Skeleton className="w-11 h-6 rounded-full" />
          </div>
        ))}
      </div>

      <Skeleton className="h-3 w-5/6" />
    </div>
  )
}

