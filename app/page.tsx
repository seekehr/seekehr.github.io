"use client"

import { useState, useEffect } from "react"
import { LoadingScreen } from "@/components/loading-screen"
import { PhoneFrame } from "@/components/phone-frame"
import { getProjects } from "@/lib/projects"

export default function Home() {
  const [isLoading, setIsLoading] = useState(true)
  const [showHint, setShowHint] = useState(false)

  useEffect(() => {
    // Preload project images early
    getProjects().then((projects) => {
      projects.forEach((project) => {
        if (project.image) {
          const img = new Image()
          img.src = project.image
        }
      })
    })

    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <main className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Subtle background pattern */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Ambient glow */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />

      {/* Content */}
      <div className="relative z-10">{isLoading ? <LoadingScreen /> : <PhoneFrame />}</div>

      {/* Help Icon */}
      <div className="fixed top-4 right-4 z-[99999]">
        <button
          onMouseEnter={() => {
            if (window.matchMedia("(hover: hover)").matches) {
              setShowHint(true)
            }
          }}
          onMouseLeave={() => {
            if (window.matchMedia("(hover: hover)").matches) {
              setShowHint(false)
            }
          }}
          onClick={() => {
            if (!window.matchMedia("(hover: hover)").matches) {
              setShowHint(!showHint)
            }
          }}
          className="w-10 h-10 rounded-full bg-zinc-700 hover:bg-zinc-600 active:bg-zinc-500 flex items-center justify-center shadow-lg transition-colors"
          aria-label="Help"
        >
          <span className="text-white text-lg font-bold">?</span>
        </button>

        {/* Hint Popover */}
        {showHint && (
          <div
            className="absolute top-0 right-full mr-3 p-4 rounded-2xl backdrop-filter backdrop-blur-xl bg-black/50 border border-zinc-800/50 shadow-xl min-w-[200px] pointer-events-auto"
            onMouseEnter={() => {
              if (window.matchMedia("(hover: hover)").matches) {
                setShowHint(true)
              }
            }}
            onMouseLeave={() => {
              if (window.matchMedia("(hover: hover)").matches) {
                setShowHint(false)
              }
            }}
          >
            <p className="text-sm text-white font-medium">Hint: Double tap to view on mobile</p>
          </div>
        )}
      </div>
    </main>
  )
}
