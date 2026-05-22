"use client"

import { useState, useEffect, useRef } from "react"
import { X, Search, FolderOpen, User, Mail, Users, FileText } from "lucide-react"
import { getProjects, type Project } from "@/lib/projects"

interface SearchOverlayProps {
  isOpen: boolean
  onClose: () => void
  onOpenApp: (app: string) => void
}

const SUGGESTED = [
  { id: "projects", label: "Projects",  Icon: FolderOpen, bg: "bg-amber-500",   desc: "Browse all projects" },
  { id: "about",    label: "About Me",  Icon: User,       bg: "bg-blue-600",    desc: "Profile & skills" },
  { id: "contact",  label: "Contact",   Icon: Mail,       bg: "bg-red-500",     desc: "Get in touch" },
  { id: "clients",  label: "Clients",   Icon: Users,      bg: "bg-emerald-600", desc: "Discord community" },
  { id: "resume",   label: "Resume",    Icon: FileText,   bg: "bg-slate-500",   desc: "Download CV" },
]

export function SearchOverlay({ isOpen, onClose, onOpenApp }: SearchOverlayProps) {
  const [query, setQuery] = useState("")
  const [projects, setProjects] = useState<Project[]>([])
  const [activeTab, setActiveTab] = useState("all")
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => { getProjects().then(setProjects) }, [])

  useEffect(() => {
    if (isOpen) {
      setQuery("")
      setActiveTab("all")
      setTimeout(() => inputRef.current?.focus(), 60)
    }
  }, [isOpen])

  /* close on Escape */
  useEffect(() => {
    if (!isOpen) return
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose() }
    window.addEventListener("keydown", h)
    return () => window.removeEventListener("keydown", h)
  }, [isOpen, onClose])

  const filtered = query.trim()
    ? projects.filter(p =>
        p.title.toLowerCase().includes(query.toLowerCase()) ||
        p.description.toLowerCase().includes(query.toLowerCase()) ||
        p.technologies.some(t => t.toLowerCase().includes(query.toLowerCase()))
      )
    : activeTab === "projects"
      ? projects
      : []

  if (!isOpen) return null

  return (
    /* backdrop */
    <div className="fixed inset-0 z-[300]" onClick={onClose}>
      <div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col overflow-hidden shadow-2xl"
        style={{
          width: "min(720px, calc(100vw - 48px))",
          background: "rgba(12, 6, 24, 0.55)",
          backdropFilter: "blur(48px) saturate(200%) brightness(1.08)",
          WebkitBackdropFilter: "blur(48px) saturate(200%) brightness(1.08)",
          border: "1px solid rgba(255,255,255,0.12)",
          borderBottom: "none",
          borderRadius: "8px 8px 0 0",
          boxShadow: "0 -8px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)",
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* ── Tab bar ── */}
        <div className="flex items-center px-4 border-b border-white/10">
          {["All", "Projects"].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab.toLowerCase())}
              className={`px-4 py-3 text-sm font-medium transition-colors relative ${
                activeTab === tab.toLowerCase()
                  ? "text-white"
                  : "text-white/45 hover:text-white/75"
              }`}
              style={{ fontFamily: '"Segoe UI", Tahoma, sans-serif' }}
            >
              {tab}
              {activeTab === tab.toLowerCase() && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 rounded-t-full" />
              )}
            </button>
          ))}
          <button
            onClick={onClose}
            className="ml-auto p-2 text-white/40 hover:text-white/80 hover:bg-white/10 rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ── Body ── */}
        {query.trim() || activeTab === "projects" ? (
          /* ── Search / Projects results ── */
          <div className="overflow-y-auto" style={{ maxHeight: "420px" }}>
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-white/30">
                <Search className="w-8 h-8 mb-3 opacity-40" />
                <span className="text-sm" style={{ fontFamily: '"Segoe UI", sans-serif' }}>
                  {query.trim() ? `No results for "${query}"` : "No projects found"}
                </span>
              </div>
            ) : (
              <div className="p-3 space-y-0.5">
                {filtered.map(project => (
                  <button
                    key={project.id}
                    onClick={() => { window.open(project.externalUrl, "_blank", "noopener,noreferrer"); onClose() }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-white/10 rounded text-left transition-colors group"
                  >
                    <div className="w-10 h-10 rounded overflow-hidden shrink-0 bg-white/5">
                      {project.image
                        ? <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
                        : <div className="w-full h-full bg-purple-700 flex items-center justify-center text-white font-bold text-sm">{project.title.charAt(0)}</div>
                      }
                    </div>
                    <div className="flex-1 min-w-0">
                      <div
                        className="text-white/90 text-[13px] font-medium truncate group-hover:text-white"
                        style={{ fontFamily: '"Segoe UI", sans-serif' }}
                      >
                        {project.title}
                      </div>
                      <div className="text-white/40 text-[11px] truncate">{project.description}</div>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      {project.technologies.slice(0, 2).map(t => (
                        <span key={t} className="px-1.5 py-0.5 bg-white/5 border border-white/10 text-white/40 text-[10px] rounded">
                          {t}
                        </span>
                      ))}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          /* ── Default home view ── */
          <div className="flex" style={{ minHeight: "360px" }}>
            {/* Left — Suggested */}
            <div className="w-[280px] shrink-0 p-5 border-r border-white/10">
              <div
                className="text-white/50 text-[11px] font-semibold uppercase tracking-wider mb-3"
                style={{ fontFamily: '"Segoe UI", sans-serif' }}
              >
                Suggested
              </div>
              <div className="space-y-0.5">
                {SUGGESTED.map(({ id, label, Icon, bg, desc }) => (
                  <button
                    key={id}
                    onClick={() => { onOpenApp(id); onClose() }}
                    className="w-full flex items-center gap-3 px-2 py-2.5 hover:bg-white/10 rounded transition-colors text-left group"
                  >
                    <div className={`w-8 h-8 ${bg} rounded flex items-center justify-center shrink-0`}>
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    <div className="min-w-0">
                      <div
                        className="text-white/85 text-[13px] font-medium group-hover:text-white transition-colors"
                        style={{ fontFamily: '"Segoe UI", sans-serif' }}
                      >
                        {label}
                      </div>
                      <div className="text-white/35 text-[11px]">{desc}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Right — Recent & Featured */}
            <div className="flex-1 p-5 space-y-5">
              {/* Recent */}
              <div>
                <div
                  className="text-white/50 text-[11px] font-semibold uppercase tracking-wider mb-3"
                  style={{ fontFamily: '"Segoe UI", sans-serif' }}
                >
                  Recent
                </div>
                <div className="space-y-1.5">
                  {projects.slice(0, 3).map(p => (
                    <button
                      key={p.id}
                      onClick={() => { window.open(p.externalUrl, "_blank", "noopener,noreferrer"); onClose() }}
                      className="flex items-center gap-2.5 px-2 py-1.5 hover:bg-white/10 rounded transition-colors w-full text-left"
                    >
                      <div className="w-5 h-5 rounded overflow-hidden shrink-0 bg-white/5">
                        {p.image && <img src={p.image} alt={p.title} className="w-full h-full object-cover" />}
                      </div>
                      <span
                        className="text-white/75 text-[13px] truncate hover:text-white"
                        style={{ fontFamily: '"Segoe UI", sans-serif' }}
                      >
                        {p.title}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Featured Projects */}
              <div>
                <div
                  className="text-white/50 text-[11px] font-semibold uppercase tracking-wider mb-3 flex items-center gap-1.5"
                  style={{ fontFamily: '"Segoe UI", sans-serif' }}
                >
                  <FolderOpen className="w-3 h-3" /> Featured Projects
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {projects.slice(3, 6).map(p => (
                    <button
                      key={p.id}
                      onClick={() => { window.open(p.externalUrl, "_blank", "noopener,noreferrer"); onClose() }}
                      className="group flex flex-col items-center"
                    >
                      <div className="w-full aspect-square rounded overflow-hidden bg-white/5 group-hover:ring-2 group-hover:ring-blue-500/50 transition-all">
                        {p.image
                          ? <img src={p.image} alt={p.title} className="w-full h-full object-cover" />
                          : <div className="w-full h-full bg-purple-800 flex items-center justify-center text-white font-bold">{p.title.charAt(0)}</div>
                        }
                      </div>
                      <span
                        className="text-white/55 text-[10px] text-center mt-1 leading-tight line-clamp-2 group-hover:text-white/80 transition-colors w-full"
                        style={{ fontFamily: '"Segoe UI", sans-serif' }}
                      >
                        {p.title}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Search bar ── */}
        <div
          className="border-t border-white/10 flex items-center gap-3 px-4 py-3"
          style={{ background: "rgba(0,0,0,0.25)", borderTop: "1px solid rgba(255,255,255,0.08)" }}
        >
          <Search className="w-4 h-4 text-white/40 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Type here to search"
            className="flex-1 bg-transparent text-white/90 text-sm outline-none placeholder:text-white/30"
            style={{ fontFamily: '"Segoe UI", Tahoma, sans-serif' }}
          />
          {query && (
            <button onClick={() => setQuery("")} className="text-white/30 hover:text-white/70 transition-colors">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
