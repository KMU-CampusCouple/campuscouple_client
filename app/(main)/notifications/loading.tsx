import { Skeleton } from "@/components/ui/skeleton"

export default function NotificationsLoading() {
  return (
    <div className="flex flex-col flex-1 min-h-0 px-4 py-4 gap-4">
      <div className="space-y-2">
        <Skeleton className="w-24 h-5" />
        <Skeleton className="w-56 h-3" />
      </div>

      <div className="space-y-3">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="flex items-start gap-3">
            <Skeleton className="w-10 h-10 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="w-5/6 h-4" />
              <Skeleton className="w-32 h-3" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

