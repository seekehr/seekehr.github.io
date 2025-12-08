"use client"

import { useState, useEffect, useRef } from "react"
import { getProjects, type Project } from "@/lib/projects"

export function ProjectsScreen() {
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [hoveredProject, setHoveredProject] = useState<number | null>(null)
  const [selectedProject, setSelectedProject] = useState<number | null>(null)
  const [popoverPosition, setPopoverPosition] = useState({ top: 0, left: 0 })
  const [popoverOnRight, setPopoverOnRight] = useState(false)
  const tapTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const lastTapRef = useRef<number>(0)

  useEffect(() => {
    getProjects().then((data) => {
      setProjects(data)
      setIsLoading(false)
      
      // Preload all project images
      data.forEach((project) => {
        if (project.image) {
          const img = new Image()
          img.src = project.image
        }
      })
    })
  }, [])

  // Close popover when clicking outside on mobile
  useEffect(() => {
    if (selectedProject && !window.matchMedia("(hover: hover)").matches) {
      const handleClickOutside = (event: MouseEvent) => {
        const target = event.target as HTMLElement
        if (!target.closest('[data-project-item]') && !target.closest('[data-project-popover]')) {
          setSelectedProject(null)
        }
      }
      // Small delay to avoid immediate closure
      setTimeout(() => {
        document.addEventListener('click', handleClickOutside)
      }, 100)
      return () => document.removeEventListener('click', handleClickOutside)
    }
  }, [selectedProject])

  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const handleMouseEnter = (projectId: number, event: React.MouseEvent<HTMLDivElement>) => {
    if (window.matchMedia("(hover: hover)").matches) {
      // Desktop: position at the icon location relative to phone screen
      const rect = event.currentTarget.getBoundingClientRect()
      const screenContainer = event.currentTarget.closest('[data-phone-screen]')
      const screenRect = screenContainer?.getBoundingClientRect()
      
      if (screenRect) {
        setPopoverPosition({
          top: (rect.top - screenRect.top) + (rect.height / 2),
          left: (rect.right - screenRect.left) + 8
        })
      } else {
        setPopoverPosition({
          top: rect.top + (rect.height / 2),
          left: rect.right + 8
        })
      }
      setPopoverOnRight(true)
      setHoveredProject(projectId)
    }
  }

  const handleMouseLeave = () => {
    if (window.matchMedia("(hover: hover)").matches) {
      setHoveredProject(null)
    }
  }

  const handlePopoverMouseEnter = () => {
    // Keep visible when hovering popover
  }

  const handlePopoverMouseLeave = () => {
    if (window.matchMedia("(hover: hover)").matches) {
      setHoveredProject(null)
    }
  }

  const handleClick = (project: Project, event: React.MouseEvent<HTMLDivElement>) => {
    // Desktop: click opens URL directly
    if (window.matchMedia("(hover: hover)").matches) {
      window.open(project.externalUrl, "_blank", "noopener,noreferrer")
      return
    }

    // Mobile: handle tap logic
    event.preventDefault()
    const currentTime = Date.now()
    const tapLength = currentTime - lastTapRef.current

    if (tapLength < 300 && tapLength > 0) {
      // Double tap - open URL
      if (tapTimeoutRef.current) {
        clearTimeout(tapTimeoutRef.current)
        tapTimeoutRef.current = null
      }
      window.open(project.externalUrl, "_blank", "noopener,noreferrer")
      setSelectedProject(null)
    } else {
      // Single tap - show description
      if (tapTimeoutRef.current) {
        clearTimeout(tapTimeoutRef.current)
      }
      // Mobile: position next to icon
      const targetElement = event.currentTarget
      if (!targetElement) return
      
      const rect = targetElement.getBoundingClientRect()
      tapTimeoutRef.current = setTimeout(() => {
        setSelectedProject(selectedProject === project.id ? null : project.id)
        
        // Check if icon is in the left columns (first or second column of 4-column grid)
        // Get the container to calculate column width
        const container = targetElement.closest('.fade-in') || targetElement.parentElement
        const containerRect = container?.getBoundingClientRect()
        const screenContainer = targetElement.closest('[data-phone-screen]')
        const screenRect = screenContainer?.getBoundingClientRect()
        const containerWidth = containerRect?.width || window.innerWidth
        const columnWidth = containerWidth / 4 // 4-column grid
        const iconLeftRelative = rect.left - (containerRect?.left || 0)
        const isFirstColumn = iconLeftRelative < columnWidth
        const isSecondColumn = iconLeftRelative >= columnWidth && iconLeftRelative < (columnWidth * 2)
        
        // Mobile: use viewport coordinates for fixed positioning
        if (isFirstColumn) {
          // Position to the right of icon for first column
          setPopoverPosition({
            top: rect.top + (rect.height / 2),
            left: rect.right + 8
          })
          setPopoverOnRight(true)
        } else if (isSecondColumn) {
          // Position to the right but a bit to the left for second column
          setPopoverPosition({
            top: rect.top + (rect.height / 2),
            left: rect.right - 40
          })
          setPopoverOnRight(true)
        } else {
          // Position to the left of icon for other columns
          setPopoverPosition({
            top: rect.top + (rect.height / 2),
            left: rect.left - 20
          })
          setPopoverOnRight(false)
        }
        tapTimeoutRef.current = null
      }, 300)
    }
    lastTapRef.current = currentTime
  }

  const getProject = (id: number) => projects.find(p => p.id === id)
  const activeProject = hoveredProject || selectedProject
  const project = activeProject ? getProject(activeProject) : null

  if (isLoading) {
    return (
      <div className="fade-in">
        <div className="grid grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="flex flex-col items-center">
              <div className="w-14 h-14 bg-zinc-700/50 rounded-2xl animate-pulse" />
              <div className="mt-1 h-3 w-12 bg-zinc-700/50 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="fade-in relative">
        <div className="grid grid-cols-4 gap-4">
          {projects.map((project) => (
            <div
              key={project.id}
              data-project-item
              onMouseEnter={(e) => handleMouseEnter(project.id, e)}
              onMouseLeave={handleMouseLeave}
              onClick={(e) => handleClick(project, e)}
              className="flex flex-col items-center group cursor-pointer"
            >
              <div className="w-14 h-14 app-icon bg-gradient-to-br from-zinc-200 to-zinc-400 flex items-center justify-center overflow-hidden transition-transform group-active:scale-90">
                {project.image ? (
                  <img
                    src={project.image || "/placeholder.svg"}
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-xl font-semibold text-zinc-700">{project.title.charAt(0)}</span>
                )}
              </div>
              <span className="mt-1 text-xs text-white font-semibold text-center drop-shadow-md truncate w-full px-1">
                {project.title}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Description Popover - rendered outside to appear above phone frame */}
      {project && activeProject && typeof document !== 'undefined' && (
        <div
          data-project-popover
          className="fixed z-[99999] pointer-events-none"
          onMouseEnter={handlePopoverMouseEnter}
          onMouseLeave={handlePopoverMouseLeave}
          style={{
            top: `${popoverPosition.top}px`,
            left: `${popoverPosition.left}px`,
            transform: window.matchMedia("(hover: hover)").matches 
              ? "translateY(-50%)" 
              : popoverOnRight 
                ? "translateY(-50%)" 
                : "translate(-100%, -50%)",
          }}
        >
          <div className="p-4 rounded-2xl backdrop-filter backdrop-blur-xl bg-black/50 border border-zinc-800/50 shadow-xl max-w-[240px] min-w-[180px] pointer-events-auto">
            <h3 className="text-sm font-bold text-white mb-1.5">{project.title}</h3>
            <p className="text-xs text-white/80 leading-relaxed mb-2.5 line-clamp-3">{project.description}</p>
            <div className="flex flex-wrap gap-1">
              {project.technologies.slice(0, 4).map((tech) => (
                <span
                  key={tech}
                  className="px-2 py-0.5 text-[10px] font-medium text-white/90 bg-zinc-800/60 rounded"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
