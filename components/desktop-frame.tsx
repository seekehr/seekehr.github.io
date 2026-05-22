"use client"

import { useState, useEffect, useMemo } from "react"
import { Search } from "lucide-react"
import { DesktopIcon } from "./desktop-icon"
import { ExplorerWindow } from "./explorer-window"
import { AboutWindow } from "./about-window"
import { ContactWindow } from "./contact-window"

type WindowType = "projects" | "about" | "contact" | null

function useWallpaperPolygons() {
  return useMemo(() => {
    const COLS = 12
    const ROWS = 6
    const W = 1920
    const H = 1080

    const vx = (c: number, r: number): number => {
      const base = c * (W / COLS)
      if (c === 0 || c === COLS) return base
      return base + (((c * 17 + r * 13 + 7) % 80) - 40)
    }

    const vy = (c: number, r: number): number => {
      const base = r * (H / ROWS)
      if (r === 0 || r === ROWS) return base
      return base + (((c * 11 + r * 19 + 5) % 90) - 45)
    }

    const color = (c: number, r: number, upper: boolean): string => {
      const seed = c * 7 + r * 13 + (upper ? 31 : 0)
      const h = 285 + (seed * 11) % 35
      const s = 55 + (seed * 7) % 25
      const l = 8 + (seed * 5) % 20
      return `hsl(${h},${s}%,${l}%)`
    }

    const result: Array<{ key: string; points: string; fill: string }> = []
    for (let c = 0; c < COLS; c++) {
      for (let r = 0; r < ROWS; r++) {
        const tl = { x: vx(c, r), y: vy(c, r) }
        const tr = { x: vx(c + 1, r), y: vy(c + 1, r) }
        const bl = { x: vx(c, r + 1), y: vy(c, r + 1) }
        const br = { x: vx(c + 1, r + 1), y: vy(c + 1, r + 1) }
        result.push({
          key: `${c}-${r}-u`,
          points: `${tl.x},${tl.y} ${tr.x},${tr.y} ${bl.x},${bl.y}`,
          fill: color(c, r, true),
        })
        result.push({
          key: `${c}-${r}-l`,
          points: `${tr.x},${tr.y} ${br.x},${br.y} ${bl.x},${bl.y}`,
          fill: color(c, r, false),
        })
      }
    }
    return result
  }, [])
}

export function DesktopFrame() {
  const [currentTime, setCurrentTime] = useState("")
  const [openWindow, setOpenWindow] = useState<WindowType>(null)
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null)
  const wallpaperPolygons = useWallpaperPolygons()

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      setCurrentTime(
        now.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        }),
      )
    }
    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [])

  const handleDesktopClick = (e: React.MouseEvent) => {
    if (!(e.target as HTMLElement).closest("[data-desktop-icon]")) {
      setSelectedIcon(null)
    }
  }

  return (
    <div className="fixed inset-0 overflow-hidden select-none" onClick={handleDesktopClick}>
      {/* Low-poly purple geometric wallpaper */}
      <div className="absolute inset-0">
        <svg
          className="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1920 1080"
          preserveAspectRatio="xMidYMid slice"
        >
          <rect width="1920" height="1080" fill="#120520" />
          {wallpaperPolygons.map((p) => (
            <polygon key={p.key} points={p.points} fill={p.fill} />
          ))}
        </svg>
        {/* Subtle dark vignette overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(0,0,0,0.35) 100%)",
          }}
        />
      </div>

      {/* Desktop icons — left side, 2-column grid */}
      <div className="absolute top-4 left-4 grid grid-cols-2 gap-x-2 gap-y-5">
        <DesktopIcon
          id="about"
          label="About Me"
          iconType="user"
          selected={selectedIcon === "about"}
          onSelect={() => setSelectedIcon("about")}
          onOpen={() => setOpenWindow("about")}
        />
        <DesktopIcon
          id="projects"
          label="Projects"
          iconType="folder"
          selected={selectedIcon === "projects"}
          onSelect={() => setSelectedIcon("projects")}
          onOpen={() => setOpenWindow("projects")}
        />
        <DesktopIcon
          id="contact"
          label="Contact"
          iconType="mail"
          selected={selectedIcon === "contact"}
          onSelect={() => setSelectedIcon("contact")}
          onOpen={() => setOpenWindow("contact")}
        />
        <DesktopIcon
          id="clients"
          label="Clients"
          iconType="users"
          selected={selectedIcon === "clients"}
          onSelect={() => setSelectedIcon("clients")}
          onOpen={() => window.open("https://discord.gg/vXyexjM54x", "_blank")}
        />
        <DesktopIcon
          id="resume"
          label="Resume"
          iconType="resume"
          selected={selectedIcon === "resume"}
          onSelect={() => setSelectedIcon("resume")}
          onOpen={() => window.open("/resume.pdf")}
        />
      </div>

      {/* Open windows */}
      {openWindow === "about" && <AboutWindow onClose={() => setOpenWindow(null)} />}
      {openWindow === "projects" && <ExplorerWindow onClose={() => setOpenWindow(null)} />}
      {openWindow === "contact" && <ContactWindow onClose={() => setOpenWindow(null)} />}

      {/* Taskbar */}
      <div className="absolute bottom-0 left-0 right-0 h-10 bg-black/70 backdrop-blur-sm border-t border-white/[0.08] flex items-center justify-between px-3 z-[100]">
        <div className="flex items-center gap-1.5">
          {/* π start button */}
          <button className="h-8 px-2.5 flex items-center justify-center text-white font-bold text-xl hover:bg-white/10 rounded transition-colors">
            π
          </button>
          {/* Search */}
          <button className="w-8 h-8 flex items-center justify-center text-white/50 hover:text-white/80 hover:bg-white/10 rounded transition-colors">
            <Search className="w-4 h-4" />
          </button>

          {/* Active window pill */}
          {openWindow && (
            <div className="ml-2 h-8 px-3 flex items-center gap-2 bg-white/10 border border-white/15 rounded text-xs text-white/80 select-none">
              {openWindow === "projects" && "📁 Projects"}
              {openWindow === "about" && "👤 About Me"}
              {openWindow === "contact" && "✉️ Contact"}
            </div>
          )}
        </div>

        {/* Clock */}
        <div className="text-white/70 text-xs font-medium tabular-nums select-none">{currentTime}</div>
      </div>
    </div>
  )
}
