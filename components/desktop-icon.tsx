"use client"

import { useRef, useState } from "react"

interface DesktopIconProps {
  id: string
  label: string
  iconType: "folder" | "user" | "mail" | "users" | "resume"
  selected: boolean
  onSelect: () => void
  onOpen: () => void
  onFocus?: () => void
}

/* ─── Windows 7-style SVG icon artwork ─── */

function W7Folder() {
  return (
    <svg viewBox="0 0 64 52" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* Back flap */}
      <path d="M2 18H62V48Q62 52 58 52H6Q2 52 2 48V18Z" fill="#b56808"/>
      {/* Tab */}
      <path d="M2 18H24L29 11H2V18Z" fill="#b56808"/>
      {/* Front face */}
      <path d="M2 22H62V48Q62 52 58 52H6Q2 52 2 48V22Z" fill="#f0b420"/>
      {/* Top gloss */}
      <path d="M2 22H62V30Q32 35 2 30V22Z" fill="rgba(255,230,120,0.45)"/>
      {/* Left edge sheen */}
      <path d="M2 22H8V48Q8 52 6 52Q2 52 2 48Z" fill="rgba(255,200,50,0.2)"/>
      {/* Bottom shadow */}
      <path d="M2 47H62V48Q62 52 58 52H6Q2 52 2 48Z" fill="rgba(0,0,0,0.18)"/>
    </svg>
  )
}

function W7User() {
  return (
    <svg viewBox="0 0 56 60" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* Shadow */}
      <ellipse cx="28" cy="57" rx="20" ry="4" fill="rgba(0,0,0,0.25)"/>
      {/* Body */}
      <path d="M4 58Q4 38 28 38Q52 38 52 58Z" fill="#2563eb"/>
      {/* Body highlight */}
      <path d="M10 58Q10 44 28 42Q46 44 46 58Z" fill="#3b82f6" opacity="0.5"/>
      {/* Head */}
      <circle cx="28" cy="19" r="15" fill="#3b82f6"/>
      {/* Head highlight */}
      <ellipse cx="23" cy="13" rx="7" ry="5" fill="rgba(255,255,255,0.3)"/>
      {/* Face shadow */}
      <circle cx="28" cy="21" r="13" fill="#2563eb" opacity="0.3"/>
    </svg>
  )
}

function W7Mail() {
  return (
    <svg viewBox="0 0 64 52" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* Shadow */}
      <rect x="4" y="47" width="56" height="4" rx="2" fill="rgba(0,0,0,0.2)"/>
      {/* Envelope body */}
      <rect x="2" y="10" width="60" height="40" rx="3" fill="#e8eef8"/>
      {/* Envelope back flap */}
      <path d="M2 10 L32 32 L62 10Z" fill="#c8d4ec"/>
      {/* Side shadow */}
      <rect x="56" y="10" width="6" height="40" rx="0 3 3 0" fill="rgba(0,0,0,0.08)"/>
      {/* Envelope V-fold lines */}
      <path d="M2 48 L26 28" stroke="#b0bcd8" strokeWidth="1" opacity="0.5"/>
      <path d="M62 48 L38 28" stroke="#b0bcd8" strokeWidth="1" opacity="0.5"/>
      {/* Blue top stripe */}
      <rect x="2" y="10" width="60" height="8" rx="3 3 0 0" fill="#2563eb"/>
      {/* Gloss on stripe */}
      <rect x="2" y="10" width="60" height="4" rx="3 3 0 0" fill="rgba(255,255,255,0.25)"/>
    </svg>
  )
}

function W7Users() {
  return (
    <svg viewBox="0 0 64 58" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* Back person (right, muted) */}
      <circle cx="43" cy="18" r="11" fill="#86efac"/>
      <path d="M22 56Q22 40 43 40Q60 40 62 56Z" fill="#4ade80" opacity="0.7"/>
      {/* Front person (left, vibrant) */}
      <circle cx="22" cy="20" r="13" fill="#16a34a"/>
      {/* Head highlight */}
      <ellipse cx="17" cy="14" rx="6" ry="4" fill="rgba(255,255,255,0.28)"/>
      <path d="M2 58Q2 40 22 40Q42 40 42 58Z" fill="#15803d"/>
      {/* Body highlight */}
      <path d="M8 58Q8 46 22 43Q36 46 36 58Z" fill="rgba(255,255,255,0.12)"/>
      {/* Shadow */}
      <ellipse cx="28" cy="56" rx="24" ry="3" fill="rgba(0,0,0,0.2)"/>
    </svg>
  )
}

