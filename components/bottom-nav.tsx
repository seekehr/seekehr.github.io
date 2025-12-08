"use client"

import { Home, FolderOpen, Users } from "lucide-react"
import type { Screen } from "@/components/phone-frame"

interface BottomNavProps {
  currentScreen: Screen
  onNavigate: (screen: Screen) => void
}

export function BottomNav({ currentScreen, onNavigate }: BottomNavProps) {
  const navItems = [
    { id: "home" as Screen, icon: Home, label: "Home", gradient: "from-blue-400 to-blue-600" },
    { id: "projects" as Screen, icon: FolderOpen, label: "Projects", gradient: "from-orange-400 to-orange-600" },
    { id: "clients" as Screen, icon: Users, label: "Clients", gradient: "from-green-400 to-green-600" },
  ]

  return (
    <div className="absolute bottom-4 left-4 right-4">
      <div className="bg-black/40 glass-effect rounded-2xl p-2">
        <div className="flex justify-around">
          {navItems.map(({ id, icon: Icon, label, gradient }) => (
            <button
              key={id}
              onClick={() => onNavigate(id)}
              className="flex flex-col items-center gap-1 p-2 transition-transform active:scale-90"
            >
              <div
                className={`w-12 h-12 app-icon bg-gradient-to-br ${gradient} flex items-center justify-center ${
                  currentScreen === id ? "ring-2 ring-white/50 ring-offset-2 ring-offset-transparent" : ""
                }`}
              >
                <Icon className="w-6 h-6 text-white drop-shadow-sm" />
              </div>
              <span className="text-xs text-white font-semibold drop-shadow-md">{label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
