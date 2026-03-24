"use client"

import { toast } from "@/hooks/use-toast"

export function showErrorToast(message?: string) {
  toast({
    variant: "destructive",
    title: message ?? "오류가 발생했어요",
  })
}
