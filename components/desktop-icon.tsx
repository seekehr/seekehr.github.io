"use client"

import { useRef } from "react"
import { Mail, Users, FileText } from "lucide-react"

interface DesktopIconProps {
  id: string
  label: string
  iconType: "folder" | "user" | "mail" | "users" | "resume"
  selected: boolean
  onSelect: () => void
  onOpen: () => void
}

function FolderSVG() {
  return (
    <svg viewBox="0 0 48 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-11 h-9">
      <path d="M2 6a4 4 0 014-4h12l4 6H44a4 4 0 014 4v24a4 4 0 01-4 4H6a4 4 0 01-4-4V6z" fill="#d97706" />
      <path d="M2 12h44v22a4 4 0 01-4 4H6a4 4 0 01-4-4V12z" fill="#fbbf24" />
      <rect x="12" y="20" width="24" height="3" rx="1.5" fill="#d97706" opacity="0.4" />
      <rect x="12" y="26" width="18" height="3" rx="1.5" fill="#d97706" opacity="0.4" />
    </svg>
  )
}

function IconContent({ type }: { type: string }) {
  switch (type) {
    case "folder":
      return (
        <div className="w-full h-full flex items-center justify-center bg-transparent">
          <FolderSVG />
        </div>
      )
    case "user":
      return (
        <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-700 flex items-center justify-center">
          <span className="text-white text-3xl font-bold drop-shadow">S</span>
        </div>
      )
    case "mail":
      return (
        <div className="w-full h-full bg-gradient-to-br from-red-500 to-rose-700 flex items-center justify-center">
          <Mail className="w-9 h-9 text-white drop-shadow" />
        </div>
      )
    case "users":
      return (
        <div className="w-full h-full bg-gradient-to-br from-emerald-500 to-green-700 flex items-center justify-center">
          <Users className="w-9 h-9 text-white drop-shadow" />
        </div>
      )
    case "resume":
      return (
        <div className="w-full h-full bg-gradient-to-br from-slate-500 to-slate-700 flex items-center justify-center">
          <FileText className="w-9 h-9 text-white drop-shadow" />
        </div>
      )
    default:
      return null
  }
}

export function DesktopIcon({ id, label, iconType, selected, onSelect, onOpen }: DesktopIconProps) {
  const clickTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()

    if (clickTimer.current) {
      clearTimeout(clickTimer.current)
      clickTimer.current = null
      onOpen()
    } else {
      onSelect()
      clickTimer.current = setTimeout(() => {
        clickTimer.current = null
      }, 300)
    }
  }

  return (
    <div
      data-desktop-icon
      className="flex flex-col items-center gap-1 cursor-default w-20 p-1 rounded"
      onClick={handleClick}
    >
      <div
        className={`w-16 h-16 rounded overflow-hidden transition-all ${
          selected ? "brightness-125 ring-2 ring-blue-400/60 ring-offset-1 ring-offset-transparent" : ""
        }`}
      >
        <IconContent type={iconType} />
      </div>
      <span
        className={`text-[11px] text-white text-center px-1.5 py-0.5 rounded leading-tight w-full truncate ${
          selected ? "bg-blue-600/70" : "bg-black/50"
        }`}
      >
        {label}
      </span>
    </div>
  )
}
