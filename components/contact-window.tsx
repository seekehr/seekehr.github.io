"use client"

import { useEffect, useRef, useState } from "react"
import { X, Minus, Square, Mail, FileDown } from "lucide-react"

interface ContactWindowProps {
  onClose: () => void
}

function DiscordLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 71 55" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path
        d="M60.1045 4.8978C55.5792 2.82121 50.7265 1.2916 45.6527 0.41542C45.5603 0.39851 45.468 0.440769 45.4204 0.525289C44.7963 1.6353 44.105 3.0834 43.6209 4.2216C38.1637 3.4046 32.7345 3.4046 27.3892 4.2216C26.905 3.0581 26.1886 1.6353 25.5617 0.525289C25.5141 0.443589 25.4218 0.40133 25.3294 0.41542C20.2584 1.2888 15.4057 2.81841 10.8776 4.8978C10.8384 4.9147 10.8048 4.9429 10.7825 4.9795C1.57795 18.7309 -0.943561 32.1443 0.293408 45.3914C0.299005 45.4562 0.335386 45.5182 0.385761 45.5576C6.45866 50.0174 12.3413 52.7249 18.1147 54.5195C18.2071 54.5477 18.305 54.5139 18.3638 54.4378C19.7295 52.5728 20.9469 50.6063 21.9907 48.5383C22.0523 48.4172 21.9935 48.2735 21.8676 48.2256C19.9366 47.4931 18.0979 46.6 16.3292 45.5858C16.1893 45.5041 16.1781 45.304 16.3068 45.2082C16.679 44.9293 17.0513 44.6391 17.4067 44.3461C17.471 44.2926 17.5606 44.2813 17.6362 44.3151C29.2558 49.6202 41.8354 49.6202 53.3179 44.3151C53.3935 44.2785 53.4831 44.2898 53.5502 44.3433C53.9057 44.6363 54.2779 44.9293 54.6529 45.2082C54.7816 45.304 54.7732 45.5041 54.6333 45.5858C52.8646 46.6197 51.0259 47.4931 49.0921 48.2228C48.9662 48.2707 48.9102 48.4172 48.9718 48.5383C50.038 50.6034 51.2554 52.5699 52.5959 54.435C52.6519 54.5139 52.7526 54.5477 52.845 54.5195C58.6464 52.7249 64.529 50.0174 70.6019 45.5576C70.6551 45.5182 70.6802 45.4562 70.6802 45.3914C72.0547 32.2212 69.5087 18.8279 60.1045 4.8978ZM23.7259 37.3253C20.2276 37.3253 17.3451 34.1136 17.3451 30.1693C17.3451 26.225 20.1717 23.0133 23.7259 23.0133C27.308 23.0133 30.1626 26.2532 30.1066 30.1693C30.1066 34.1136 27.28 37.3253 23.7259 37.3253ZM47.3178 37.3253C43.8196 37.3253 40.9371 34.1136 40.9371 30.1693C40.9371 26.225 43.7636 23.0133 47.3178 23.0133C50.9 23.0133 53.7545 26.2532 53.6986 30.1693C53.6986 34.1136 50.9 37.3253 47.3178 37.3253Z"
        fill="currentColor"
      />
    </svg>
  )
}

export function ContactWindow({ onClose }: ContactWindowProps) {
  const [showEmail, setShowEmail] = useState(false)
  const [position, setPosition] = useState({ x: 320, y: 110 })
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
      style={{ left: position.x, top: position.y, width: 360 }}
    >
      {/* Title bar */}
      <div
        className="h-8 bg-[#110f1e] flex items-center justify-between px-3 cursor-grab active:cursor-grabbing shrink-0 select-none"
        onMouseDown={startDrag}
      >
        <span className="text-white/90 text-sm pointer-events-none">Contact</span>
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
      <div className="p-4 space-y-2.5">
        <p className="text-xs text-white/40 pb-1 select-none">Get in touch through any of these channels:</p>

        {/* Discord */}
        <button
          onClick={() => window.open("https://discord.gg/bHEjbQdEcx", "_blank")}
          className="w-full flex items-center gap-3 p-3 bg-indigo-600/15 border border-indigo-600/25 rounded hover:bg-indigo-600/25 transition-colors text-left"
        >
          <div className="w-10 h-10 bg-indigo-600 rounded flex items-center justify-center shrink-0">
            <DiscordLogo className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="text-white text-sm font-medium">Discord</div>
            <div className="text-white/40 text-xs">Join my server</div>
          </div>
        </button>

        {/* Gmail */}
        <button
          onClick={() => setShowEmail(!showEmail)}
          className="w-full flex items-center gap-3 p-3 bg-red-600/15 border border-red-600/25 rounded hover:bg-red-600/25 transition-colors text-left"
        >
          <div className="w-10 h-10 bg-red-600 rounded flex items-center justify-center shrink-0">
            <Mail className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-white text-sm font-medium">Gmail</div>
            <div className="text-white/40 text-xs truncate">
              {showEmail ? "grouchyseeker@gmail.com" : "Click to reveal email"}
            </div>
          </div>
        </button>

        {/* Resume */}
        <a
          href="/resume.pdf"
          download
          className="w-full flex items-center gap-3 p-3 bg-slate-600/15 border border-slate-600/25 rounded hover:bg-slate-600/25 transition-colors"
        >
          <div className="w-10 h-10 bg-slate-600 rounded flex items-center justify-center shrink-0">
            <FileDown className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="text-white text-sm font-medium">Resume</div>
            <div className="text-white/40 text-xs">Download PDF</div>
          </div>
        </a>
      </div>
    </div>
  )
}
