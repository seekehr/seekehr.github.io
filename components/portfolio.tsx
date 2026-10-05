import { ArrowUpRight, Bot, Bug, Cpu, Server } from "lucide-react";
import Placeholder from "@/components/placeholder";
import { projects, urlOf, type Project } from "@/lib/projects";
import clients from "@/public/clients.json";

const STACK = [
  ["Go", "services, CLIs, trading engines"],
  ["TypeScript", "Next.js, Express, scrapers"],
  ["Python", "RAG, LLM pipelines, automation"],
  ["C++", "Windows internals, DLLs"],
  ["Playwright", "browser automation at scale"],
  ["Qdrant", "vector search"],
];

const LINKS = [
  ["email", "grouchyseeker@gmail.com", "mailto:grouchyseeker@gmail.com"],
  ["github", "github.com/seekehr", "https://github.com/seekehr"],
  ["discord", "discord.gg/bHEjbQdEcx", "https://discord.gg/bHEjbQdEcx"],
  ["resume", "resume.pdf", "/resume.pdf"],
];

// ─── Intro column ────────────────────────────────────────────────────────────

function Intro() {
  return (
    <aside className="intro">
      <header className="intro-id">
        <img src="/favicon.svg" alt="" className="avatar" />
        <div>
          <p className="handle">@seekehr</p>
          <p className="role">BACKEND ENGINEER</p>
        </div>
      </header>

      <p className="bio">
        A <b><Server className="ico" />backend engineer</b> building{" "}
        <b><Bot className="ico" />AI-powered</b> data systems and automation. Currently{" "}
        <span className="hl">open</span> to <b>freelance</b> and <b>full-time</b> work. This site
        is a collection of things I&apos;ve built across{" "}
        <b>scraping <Bug className="ico" /></b>, <b>RAG pipelines</b> and{" "}
        <b>systems <Cpu className="ico" /></b>.
      </p>

      <a href="mailto:grouchyseeker@gmail.com" className="cta">GET IN TOUCH</a>

      <hr className="hatch" />

      <div className="marquee" aria-label="Clients">
        <div className="marquee-track">
          {[...clients, ...clients].map((c, i) => (
            <span key={i} aria-hidden={i >= clients.length}>{c.name}</span>
          ))}
        </div>
      </div>

      <hr className="hatch" />

      <section>
        <h2 className="serif">Between data and code</h2>
        <p className="prose">
          I turn messy, unstructured information (dynamic websites, PDFs, live feeds) into
          structured systems that are fast, maintainable and built to scale: scrapers, extraction
          pipelines, RAG search and the backends behind them.
        </p>
      </section>

      <section>
        <h2 className="serif">Stack</h2>
        <ul className="rows">
          {STACK.map(([k, v]) => (
            <li key={k}><span>{k}</span><span className="dim">{v}</span></li>
          ))}
        </ul>
      </section>

      <section id="contact">
        <h2 className="serif">Elsewhere</h2>
        <ul className="rows">
          {LINKS.map(([k, label, href]) => (
            <li key={k}>
              <span className="dim">{k}</span>
              <a href={href} target={href.startsWith("http") || href.endsWith(".pdf") ? "_blank" : undefined} rel="noopener noreferrer">
                {label} <ArrowUpRight className="ico" />
              </a>
            </li>
          ))}
        </ul>
      </section>

      <footer className="foot dim">
        <span>© {new Date().getFullYear()} seekehr</span>
        <a href="/projects/">index of /projects →</a>
      </footer>
    </aside>
  );
}

// ─── Work grid ───────────────────────────────────────────────────────────────

function Tile({ p, order }: { p: Project; order: number }) {
  const url = urlOf(p);
  const Tag = url ? "a" : "div";
  return (
    <Tag
      className="tile"
      style={{ order }}
      {...(url ? { href: url, target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      <div className="tile-media">
        {p.image ? <img src={p.image} alt={`${p.title} screenshot`} loading="lazy" /> : <Placeholder p={p} />}
      </div>
      <div className="tile-cap">
        <div>
          <p className="tile-title">{p.title}</p>
          <p className="tile-desc">{p.description}</p>
        </div>
        {url && <ArrowUpRight className="tile-arrow" />}
      </div>
    </Tag>
  );
}

export default function Portfolio() {
  return (
    <div className="shell">
      <Intro />
      <main className="work" aria-label="Projects">
        {/* Two columns filled alternately so reading order is left→right, top→bottom.
            On narrow screens the columns dissolve and `order` restores JSON order. */}
        {[0, 1].map((col) => (
          <div key={col} className="work-col">
            {projects.map((p, i) => i % 2 === col && <Tile key={p.id} p={p} order={i} />)}
          </div>
        ))}
      </main>
    </div>
  );
}
