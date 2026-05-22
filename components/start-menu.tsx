"use client"

import { useEffect, useRef } from "react"
import { ChevronRight } from "lucide-react"

/* ── Compact icon artwork reused from desktop-icon (inline for size) ── */
function MenuIconFolder() {
  return (
    <svg viewBox="0 0 64 52" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <path d="M2 18H62V48Q62 52 58 52H6Q2 52 2 48V18Z" fill="#b56808"/>
      <path d="M2 18H24L29 11H2V18Z" fill="#b56808"/>
      <path d="M2 22H62V48Q62 52 58 52H6Q2 52 2 48V22Z" fill="#f0b420"/>
      <path d="M2 22H62V30Q32 35 2 30V22Z" fill="rgba(255,230,120,0.45)"/>
    </svg>
  )
}
function MenuIconUser() {
  return (
    <svg viewBox="0 0 56 60" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <path d="M4 58Q4 38 28 38Q52 38 52 58Z" fill="#2563eb"/>
      <path d="M10 58Q10 44 28 42Q46 44 46 58Z" fill="#3b82f6" opacity="0.5"/>
      <circle cx="28" cy="19" r="15" fill="#3b82f6"/>
      <ellipse cx="23" cy="13" rx="7" ry="5" fill="rgba(255,255,255,0.3)"/>
    </svg>
  )
}
function MenuIconMail() {
  return (
    <svg viewBox="0 0 64 52" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <rect x="2" y="10" width="60" height="40" rx="3" fill="#e8eef8"/>
      <path d="M2 10 L32 32 L62 10Z" fill="#c8d4ec"/>
      <rect x="2" y="10" width="60" height="8" rx="3 3 0 0" fill="#2563eb"/>
      <rect x="2" y="10" width="60" height="4" rx="3 3 0 0" fill="rgba(255,255,255,0.25)"/>
    </svg>
  )
}
function MenuIconUsers() {
  return (
    <svg viewBox="0 0 64 58" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <circle cx="43" cy="18" r="11" fill="#86efac"/>
      <path d="M22 56Q22 40 43 40Q60 40 62 56Z" fill="#4ade80" opacity="0.7"/>
      <circle cx="22" cy="20" r="13" fill="#16a34a"/>
      <ellipse cx="17" cy="14" rx="6" ry="4" fill="rgba(255,255,255,0.28)"/>
      <path d="M2 58Q2 40 22 40Q42 40 42 58Z" fill="#15803d"/>
    </svg>
  )
}
function MenuIconDocument() {
  return (
    <svg viewBox="0 0 52 62" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <rect x="2" y="2" width="44" height="55" rx="2" fill="#f0f4ff"/>
      <path d="M36 2 L46 12 H36Z" fill="#dde6f5"/>
      <rect x="2" y="2" width="34" height="14" rx="2 0 0 0" fill="#3b82f6"/>
      <rect x="2" y="2" width="34" height="7" rx="2 0 0 0" fill="rgba(255,255,255,0.25)"/>
      <rect x="8" y="22" width="28" height="3" rx="1.5" fill="#94a3b8"/>
      <rect x="8" y="30" width="32" height="3" rx="1.5" fill="#94a3b8"/>
      <rect x="8" y="38" width="24" height="3" rx="1.5" fill="#94a3b8"/>
    </svg>
  )
}

const iconMap: Record<string, () => JSX.Element> = {
  folder: MenuIconFolder,
  user:   MenuIconUser,
  mail:   MenuIconMail,
  users:  MenuIconUsers,
  resume: MenuIconDocument,
}

export interface StartMenuItem {
  id: string
  label: string
  iconType: "folder" | "user" | "mail" | "users" | "resume"
  onOpen: () => void
}

interface StartMenuProps {
  isOpen: boolean
  onClose: () => void
  items: StartMenuItem[]
}

export function StartMenu({ isOpen, onClose, items }: StartMenuProps) {
  const ref = useRef<HTMLDivElement>(null)

  /* close on outside click */
  useEffect(() => {
    if (!isOpen) return
    const handler = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) onClose()
    }
    const id = setTimeout(() => document.addEventListener("mousedown", handler), 0)
    return () => {
      clearTimeout(id)
      document.removeEventListener("mousedown", handler)
    }
  }, [isOpen, onClose])

  /* close on Escape */
  useEffect(() => {
    if (!isOpen) return
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose() }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      ref={ref}
      className="absolute bottom-10 left-0 z-[200] w-[260px] flex flex-col overflow-hidden shadow-2xl"
      style={{
        background: "rgba(12, 6, 24, 0.55)",
        backdropFilter: "blur(48px) saturate(200%) brightness(1.08)",
        WebkitBackdropFilter: "blur(48px) saturate(200%) brightness(1.08)",
        border: "1px solid rgba(255,255,255,0.12)",
        borderBottom: "none",
        borderRadius: "0 8px 0 0",
        boxShadow: "4px -4px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08)",
      }}
    >
      {/* Header */}
      <div
        className="px-4 py-3 border-b border-white/10 flex items-center gap-2"
        style={{ background: "rgba(80,40,140,0.4)" }}
      >
        <span
          className="text-white/90 text-[13px] font-semibold tracking-wide"
          style={{ fontFamily: '"Segoe UI", Tahoma, sans-serif' }}
        >
          Applications
        </span>
      </div>

      {/* App list */}
      <div className="flex">
        {/* Thin left accent bar */}
        <div className="w-1 shrink-0" style={{ background: "linear-gradient(to bottom, #6366f1, #3b82f6)" }} />

        {/* Items */}
        <div className="flex-1 py-1">
          {items.map((item) => {
            const Icon = iconMap[item.iconType] ?? iconMap.resume
            return (
              <button
                key={item.id}
                className="w-full flex items-center gap-3 px-3 py-2 hover:bg-white/10 active:bg-white/15 transition-colors text-left group"
                onClick={() => { item.onOpen(); onClose() }}
              >
                <div className="w-7 h-7 shrink-0">
                  <Icon />
                </div>
                <span
                  className="flex-1 text-white/85 text-[13px] group-hover:text-white transition-colors"
                  style={{ fontFamily: '"Segoe UI", Tahoma, sans-serif' }}
                >
                  {item.label}
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-white/20 group-hover:text-white/50 transition-colors shrink-0" />
              </button>
            )
          })}
        </div>
      </div>

      {/* Footer divider */}
      <div className="border-t border-white/10 px-4 py-2 flex items-center gap-2" style={{ background: "rgba(0,0,0,0.2)" }}>
        <span className="text-white/30 text-[11px]" style={{ fontFamily: '"Segoe UI", sans-serif' }}>
          Seeker Portfolio
        </span>
      </div>
    </div>
  )
}
