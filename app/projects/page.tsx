"use client";

import { useState } from "react";
import { categories, categoryOf, projects, urlOf } from "@/lib/projects";

export default function ProjectsPage() {
  const [active, setActive] = useState("all");
  const visible = active === "all" ? projects : projects.filter((p) => categoryOf(p) === active);

  return (
    <main className="index">
      <nav className="index-nav">
        <a href="/">← cd ~</a>
        <a href="/resume.pdf" target="_blank" rel="noopener noreferrer">resume.pdf ↗</a>
      </nav>

      <h1 className="serif index-h">Index of /projects</h1>
      <p className="dim">{projects.length} entries · scraping, AI, systems and the web</p>

      <div className="filters" role="tablist">
        {["all", ...categories].map((c) => (
          <button
            key={c}
            role="tab"
            aria-selected={active === c}
            className={active === c ? "on" : ""}
            onClick={() => setActive(c)}
          >
            [{c}]
          </button>
        ))}
      </div>

      <table className="ls">
        <thead>
          <tr><th>#</th><th>name</th><th>type</th><th className="hide-sm">stack</th><th /></tr>
        </thead>
        <tbody>
          {visible.map((p, i) => {
            const url = urlOf(p);
            return (
              <tr key={p.id}>
                <td className="dim">{String(i + 1).padStart(2, "0")}</td>
                <td>
                  {url ? <a href={url} target="_blank" rel="noopener noreferrer">{p.title}</a> : p.title}
                  <span className="ls-desc">{p.description}</span>
                </td>
                <td className="dim">{categoryOf(p)}</td>
                <td className="dim hide-sm">{p.technologies.slice(0, 3).join(", ")}</td>
                <td className="dim">{url ? "↗" : "private"}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </main>
  );
}
