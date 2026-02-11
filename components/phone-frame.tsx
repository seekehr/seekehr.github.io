"use client"

import { useState, useEffect } from "react"
import { SkillsWidget } from "@/components/skills-widget"
import { HomeScreen } from "@/components/home-screen"
import { ProjectsScreen } from "@/components/projects-screen"
import { ContactScreen } from "@/components/contact-screen"
import { BottomNav } from "@/components/bottom-nav"

export type Screen = "home" | "projects" | "clients" | "contact"

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
      <div className="relative w-[320px] md:w-[375px] rounded-[50px] p-2 shadow-2xl" style={{
        background: "linear-gradient(135deg, #1f2937 0%, #111827 25%, #030712 50%, #111827 75%, #1f2937 100%)",
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.8), inset 0 2px 4px rgba(255, 255, 255, 0.1), inset 0 -2px 4px rgba(0, 0, 0, 0.5)"
      }}>
        {/* Glossy bezel highlight - top */}
        <div className="absolute inset-0 rounded-[50px] bg-gradient-to-br from-white/20 via-white/5 to-transparent pointer-events-none" />
        {/* Glossy bezel highlight - bottom shadow */}
        <div className="absolute inset-0 rounded-[50px] bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
        {/* Inner bezel ring */}
        <div className="absolute inset-[8px] rounded-[42px] border border-zinc-800/50 pointer-events-none" />

        {/* Speaker grille */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-16 h-1.5 bg-zinc-900 rounded-full" />

        {/* Front camera */}
        <div className="absolute top-4 right-20 w-3 h-3 bg-zinc-900 rounded-full border border-zinc-700">
          <div className="absolute inset-1 bg-zinc-800 rounded-full" />
        </div>

        {/* Screen */}
        <div
          className="relative w-full h-[580px] md:h-[667px] rounded-[44px] overflow-hidden"
          style={{
            background: "linear-gradient(180deg, #1e1b4b 0%, #312e81 30%, #1e293b 70%, #0f172a 100%)",
            boxShadow: "inset 0 0 0 1px rgba(0, 0, 0, 0.3), inset 0 1px 2px rgba(0, 0, 0, 0.2)"
          }}
        >
          {/* Status bar */}
          <div className="h-6 bg-black/40 glass-effect flex items-center justify-between px-4 text-white text-xs font-semibold drop-shadow-md">
            <span>{currentTime}</span>
            <div className="flex items-center gap-1.5">
              {/* Signal bars */}
              <div className="flex items-end gap-0.5 h-3">
                <div className="w-1 h-1 bg-white rounded-sm" />
                <div className="w-1 h-1.5 bg-white rounded-sm" />
                <div className="w-1 h-2 bg-white rounded-sm" />
                <div className="w-1 h-2.5 bg-white rounded-sm" />
                <div className="w-1 h-3 bg-white/60 rounded-sm" />
              </div>
              <span className="text-xs ml-1 font-semibold">4G</span>
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
          <div data-phone-screen className="h-[calc(100%-24px)] flex flex-col pt-4 pb-24 px-4 overflow-visible relative">
            {/* Skills Widget */}
            <SkillsWidget />

            {/* Main content area */}
            <div className="flex-1 overflow-y-auto mt-4 scrollbar-hide">
              {currentScreen === "home" && <HomeScreen />}
              {currentScreen === "projects" && <ProjectsScreen />}
              {currentScreen === "contact" && <ContactScreen />}
            </div>
          </div>

          {/* Bottom dock */}
          <BottomNav currentScreen={currentScreen} onNavigate={handleNavClick} />
        </div>
      </div>

      {/* Phone shadow */}
      <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-4/5 h-8 bg-black/30 rounded-full blur-xl -z-10" />
    </div>
  )
}
