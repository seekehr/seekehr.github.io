"use client"

import { useState, useEffect, useMemo, useRef } from "react"
import { Search } from "lucide-react"
import { DesktopIcon } from "./desktop-icon"
import { ExplorerWindow } from "./explorer-window"
import { AboutWindow } from "./about-window"
import { ContactWindow } from "./contact-window"
import { StartMenu } from "./start-menu"
import { SearchOverlay } from "./search-overlay"

type WindowId = "projects" | "about" | "contact"
interface WinState { minimized: boolean; zIndex: number }

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
        result.push({ key: `${c}-${r}-u`, points: `${tl.x},${tl.y} ${tr.x},${tr.y} ${bl.x},${bl.y}`, fill: color(c, r, true) })
        result.push({ key: `${c}-${r}-l`, points: `${tr.x},${tr.y} ${br.x},${br.y} ${bl.x},${bl.y}`, fill: color(c, r, false) })
      }
    }
    return result
  }, [])
}

const WINDOW_LABELS: Record<WindowId, string> = {
  projects: "📁 Projects",
  about: "👤 About Me",
  contact: "✉️ Contact",
}

export function DesktopFrame() {
  const [currentTime, setCurrentTime] = useState("")
  const [windows, setWindows] = useState<Partial<Record<WindowId, WinState>>>({})
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null)
  const [startMenuOpen, setStartMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const nextZ = useRef(50)
  const wallpaperPolygons = useWallpaperPolygons()

  useEffect(() => {
    const update = () => {
      const now = new Date()
      setCurrentTime(now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", second: "2-digit", hour12: true }))
    }
    update()
    const id = setInterval(update, 1000)
    return () => clearInterval(id)
  }, [])

  const openWin = (id: WindowId) => {
    setWindows(w => ({ ...w, [id]: { minimized: false, zIndex: nextZ.current++ } }))
  }

  const closeWin = (id: WindowId) => {
    setWindows(w => { const n = { ...w }; delete n[id]; return n })
  }

  const minimizeWin = (id: WindowId) => {
    setWindows(w => w[id] ? { ...w, [id]: { ...w[id]!, minimized: true } } : w)
  }

  const focusWin = (id: WindowId) => {
    setWindows(w => w[id] ? { ...w, [id]: { ...w[id]!, minimized: false, zIndex: nextZ.current++ } } : w)
  }

  const handleOpenApp = (app: string) => {
    if (app === "about" || app === "projects" || app === "contact") {
      const id = app as WindowId
      if (windows[id]) { focusWin(id) } else { openWin(id) }
    } else if (app === "clients") {
      window.open("https://discord.gg/vXyexjM54x", "_blank")
    } else if (app === "resume") {
      window.open("/resume.pdf")
    }
  }

  const handleDesktopClick = (e: React.MouseEvent) => {
    if (!(e.target as HTMLElement).closest("[data-desktop-icon]")) setSelectedIcon(null)
  }

  const startMenuItems = [
    { id: "about",    label: "About Me", iconType: "user"   as const, onOpen: () => handleOpenApp("about") },
    { id: "projects", label: "Projects", iconType: "folder" as const, onOpen: () => handleOpenApp("projects") },
    { id: "contact",  label: "Contact",  iconType: "mail"   as const, onOpen: () => handleOpenApp("contact") },
    { id: "clients",  label: "Clients",  iconType: "users"  as const, onOpen: () => window.open("https://discord.gg/vXyexjM54x", "_blank") },
    { id: "resume",   label: "Resume",   iconType: "resume" as const, onOpen: () => window.open("/resume.pdf") },
  ]

  return (
    <div className="fixed inset-0 overflow-hidden select-none" onClick={handleDesktopClick}>
      {/* Low-poly wallpaper */}
      <div className="absolute inset-0">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080" preserveAspectRatio="xMidYMid slice">
          <rect width="1920" height="1080" fill="#120520" />
          {wallpaperPolygons.map((p) => (
            <polygon key={p.key} points={p.points} fill={p.fill} />
          ))}
        </svg>
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(0,0,0,0.35) 100%)" }}
        />
      </div>

      {/* Desktop icons */}
      <div className="absolute top-4 left-6 flex flex-col gap-1">
        <DesktopIcon id="about"    label="About Me" iconType="user"   selected={selectedIcon === "about"}    onSelect={() => setSelectedIcon("about")}    onOpen={() => handleOpenApp("about")} />
        <DesktopIcon id="projects" label="Projects" iconType="folder" selected={selectedIcon === "projects"} onSelect={() => setSelectedIcon("projects")} onOpen={() => handleOpenApp("projects")} />
        <DesktopIcon id="contact"  label="Contact"  iconType="mail"   selected={selectedIcon === "contact"}  onSelect={() => setSelectedIcon("contact")}  onOpen={() => handleOpenApp("contact")} />
        <DesktopIcon id="clients"  label="Clients"  iconType="users"  selected={selectedIcon === "clients"}  onSelect={() => setSelectedIcon("clients")}  onOpen={() => window.open("https://discord.gg/vXyexjM54x", "_blank")} />
        <DesktopIcon id="resume"   label="Resume"   iconType="resume" selected={selectedIcon === "resume"}   onSelect={() => setSelectedIcon("resume")}   onOpen={() => window.open("/resume.pdf")} />
      </div>

      {/* Open windows */}
      {windows.about    && !windows.about.minimized    && <AboutWindow    onClose={() => closeWin("about")}    onMinimize={() => minimizeWin("about")}    zIndex={windows.about.zIndex}    onFocus={() => focusWin("about")} />}
      {windows.projects && !windows.projects.minimized && <ExplorerWindow onClose={() => closeWin("projects")} onMinimize={() => minimizeWin("projects")} zIndex={windows.projects.zIndex} onFocus={() => focusWin("projects")} onOpenApp={handleOpenApp} />}
      {windows.contact  && !windows.contact.minimized  && <ContactWindow  onClose={() => closeWin("contact")}  onMinimize={() => minimizeWin("contact")}  zIndex={windows.contact.zIndex}  onFocus={() => focusWin("contact")} />}

      {/* Start menu */}
      <StartMenu isOpen={startMenuOpen} onClose={() => setStartMenuOpen(false)} items={startMenuItems} />

      {/* Search overlay */}
      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} onOpenApp={handleOpenApp} />

      {/* Taskbar */}
      <div className="absolute bottom-0 left-0 right-0 h-10 border-t border-white/[0.08] flex items-center justify-between px-3 z-[100]"
        style={{ background: "rgba(8,4,18,0.72)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)" }}
      >
        <div className="flex items-center gap-1.5">
          {/* π start button */}
          <button
            onClick={(e) => { e.stopPropagation(); setStartMenuOpen(o => !o) }}
            className={`h-8 px-2.5 flex items-center justify-center text-white font-bold text-xl rounded transition-colors ${
              startMenuOpen ? "bg-white/20" : "hover:bg-white/10"
            }`}
          >
            π
          </button>

          {/* Search */}
          <button
            onClick={(e) => { e.stopPropagation(); setSearchOpen(o => !o) }}
            className={`w-8 h-8 flex items-center justify-center rounded transition-colors ${
              searchOpen ? "bg-white/20 text-white" : "text-white/50 hover:text-white/80 hover:bg-white/10"
            }`}
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Per-window taskbar pills */}
          {(Object.entries(windows) as [WindowId, WinState][]).map(([id, state]) => (
            <button
              key={id}
              onClick={(e) => { e.stopPropagation(); state.minimized ? focusWin(id) : minimizeWin(id) }}
              className={`ml-1 h-8 px-3 flex items-center gap-1.5 rounded text-xs transition-colors border ${
                state.minimized
                  ? "bg-white/5 border-white/10 text-white/35 hover:bg-white/10 hover:text-white/60"
                  : "bg-white/10 border-white/15 text-white/80 hover:bg-white/15"
              }`}
            >
              {WINDOW_LABELS[id]}
            </button>
          ))}
        </div>

        {/* Clock */}
        <div className="text-white/60 text-xs font-medium tabular-nums select-none">{currentTime}</div>
      </div>
    </div>
  )
}
