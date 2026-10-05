import data from "@/public/projects.json";

export type Project = {
  id: number;
  title: string;
  description: string;
  image?: string;
  category: string;
  technologies: string[];
  projectUrl?: string;
  externalUrl?: string;
  /** Placeholder style when there's no image; see components/placeholder.tsx. */
  cover?: string;
  /** Command shown on terminal / mod covers. */
  command?: string;
};

const CATEGORY_ALIASES: Record<string, string> = {
  scraper: "scraping",
};

export function categoryOf(p: Project) {
  const c = p.category.toLowerCase();
  return CATEGORY_ALIASES[c] ?? c;
}

export function urlOf(p: Project) {
  return p.projectUrl || p.externalUrl || "";
}

export const projects: Project[] = (data as Project[]).map((p) => ({
  ...p,
  technologies: p.technologies.map((t) => t.trim()),
}));

export const categories = Array.from(new Set(projects.map(categoryOf)));

// Small deterministic hash so placeholders stay stable between builds.
export function hash(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}
