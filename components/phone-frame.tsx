"use client"

import { useState, useEffect } from "react"
import { SkillsWidget } from "@/components/skills-widget"
import { HomeScreen } from "@/components/home-screen"
import { ProjectsScreen } from "@/components/projects-screen"
import { BottomNav } from "@/components/bottom-nav"

export type Screen = "home" | "projects" | "clients"

export function PhoneFrame() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("home")
  const [currentTime, setCurrentTime] = useState("")

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      setCurrentTime(
        now.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        }),
      )
    }
    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [])

  const handleNavClick = (screen: Screen) => {
    if (screen === "clients") {
      window.open("https://discord.gg/vXyexjM54x", "_blank")
      return
    }
    setCurrentScreen(screen)
  }

  return (
    <div className="fade-in">
      {/* Phone body */}
      <div className="relative w-[320px] md:w-[375px] bg-gradient-to-b from-zinc-800 via-zinc-900 to-black rounded-[50px] p-2 shadow-2xl">
        {/* Glossy bezel highlight */}
        <div className="absolute inset-0 rounded-[50px] bg-gradient-to-br from-zinc-600/30 via-transparent to-transparent pointer-events-none" />

        {/* Speaker grille */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-16 h-1.5 bg-zinc-900 rounded-full" />

        {/* Front camera */}
        <div className="absolute top-4 right-20 w-3 h-3 bg-zinc-900 rounded-full border border-zinc-700">
          <div className="absolute inset-1 bg-zinc-800 rounded-full" />
        </div>

        {/* Screen */}
        <div
          className="relative w-full h-[580px] md:h-[667px] rounded-[8px] overflow-hidden"
          style={{
            background: "linear-gradient(180deg, #5b9bd5 0%, #87ceeb 30%, #b8d4e8 70%, #d4e5f7 100%)",
          }}
        >
          {/* Status bar */}
          <div className="h-6 bg-black/30 glass-effect flex items-center justify-between px-4 text-white text-xs font-medium">
            <span>{currentTime}</span>
            <div className="flex items-center gap-1.5">
              {/* Signal bars */}
              <div className="flex items-end gap-0.5 h-3">
                <div className="w-1 h-1 bg-white rounded-sm" />
                <div className="w-1 h-1.5 bg-white rounded-sm" />
                <div className="w-1 h-2 bg-white rounded-sm" />
                <div className="w-1 h-2.5 bg-white rounded-sm" />
                <div className="w-1 h-3 bg-white/40 rounded-sm" />
              </div>
              <span className="text-[10px] ml-1">3G</span>
              {/* Battery */}
              <div className="flex items-center gap-0.5 ml-1">
                <div className="w-5 h-2.5 border border-white rounded-sm p-px">
                  <div className="w-3/4 h-full bg-white rounded-sm" />
                </div>
                <div className="w-0.5 h-1 bg-white rounded-r-sm" />
              </div>
            </div>
          </div>

          {/* Screen content */}
          <div className="h-[calc(100%-24px)] flex flex-col pt-4 pb-24 px-4 overflow-hidden">
            {/* Skills Widget */}
            <SkillsWidget />

            {/* Main content area */}
            <div className="flex-1 overflow-y-auto mt-4 scrollbar-hide">
              {currentScreen === "home" && <HomeScreen />}
              {currentScreen === "projects" && <ProjectsScreen />}
            </div>
          </div>

          {/* Bottom dock */}
          <BottomNav currentScreen={currentScreen} onNavigate={handleNavClick} />
        </div>

        {/* Home button */}
        <div className="absolute -bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2">
          <div className="w-12 h-12 rounded-full bg-gradient-to-b from-zinc-700 to-zinc-900 border-2 border-zinc-600 shadow-lg flex items-center justify-center">
            <div className="w-5 h-5 rounded-md border-2 border-zinc-500" />
          </div>
        </div>
      </div>

      {/* Phone shadow */}
      <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-4/5 h-8 bg-black/30 rounded-full blur-xl -z-10" />
    </div>
  )
}
