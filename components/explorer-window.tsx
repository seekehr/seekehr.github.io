"use client"

import { useState, useEffect } from "react"
import { FolderOpen, ChevronLeft, ChevronRight, Search } from "lucide-react"
import { getProjects, type Project } from "@/lib/projects"
import { WindowFrame } from "./window-frame"

interface ExplorerWindowProps {
  onClose: () => void
  onMinimize: () => void
  zIndex?: number
  onFocus?: () => void
  onOpenApp?: (app: string) => void
}

function SidebarItem({ icon, label, active, onClick }: { icon: string; label: string; active?: boolean; onClick?: () => void }) {
  return (
    <div
      className={`flex items-center gap-2 px-2 py-1 rounded text-xs select-none ${
        active
          ? "bg-blue-700/40 text-white/95 cursor-default"
          : "text-white/50 hover:bg-white/8 hover:text-white/70 cursor-pointer"
      }`}
      onClick={onClick}
    >
      <span className="shrink-0">{icon}</span>
      <span className="truncate">{label}</span>
    </div>
  )
}

export function ExplorerWindow({ onClose, onMinimize, zIndex, onFocus, onOpenApp }: ExplorerWindowProps) {
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)

  useEffect(() => {
    getProjects().then((data) => { setProjects(data); setIsLoading(false) })
  }, [])

  return (
    <WindowFrame
      title="Projects"
      icon={<FolderOpen className="w-4 h-4 text-yellow-400" />}
      initialPos={{ x: 80, y: 44 }}
      initialSize={{ w: 920, h: 560 }}
      minW={480}
      minH={280}
      onClose={onClose}
      onMinimize={onMinimize}
      zIndex={zIndex}
      onFocus={onFocus}
    >
      {/* Navigation bar */}
      <div
        className="h-9 flex items-center gap-1.5 px-2 shrink-0"
        style={{ background: "rgba(0,0,0,0.2)", borderBottom: "1px solid rgba(255,255,255,0.07)" }}
      >
        <button className="w-7 h-7 flex items-center justify-center hover:bg-white/10 rounded text-white/25 cursor-default">
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button className="w-7 h-7 flex items-center justify-center hover:bg-white/10 rounded text-white/25 cursor-default">
          <ChevronRight className="w-4 h-4" />
        </button>
        <div className="flex-1 h-6 bg-black/25 border border-white/8 px-2 flex items-center rounded-sm">
          <span className="text-white/35 text-xs select-none">Portfolio › Projects</span>
        </div>
        <div className="w-40 h-6 bg-black/25 border border-white/8 px-2 flex items-center gap-1.5 rounded-sm">
          <Search className="w-3 h-3 text-white/25 shrink-0" />
          <input
            type="text"
            placeholder="Search Projects"
            className="bg-transparent text-xs text-white/55 outline-none w-full placeholder:text-white/20"
          />
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div
          className="w-44 shrink-0 overflow-y-auto p-2 space-y-0.5"
          style={{ borderRight: "1px solid rgba(255,255,255,0.07)", background: "rgba(0,0,0,0.15)" }}
        >
          <div className="text-white/25 text-[10px] font-semibold uppercase tracking-wider mb-1.5 px-2 select-none">
            Quick Access
          </div>
          <SidebarItem icon="📁" label="Projects" active />
          <SidebarItem icon="👤" label="About Me" onClick={() => onOpenApp?.("about")} />
          <SidebarItem icon="✉️" label="Contact"  onClick={() => onOpenApp?.("contact")} />
          <SidebarItem icon="💬" label="Discord"  onClick={() => window.open("https://discord.gg/vXyexjM54x", "_blank")} />

          {selectedProject && (
            <div className="mt-4 space-y-1.5">
              <div className="text-white/25 text-[10px] font-semibold uppercase tracking-wider px-2 select-none">
                Details
              </div>
              <div className="px-2 space-y-1.5">
                <div className="text-xs text-white/90 font-medium leading-tight">{selectedProject.title}</div>
                <div className="text-[11px] text-white/40 leading-relaxed line-clamp-5">{selectedProject.description}</div>
                <div className="flex flex-wrap gap-1 pt-0.5">
                  {selectedProject.technologies.slice(0, 4).map((t) => (
                    <span key={t} className="px-1.5 py-0.5 bg-purple-900/40 border border-purple-700/25 text-purple-300/70 rounded text-[9px]">{t}</span>
                  ))}
                </div>
                <div className="text-[10px] text-blue-400/50 mt-1 select-none">Double-click to open</div>
              </div>
            </div>
          )}
        </div>

        {/* File grid */}
        <div className="flex-1 overflow-y-auto p-3">
          {isLoading ? (
            <div className="grid grid-cols-5 gap-3">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="flex flex-col items-center gap-1.5">
                  <div className="w-14 h-14 bg-white/5 rounded animate-pulse" />
                  <div className="h-3 w-14 bg-white/5 rounded animate-pulse" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-5 gap-2">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className={`flex flex-col items-center gap-1 p-2 rounded cursor-default transition-colors select-none ${
                    selectedProject?.id === project.id
                      ? "bg-blue-600/25 ring-1 ring-blue-400/40"
                      : "hover:bg-white/5"
                  }`}
                  onClick={() => setSelectedProject(project)}
                  onDoubleClick={() => window.open(project.externalUrl, "_blank", "noopener,noreferrer")}
                >
                  <div className="w-14 h-14 overflow-hidden bg-white/5 shrink-0">
                    {project.image ? (
                      <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-purple-600 to-blue-700 flex items-center justify-center">
                        <span className="text-white text-lg font-bold">{project.title.charAt(0)}</span>
                      </div>
                    )}
                  </div>
                  <span className="text-[11px] text-white/60 text-center leading-tight line-clamp-2 max-w-[72px] w-full">
                    {project.title}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Status bar */}
      <div
        className="h-6 shrink-0 flex items-center px-3 gap-6 text-white/25 text-[11px] select-none"
        style={{ borderTop: "1px solid rgba(255,255,255,0.07)", background: "rgba(0,0,0,0.25)" }}
      >
        <span>{projects.length} items</span>
        {selectedProject && <span>&quot;{selectedProject.title}&quot; selected — double-click to open</span>}
      </div>
    </WindowFrame>
  )
}
