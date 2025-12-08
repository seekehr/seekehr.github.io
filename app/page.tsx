"use client"

import { useState, useEffect } from "react"
import { LoadingScreen } from "@/components/loading-screen"
import { PhoneFrame } from "@/components/phone-frame"
import { getProjects } from "@/lib/projects"

export default function Home() {
  const [isLoading, setIsLoading] = useState(true)

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
    </main>
  )
}
