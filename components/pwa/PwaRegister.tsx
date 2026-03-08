"use client"

import { useEffect, useState } from "react"

export function PwaRegister() {
  const [registered, setRegistered] = useState(false)

  useEffect(() => {
    if (
      typeof window === "undefined" ||
      !("serviceWorker" in navigator) ||
      process.env.NODE_ENV !== "production"
    ) {
      return
    }

    navigator.serviceWorker
      .register("/sw.js")
      .then((reg) => {
        setRegistered(true)
        reg.update().catch(() => {})
      })
      .catch(() => {})
  }, [])

  return null
}
