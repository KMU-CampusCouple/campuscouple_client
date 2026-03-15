"use client"

import { useEffect, useState, useRef } from "react"

const taglines = [
  "캠퍼스에서 안전하게 만나요",
  "오늘, 새로운 설렘을 만나요",
  "다시 설렐 시간을 보내요",
  "캠퍼스에서 너를 만나요",
]

export default function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const [fadeOut, setFadeOut] = useState(false)
  const [mounted, setMounted] = useState(false)
  const taglineRef = useRef(taglines[0])
  const [tagline, setTagline] = useState(taglines[0])

  useEffect(() => {
    const randomTagline = taglines[Math.floor(Math.random() * taglines.length)]
    taglineRef.current = randomTagline
    setTagline(randomTagline)
    setMounted(true)
    const timer = setTimeout(() => {
      setFadeOut(true)
      setTimeout(onComplete, 500)
    }, 2800)
    return () => clearTimeout(timer)
  }, [onComplete])

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-background transition-opacity duration-500 ${
        fadeOut ? "opacity-0" : "opacity-100"
      }`}
    >
      <style>{`
        @keyframes logoScale {
          0% { transform: scale(0.8); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
      `}</style>

      <div className="flex flex-col items-center">
        <div
          className="w-24 h-24 rounded-2xl overflow-hidden shadow-lg"
          style={{
            animation: mounted ? "logoScale 0.6s ease-out forwards, pulse 2s 0.6s ease-in-out infinite" : "none",
          }}
        >
          <img src="/logo.jpg" alt="Campus Couple" className="w-full h-full object-cover" />
        </div>

        <h1
          className="text-2xl font-bold text-foreground mt-6"
          style={{
            animation: mounted ? "fadeUp 0.5s 0.3s ease-out both" : "none",
          }}
        >
          {"캠퍼스커플"}
        </h1>
        <p
          className="text-sm text-muted-foreground mt-2"
          style={{
            animation: mounted ? "fadeUp 0.5s 0.5s ease-out both" : "none",
          }}
        >
          {tagline}
        </p>
      </div>
    </div>
  )
}
