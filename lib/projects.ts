export interface Project {
  id: number
  title: string
  description: string
  image: string
  category: string
  categoryLabel: string
  categoryColor: string
  technologies: string[]
  projectUrl: string
  externalUrl: string
}

// Cache for projects data
let projectsCache: Project[] | null = null

/**
 * Fetches projects from the public JSON file
 */
export async function getProjects(): Promise<Project[]> {
  if (projectsCache) {
    return projectsCache
  }

  try {
    const response = await fetch("/projects.json")
    if (!response.ok) {
      throw new Error("Failed to fetch projects")
    }
    const data = await response.json()
    projectsCache = data as Project[]
    return projectsCache
  } catch (error) {
    console.error("Error loading projects:", error)
    return []
  }
}
