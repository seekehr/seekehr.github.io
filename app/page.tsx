"use client"

import { useState, useEffect } from "react"
import { LoadingScreen } from "@/components/loading-screen"
import { DesktopFrame } from "@/components/desktop-frame"
import { PhoneFrame } from "@/components/phone-frame"
import { useIsMobile } from "@/hooks/use-mobile"
import { getProjects } from "@/lib/projects"

export default function Home() {
  const [isLoading, setIsLoading] = useState(true)
  const isMobile = useIsMobile()

  useEffect(() => {
    getProjects().then((projects) => {
      projects.forEach((project) => {
        if (project.image) {
          const img = new Image()
          img.src = project.image
        }
      })
    })

    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2500)
    return () => clearTimeout(timer)
  }, [])

  if (isLoading) return <LoadingScreen />
  return isMobile ? <PhoneFrame fullscreen /> : <DesktopFrame />
}
