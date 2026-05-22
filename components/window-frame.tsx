"use client"

import { useState, useRef, useEffect } from "react"
import { X, Minus, Square, Maximize2 } from "lucide-react"

interface WindowFrameProps {
  title: string
  icon?: React.ReactNode
  initialPos?: { x: number; y: number }
  initialSize?: { w: number; h: number }
  minW?: number
  minH?: number
  onClose: () => void
  onMinimize: () => void
  zIndex?: number
  onFocus?: () => void
  children: React.ReactNode
}

type ResizeDir = "n" | "ne" | "e" | "se" | "s" | "sw" | "w" | "nw"

const EDGE = 5
const CORNER = 12

export function WindowFrame({
  title,
  icon,
  initialPos = { x: 100, y: 60 },
  initialSize = { w: 600, h: 400 },
  minW = 300,
  minH = 200,
  onClose,
  onMinimize,
  zIndex = 50,
  onFocus,
  children,
}: WindowFrameProps) {
  const [pos, setPos] = useState(initialPos)
  const [size, setSize] = useState(initialSize)
  const [maximized, setMaximized] = useState(false)
  const prev = useRef({ pos: initialPos, size: initialSize })
  const maximizedRef = useRef(false)

  const isDragging = useRef(false)
  const dragOffset = useRef({ x: 0, y: 0 })
  const isResizing = useRef(false)
  const resizeDir = useRef<ResizeDir>("e")
  const resizeStart = useRef({ x: 0, y: 0, px: 0, py: 0, w: 0, h: 0 })
  const posRef = useRef(initialPos)
  const sizeRef = useRef(initialSize)
  posRef.current = pos
  sizeRef.current = size

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (isDragging.current && !maximizedRef.current) {
        setPos({
          x: Math.max(0, e.clientX - dragOffset.current.x),
          y: Math.max(0, e.clientY - dragOffset.current.y),
        })
      }
      if (isResizing.current) {
        const dx = e.clientX - resizeStart.current.x
        const dy = e.clientY - resizeStart.current.y
        const dir = resizeDir.current
        let { px: nx, py: ny, w: nw, h: nh } = resizeStart.current
        if (dir.includes("e")) nw = Math.max(minW, resizeStart.current.w + dx)
        if (dir.includes("s")) nh = Math.max(minH, resizeStart.current.h + dy)
        if (dir.includes("w")) { nw = Math.max(minW, resizeStart.current.w - dx); nx = resizeStart.current.px + (resizeStart.current.w - nw) }
        if (dir.includes("n")) { nh = Math.max(minH, resizeStart.current.h - dy); ny = resizeStart.current.py + (resizeStart.current.h - nh) }
        setPos({ x: nx, y: ny })
        setSize({ w: nw, h: nh })
      }
    }
    const onUp = () => {
      isDragging.current = false
      isResizing.current = false
      document.body.style.cursor = ""
      document.body.style.userSelect = ""
    }
    window.addEventListener("mousemove", onMove)
    window.addEventListener("mouseup", onUp)
    return () => { window.removeEventListener("mousemove", onMove); window.removeEventListener("mouseup", onUp) }
  }, [minW, minH])

  const startDrag = (e: React.MouseEvent) => {
    if (maximizedRef.current) return
    e.preventDefault()
    isDragging.current = true
    dragOffset.current = { x: e.clientX - posRef.current.x, y: e.clientY - posRef.current.y }
    document.body.style.cursor = "grabbing"
    document.body.style.userSelect = "none"
    onFocus?.()
  }

  const startResize = (e: React.MouseEvent, dir: ResizeDir) => {
    e.preventDefault()
    e.stopPropagation()
    isResizing.current = true
    resizeDir.current = dir
    resizeStart.current = { x: e.clientX, y: e.clientY, px: posRef.current.x, py: posRef.current.y, w: sizeRef.current.w, h: sizeRef.current.h }
    document.body.style.userSelect = "none"
    onFocus?.()
  }

  const toggleMaximize = () => {
    if (maximizedRef.current) {
      setPos(prev.current.pos)
      setSize(prev.current.size)
      setMaximized(false)
      maximizedRef.current = false
    } else {
      prev.current = { pos: posRef.current, size: sizeRef.current }
      setMaximized(true)
      maximizedRef.current = true
    }
  }

  const glassStyle = {
    background: "rgba(14, 8, 28, 0.58)",
    backdropFilter: "blur(40px) saturate(200%) brightness(1.08)",
    WebkitBackdropFilter: "blur(40px) saturate(200%) brightness(1.08)",
    border: "1px solid rgba(255,255,255,0.12)",
    boxShadow: "0 24px 64px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.09)",
  } as React.CSSProperties

  return (
    <div
      className="absolute flex flex-col"
      style={maximized
        ? { ...glassStyle, left: 0, top: 0, right: 0, bottom: 40, zIndex, borderRadius: 0 }
        : { ...glassStyle, left: pos.x, top: pos.y, width: size.w, height: size.h, zIndex, borderRadius: 5 }
      }
      onMouseDown={() => onFocus?.()}
    >
      {/* Resize handles — corners first (higher z) then edges */}
      {!maximized && (
        <>
          <div style={{ position: "absolute", top: 0, left: 0, width: CORNER, height: CORNER, zIndex: 10, cursor: "nw-resize" }} onMouseDown={e => startResize(e, "nw")} />
          <div style={{ position: "absolute", top: 0, right: 0, width: CORNER, height: CORNER, zIndex: 10, cursor: "ne-resize" }} onMouseDown={e => startResize(e, "ne")} />
          <div style={{ position: "absolute", bottom: 0, left: 0, width: CORNER, height: CORNER, zIndex: 10, cursor: "sw-resize" }} onMouseDown={e => startResize(e, "sw")} />
          <div style={{ position: "absolute", bottom: 0, right: 0, width: CORNER, height: CORNER, zIndex: 10, cursor: "se-resize" }} onMouseDown={e => startResize(e, "se")} />
          <div style={{ position: "absolute", top: 0, left: CORNER, right: CORNER, height: EDGE, zIndex: 9, cursor: "n-resize" }} onMouseDown={e => startResize(e, "n")} />
          <div style={{ position: "absolute", bottom: 0, left: CORNER, right: CORNER, height: EDGE, zIndex: 9, cursor: "s-resize" }} onMouseDown={e => startResize(e, "s")} />
          <div style={{ position: "absolute", top: CORNER, bottom: CORNER, left: 0, width: EDGE, zIndex: 9, cursor: "w-resize" }} onMouseDown={e => startResize(e, "w")} />
          <div style={{ position: "absolute", top: CORNER, bottom: CORNER, right: 0, width: EDGE, zIndex: 9, cursor: "e-resize" }} onMouseDown={e => startResize(e, "e")} />
        </>
      )}

      {/* Title bar */}
      <div
        className="h-8 flex items-center justify-between px-3 shrink-0 select-none"
        style={{
          background: "rgba(90, 45, 160, 0.38)",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          cursor: maximized ? "default" : "grab",
          borderRadius: maximized ? 0 : "4px 4px 0 0",
        }}
        onMouseDown={startDrag}
        onDoubleClick={toggleMaximize}
      >
        <div className="flex items-center gap-2 pointer-events-none">
          {icon}
          <span className="text-white/90 text-sm" style={{ fontFamily: '"Segoe UI", Tahoma, sans-serif' }}>{title}</span>
        </div>
        <div className="flex items-center pointer-events-auto" onMouseDown={e => e.stopPropagation()}>
          <button
            onClick={onMinimize}
            className="w-8 h-7 flex items-center justify-center text-white/40 hover:text-white/80 hover:bg-white/10 transition-colors"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={toggleMaximize}
            className="w-8 h-7 flex items-center justify-center text-white/40 hover:text-white/80 hover:bg-white/10 transition-colors"
          >
            {maximized ? <Maximize2 className="w-3 h-3" /> : <Square className="w-3 h-3" />}
          </button>
          <button
            onClick={onClose}
            className="w-8 h-7 flex items-center justify-center text-white/40 hover:text-white hover:bg-red-600 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Window content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {children}
      </div>
    </div>
  )
}
