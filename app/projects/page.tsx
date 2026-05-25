"use client";

import { useState, useEffect, useRef } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

type Project = {
  id: number;
  title: string;
  description: string;
  category: string;
  technologies: string[];
  projectUrl?: string;
  externalUrl?: string;
  [key: string]: unknown;
};

const CAT_LABEL: Record<string, string> = {
  ai: "AI",
  systems: "Systems",
  web: "Web",
  mod: "Mod",
  plugin: "Plugin",
  cli: "CLI",
};

// ─── Hook ─────────────────────────────────────────────────────────────────────

function useInView() {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setInView(true); },
      { threshold: 0.04 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, inView };
}

// ─── Row ──────────────────────────────────────────────────────────────────────

function ProjectRow({ p, idx, delay }: { p: Project; idx: number; delay: number }) {
  const { ref, inView } = useInView();
  const num = String(idx + 1).padStart(2, "0");
  const catLabel = CAT_LABEL[p.category] ?? p.category;
  const url = p.projectUrl || p.externalUrl;

  return (
    <div
      ref={ref}
      className={`pal-row${inView ? " pal-row--in" : ""}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <span className="pal-num">{num}</span>

      <div className="pal-body">
        <span className="pal-title">{p.title}</span>
        <span className="pal-cat-lbl">{catLabel}</span>
      </div>

      <div className="pal-tags">
        {p.technologies.slice(0, 3).map((t) => (
          <span key={t} className="pal-pill">{t}</span>
        ))}
      </div>

      {url ? (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="pal-ext"
          aria-label={`Open ${p.title}`}
          onClick={(e) => e.stopPropagation()}
        >
          ↗
        </a>
      ) : (
        <span className="pal-ext pal-ext--empty" />
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [categories, setCategories] = useState<string[]>(["all"]);
  const [active, setActive] = useState("all");
  const [on, setOn] = useState(false);

  useEffect(() => {
    fetch("/projects.json")
      .then((r) => r.json())
      .then((data: Project[]) => {
        setProjects(data);
        const cats = Array.from(new Set(data.map((p) => p.category)));
        setCategories(["all", ...cats]);
      });
    const t = setTimeout(() => setOn(true), 60);
    return () => clearTimeout(t);
  }, []);

  const visible =
    active === "all" ? projects : projects.filter((p) => p.category === active);

  return (
    <div className="pal-page">
      {/* Nav */}
      <nav className="pal-nav">
        <a href="/" className="pal-back">← home</a>
        <span className="pnav-logo">.seekehr</span>
        <a href="/resume.pdf" target="_blank" rel="noopener noreferrer" className="pnav-link pnav-accent">
          resume&nbsp;↗
        </a>
      </nav>

      <main className="pal-main">
        {/* Header */}
        <div className={`pal-hdr${on ? " pal-hdr--on" : ""}`}>
          <h1 className="pal-h">All Projects.</h1>
          <p className="pal-sub">
            {projects.length > 0 ? `${projects.length} projects` : "projects"} across AI, systems, and the web
          </p>
        </div>

        {/* Filters */}
        <div className={`pal-filters${on ? " pal-filters--on" : ""}`}>
          {categories.map((cat) => (
            <button
              key={cat}
              className={`pal-filter${active === cat ? " pal-filter--on" : ""}`}
              onClick={() => setActive(cat)}
            >
              {cat === "all" ? "All" : (CAT_LABEL[cat] ?? cat)}
            </button>
          ))}
          {active !== "all" && (
            <span className="pal-count">{visible.length} result{visible.length !== 1 ? "s" : ""}</span>
          )}
        </div>

        {/* List */}
        <div className="pal-list">
          {visible.map((p, i) => (
            <ProjectRow key={`${active}-${p.id}`} p={p} idx={i} delay={i * 25} />
          ))}
        </div>

        {/* Footer */}
        {projects.length > 0 && (
          <div className={`pal-footer${on ? " pal-footer--on" : ""}`}>
            <a
              href="https://github.com/seekehr"
              target="_blank"
              rel="noopener noreferrer"
              className="pall-link"
            >
              View all on GitHub &rarr;
            </a>
          </div>
        )}
      </main>
    </div>
  );
}
