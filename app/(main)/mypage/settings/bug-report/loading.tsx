import { Skeleton } from "@/components/ui/skeleton"

export default function BugReportLoading() {
  return (
    <div className="flex flex-col flex-1 min-h-0 overflow-y-auto px-4 py-6 pb-20 gap-5">
      <div className="space-y-2">
        <Skeleton className="w-44 h-5" />
        <Skeleton className="w-72 h-3" />
      </div>

      <div className="flex gap-1 rounded-xl bg-muted p-0.5">
        <Skeleton className="h-9 flex-1 rounded-lg bg-background/70" />
        <Skeleton className="h-9 flex-1 rounded-lg bg-background/40" />
      </div>

      <div className="space-y-2">
        <Skeleton className="w-12 h-3" />
        <Skeleton className="h-10 rounded-xl" />
      </div>

      <div className="space-y-2">
        <Skeleton className="w-16 h-3" />
        <Skeleton className="h-32 rounded-xl" />
      </div>

      <div className="mt-auto space-y-2">
        <Skeleton className="h-10 rounded-xl" />
        <Skeleton className="w-5/6 h-3" />
      </div>
    </div>
  )
}

