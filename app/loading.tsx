import { Skeleton } from "@/components/ui/skeleton"

export default function RootLoading() {
  return (
    <div className="bg-background flex flex-col h-[100dvh] overflow-hidden max-h-screen pt-[var(--safe-area-inset-top)]">
      <div className="shrink-0 rounded-b-lg bg-primary/80 px-4 pt-5 pb-3.5 flex items-center gap-2 h-[4.25rem]">
        <Skeleton className="w-7 h-7 rounded-lg bg-primary-foreground/20" />
        <Skeleton className="w-24 h-4 rounded-md bg-primary-foreground/20" />
      </div>

      <div className="flex flex-col flex-1 min-h-0 px-4 py-6 gap-4">
        <div className="space-y-2">
          <Skeleton className="w-40 h-4" />
          <Skeleton className="w-64 h-3" />
        </div>
        <div className="space-y-3">
          <Skeleton className="h-16 rounded-xl" />
          <Skeleton className="h-16 rounded-xl" />
          <Skeleton className="h-16 rounded-xl" />
        </div>
      </div>
    </div>
  )
}

