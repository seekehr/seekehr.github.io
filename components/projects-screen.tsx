"use client"

import { useState, useEffect } from "react"
import { getProjects, type Project } from "@/lib/projects"

export function ProjectsScreen() {
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    getProjects().then((data) => {
      setProjects(data)
      setIsLoading(false)
    })
  }, [])

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
    <div className="fade-in">
      <div className="grid grid-cols-4 gap-4">
        {projects.map((project) => (
          <a
            key={project.id}
            href={project.externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center group"
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
          </a>
        ))}
      </div>
    </div>
  )
}
