"use client"

import { useState, useEffect } from "react"

export function LoadingScreen() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 2
      })
    }, 40)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="fixed inset-0 bg-black flex flex-col items-center justify-center z-50">
      {/* Logo */}
      <div className="mb-12">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-zinc-700 to-zinc-900 flex items-center justify-center shadow-2xl">
          <span className="text-4xl font-light text-white">S</span>
        </div>
      </div>

      {/* Loading indicator */}
      <div className="w-48">
        <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-white rounded-full transition-all duration-100 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Bottom text */}
      <div className="absolute bottom-12 text-zinc-600 text-xs tracking-widest">SEEKER</div>
    </div>
  )
}
