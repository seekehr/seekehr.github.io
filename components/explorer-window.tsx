"use client"

import { useState, useEffect, useRef } from "react"
import { X, Minus, Square, ChevronLeft, ChevronRight, FolderOpen, Search } from "lucide-react"
import { getProjects, type Project } from "@/lib/projects"

interface ExplorerWindowProps {
  onClose: () => void
}

function SidebarItem({ icon, label, active }: { icon: string; label: string; active?: boolean }) {
  return (
    <div
      className={`flex items-center gap-2 px-2 py-1 rounded text-xs cursor-default select-none ${
        active ? "bg-blue-700/40 text-white/95" : "text-white/50 hover:bg-white/5 hover:text-white/70"
      }`}
    >
      <span className="shrink-0">{icon}</span>
      <span className="truncate">{label}</span>
    </div>
  )
}

export function ExplorerWindow({ onClose }: ExplorerWindowProps) {
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [position, setPosition] = useState({ x: 80, y: 44 })
  const isDragging = useRef(false)
  const dragOffset = useRef({ x: 0, y: 0 })

  useEffect(() => {
    getProjects().then((data) => {
      setProjects(data)
      setIsLoading(false)
    })
  }, [])

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!isDragging.current) return
      setPosition({
        x: Math.max(0, e.clientX - dragOffset.current.x),
        y: Math.max(0, e.clientY - dragOffset.current.y),
      })
    }
    const onUp = () => { isDragging.current = false }
    window.addEventListener("mousemove", onMove)
    window.addEventListener("mouseup", onUp)
    return () => { window.removeEventListener("mousemove", onMove); window.removeEventListener("mouseup", onUp) }
  }, [])

  const startDrag = (e: React.MouseEvent) => {
    isDragging.current = true
    dragOffset.current = { x: e.clientX - position.x, y: e.clientY - position.y }
  }

  return (
    <div
      className="absolute z-50 flex flex-col bg-[#1a1728] border border-white/10 shadow-2xl overflow-hidden"
      style={{
        left: position.x,
        top: position.y,
        width: "min(920px, calc(100vw - 100px))",
        height: "min(580px, calc(100vh - 90px))",
      }}
    >
      {/* Title bar */}
      <div
        className="h-8 bg-[#110f1e] flex items-center justify-between px-3 cursor-grab active:cursor-grabbing shrink-0 select-none"
        onMouseDown={startDrag}
      >
        <div className="flex items-center gap-2 pointer-events-none">
          <FolderOpen className="w-4 h-4 text-yellow-400" />
          <span className="text-white/90 text-sm">Projects</span>
        </div>
        <div className="flex items-center pointer-events-auto">
          <button className="w-8 h-7 flex items-center justify-center hover:bg-white/10 text-white/40 hover:text-white/80 transition-colors">
            <Minus className="w-3.5 h-3.5" />
          </button>
          <button className="w-8 h-7 flex items-center justify-center hover:bg-white/10 text-white/40 hover:text-white/80 transition-colors">
            <Square className="w-3 h-3" />
          </button>
          <button
            onClick={onClose}
            className="w-8 h-7 flex items-center justify-center hover:bg-red-600 text-white/40 hover:text-white transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Navigation bar */}
      <div className="h-9 bg-[#15132a]/60 border-b border-white/10 flex items-center gap-1.5 px-2 shrink-0">
        <button className="w-7 h-7 flex items-center justify-center hover:bg-white/10 rounded text-white/30 cursor-default">
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button className="w-7 h-7 flex items-center justify-center hover:bg-white/10 rounded text-white/30 cursor-default">
          <ChevronRight className="w-4 h-4" />
        </button>
        <div className="flex-1 h-6 bg-[#0c0a18] border border-white/10 px-2 flex items-center">
          <span className="text-white/40 text-xs select-none">Portfolio › Projects</span>
        </div>
        <div className="w-40 h-6 bg-[#0c0a18] border border-white/10 px-2 flex items-center gap-1.5">
          <Search className="w-3 h-3 text-white/30 shrink-0" />
          <input
            type="text"
            placeholder="Search Projects"
            className="bg-transparent text-xs text-white/60 outline-none w-full placeholder:text-white/25"
          />
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-44 shrink-0 border-r border-white/10 bg-[#15132a]/50 overflow-y-auto p-2 space-y-0.5">
          <div className="text-white/30 text-[10px] font-semibold uppercase tracking-wider mb-1.5 px-2 select-none">
            Quick Access
          </div>
          <SidebarItem icon="📁" label="Projects" active />
          <SidebarItem icon="👤" label="About Me" />
          <SidebarItem icon="✉️" label="Contact" />
          <SidebarItem icon="💬" label="Discord" />

          {selectedProject && (
            <div className="mt-4 space-y-1.5">
              <div className="text-white/30 text-[10px] font-semibold uppercase tracking-wider px-2 select-none">
                Details
              </div>
              <div className="px-2 space-y-1.5">
                <div className="text-xs text-white/90 font-medium leading-tight">{selectedProject.title}</div>
                <div className="text-[11px] text-white/45 leading-relaxed line-clamp-5">
                  {selectedProject.description}
                </div>
                <div className="flex flex-wrap gap-1 pt-0.5">
                  {selectedProject.technologies.slice(0, 4).map((t) => (
                    <span
                      key={t}
                      className="px-1.5 py-0.5 bg-purple-900/50 border border-purple-700/30 text-purple-300/80 rounded text-[9px]"
                    >
                      {t}
                    </span>
                  ))}
                </div>
                <div className="text-[10px] text-blue-400/60 mt-1 select-none">Double-click to open</div>
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
                  <span className="text-[11px] text-white/65 text-center leading-tight line-clamp-2 max-w-[72px] w-full">
                    {project.title}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Status bar */}
      <div className="h-6 shrink-0 bg-[#110f1e] border-t border-white/10 flex items-center px-3 gap-6 text-white/30 text-[11px] select-none">
        <span>{projects.length} items</span>
        {selectedProject && (
          <span>
            &quot;{selectedProject.title}&quot; selected — double-click to open
          </span>
        )}
      </div>
    </div>
  )
}
