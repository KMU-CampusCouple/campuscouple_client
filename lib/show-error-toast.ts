"use client"

import { toast } from "@/hooks/use-toast"

export function showErrorToast() {
  toast({
    variant: "destructive",
    title: "Error",
  })
}