function W7Document() {
  return (
    <svg viewBox="0 0 52 62" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* Shadow */}
      <rect x="4" y="57" width="44" height="4" rx="2" fill="rgba(0,0,0,0.2)"/>
      {/* Page body */}
      <rect x="2" y="2" width="44" height="55" rx="2" fill="#f0f4ff"/>
      {/* Folded corner */}
      <path d="M36 2 L46 12 L36 12Z" fill="#c8d4ec"/>
      <path d="M36 2 L46 12 H36Z" fill="#dde6f5"/>
      {/* Header blue bar */}
      <rect x="2" y="2" width="34" height="14" rx="2 0 0 0" fill="#3b82f6"/>
      <rect x="2" y="2" width="34" height="7" rx="2 0 0 0" fill="rgba(255,255,255,0.25)"/>
      {/* Text lines */}
      <rect x="8" y="22" width="28" height="3" rx="1.5" fill="#94a3b8"/>
      <rect x="8" y="30" width="32" height="3" rx="1.5" fill="#94a3b8"/>
      <rect x="8" y="38" width="24" height="3" rx="1.5" fill="#94a3b8"/>
      <rect x="8" y="46" width="30" height="3" rx="1.5" fill="#cbd5e1"/>
      {/* Right edge shadow */}
      <rect x="42" y="14" width="4" height="43" rx="0 0 2 0" fill="rgba(0,0,0,0.07)"/>
    </svg>
  )
}

/* ─── Windows shortcut arrow overlay ─── */
function ShortcutArrow() {
  return (
    <div className="absolute bottom-0.5 left-0.5 w-[18px] h-[18px] pointer-events-none">
      <svg viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
        <rect x="0" y="0" width="18" height="18" rx="2" fill="white" opacity="0.85"/>
        <rect x="1" y="1" width="16" height="16" rx="1.5" fill="#1d4ed8"/>
        <path d="M4 13 L4 6 L13 6 L13 9 L8 9 L8 13 Z" fill="white"/>
        <path d="M8 5 L14 5 L14 11 L12 9 L9 12 L7 10 L10 7 Z" fill="white"/>
      </svg>
    </div>
  )
}

const iconComponents: Record<string, () => JSX.Element> = {
  folder: W7Folder,
  user:   W7User,
  mail:   W7Mail,
  users:  W7Users,
  resume: W7Document,
}

export function DesktopIcon({ id, label, iconType, selected, onSelect, onOpen }: DesktopIconProps) {
  const [hovered, setHovered] = useState(false)
  const clickTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (clickTimer.current) {
      clearTimeout(clickTimer.current)
      clickTimer.current = null
      onOpen()
    } else {
      onSelect()
      clickTimer.current = setTimeout(() => { clickTimer.current = null }, 300)
    }
  }

  const Icon = iconComponents[iconType] ?? iconComponents.resume

  return (
    <div
      data-desktop-icon
      className="relative flex flex-col items-center gap-1 cursor-default w-[82px] rounded"
      onClick={handleClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Liquid glass hover / select background */}
      {(hovered || selected) && (
        <div
          className="absolute inset-0 rounded pointer-events-none"
          style={{
            background: selected ? "rgba(30,80,180,0.22)" : "rgba(255,255,255,0.07)",
            backdropFilter: "blur(12px) saturate(160%)",
            WebkitBackdropFilter: "blur(12px) saturate(160%)",
            border: selected ? "1px solid rgba(100,160,255,0.3)" : "1px solid rgba(255,255,255,0.1)",
          }}
        />
      )}
      {/* Icon artwork — no background box, sits on wallpaper */}
      <div
        className={`w-[60px] h-[56px] relative flex items-center justify-center transition-all ${
          selected ? "drop-shadow-[0_0_8px_rgba(100,160,255,0.9)] brightness-110" : ""
        }`}
      >
        <Icon />
        <ShortcutArrow />
      </div>

      {/* Label */}
      <div
        className="relative text-[11.5px] text-white text-center leading-tight px-1 py-[2px] max-w-full w-full"
        style={{
          fontFamily: '"Segoe UI", Tahoma, Geneva, sans-serif',
          textShadow: "0 1px 3px rgba(0,0,0,1)",
          borderRadius: "1px",
          wordBreak: "break-word",
          hyphens: "none",
        }}
      >
        {label}
      </div>
    </div>
  )
}
