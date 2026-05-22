"use client"

import { useEffect, useRef, useState } from "react"
import { X, Minus, Square } from "lucide-react"

interface AboutWindowProps {
  onClose: () => void
}

export function AboutWindow({ onClose }: AboutWindowProps) {
  const [position, setPosition] = useState({ x: 220, y: 90 })
  const isDragging = useRef(false)
  const dragOffset = useRef({ x: 0, y: 0 })

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
      style={{ left: position.x, top: position.y, width: 400 }}
    >
      {/* Title bar */}
      <div
        className="h-8 bg-[#110f1e] flex items-center justify-between px-3 cursor-grab active:cursor-grabbing shrink-0 select-none"
        onMouseDown={startDrag}
      >
        <span className="text-white/90 text-sm pointer-events-none">About Me</span>
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

      {/* Content */}
      <div className="p-5 space-y-4 overflow-y-auto">
        {/* Profile header */}
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-700 flex items-center justify-center shrink-0 shadow-lg">
            <span className="text-white text-2xl font-bold">S</span>
          </div>
          <div>
            <h2 className="text-white font-semibold text-lg leading-tight">Seeker</h2>
            <p className="text-white/50 text-sm">AI Automation & Backend Systems Engineer</p>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/10" />

        {/* About */}
        <p className="text-sm text-white/60 leading-relaxed">
          Backend Systems Engineer specializing in AI automation, real-time infrastructure, and high-performance web applications.
        </p>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white/5 border border-white/10 rounded p-3 text-center">
            <div className="text-2xl font-bold text-white">30+</div>
            <div className="text-xs text-white/40 mt-0.5">Projects</div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded p-3 text-center">
            <div className="text-2xl font-bold text-white">5+</div>
            <div className="text-xs text-white/40 mt-0.5">Technologies</div>
          </div>
        </div>

        {/* Skills */}
        <div className="space-y-2.5">
          <div className="text-[10px] text-white/30 uppercase tracking-wider font-semibold select-none">Skills</div>
          {[
            { name: "Golang", color: "from-cyan-500 to-cyan-700" },
            { name: "React", color: "from-blue-500 to-blue-700" },
            { name: "Next.js", color: "from-zinc-500 to-zinc-700" },
          ].map((skill) => (
            <div key={skill.name} className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-white/70">{skill.name}</span>
                <span className="text-white/30">MAX</span>
              </div>
              <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div className={`h-full bg-gradient-to-r ${skill.color} rounded-full w-full`} />
              </div>
            </div>
          ))}
        </div>

        {/* Tech tags */}
        <div className="flex flex-wrap gap-1.5">
          {["Golang", "React", "Next.js", "TypeScript", "C++"].map((tech) => (
            <span
              key={tech}
              className="px-2.5 py-1 text-xs text-white/60 bg-white/5 border border-white/10 rounded"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
