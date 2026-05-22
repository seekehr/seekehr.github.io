"use client"

import { WindowFrame } from "./window-frame"

interface AboutWindowProps {
  onClose: () => void
  onMinimize: () => void
  zIndex?: number
  onFocus?: () => void
}

export function AboutWindow({ onClose, onMinimize, zIndex, onFocus }: AboutWindowProps) {
  return (
    <WindowFrame
      title="About Me"
      initialPos={{ x: 220, y: 90 }}
      initialSize={{ w: 400, h: 460 }}
      minW={300}
      minH={280}
      onClose={onClose}
      onMinimize={onMinimize}
      zIndex={zIndex}
      onFocus={onFocus}
    >
      <div className="p-5 space-y-4 overflow-y-auto">
        {/* Profile header */}
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-700 flex items-center justify-center shrink-0 shadow-lg">
            <span className="text-white text-2xl font-bold">S</span>
          </div>
          <div>
            <h2 className="text-white font-semibold text-lg leading-tight">Seeker</h2>
            <p className="text-white/45 text-sm">AI Automation & Backend Systems Engineer</p>
          </div>
        </div>

        <div className="border-t border-white/8" />

        <p className="text-sm text-white/55 leading-relaxed">
          Backend Systems Engineer specializing in AI automation, real-time infrastructure, and high-performance web applications.
        </p>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white/5 border border-white/8 rounded p-3 text-center">
            <div className="text-2xl font-bold text-white">30+</div>
            <div className="text-xs text-white/35 mt-0.5">Projects</div>
          </div>
          <div className="bg-white/5 border border-white/8 rounded p-3 text-center">
            <div className="text-2xl font-bold text-white">5+</div>
            <div className="text-xs text-white/35 mt-0.5">Technologies</div>
          </div>
        </div>

        <div className="space-y-2.5">
          <div className="text-[10px] text-white/25 uppercase tracking-wider font-semibold select-none">Skills</div>
          {[
            { name: "Golang", color: "from-cyan-500 to-cyan-700" },
            { name: "React", color: "from-blue-500 to-blue-700" },
            { name: "Next.js", color: "from-zinc-500 to-zinc-700" },
          ].map((skill) => (
            <div key={skill.name} className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-white/65">{skill.name}</span>
                <span className="text-white/25">MAX</span>
              </div>
              <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div className={`h-full bg-gradient-to-r ${skill.color} rounded-full w-full`} />
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-1.5">
          {["Golang", "React", "Next.js", "TypeScript", "C++"].map((tech) => (
            <span key={tech} className="px-2.5 py-1 text-xs text-white/55 bg-white/5 border border-white/8 rounded">
              {tech}
            </span>
          ))}
        </div>
      </div>
    </WindowFrame>
  )
}
