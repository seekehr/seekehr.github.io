"use client";

import { useEffect, useRef, useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

type FeaturedProject = {
  num: string;
  title: string;
  desc: string;
  tags: string[];
  url: string;
  image: string;
};

type RawProject = {
  id: number;
  title: string;
  description: string;
  image?: string;
  technologies: string[];
  projectUrl?: string;
  externalUrl?: string;
  [key: string]: unknown;
};

const SKILLS = [
  { name: "Golang", pct: 100 },
  { name: "AI / LLM Integration", pct: 100 },
  { name: "React / Next.js", pct: 100 },
  { name: "TypeScript", pct: 100 },
  { name: "C++", pct: 80 },
];

// ─── Hooks ────────────────────────────────────────────────────────────────────

function useInView<T extends Element = HTMLDivElement>() {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setInView(true); },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, inView };
}

// ─── Nav ──────────────────────────────────────────────────────────────────────

function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <nav className={`pnav${scrolled ? " pnav--s" : ""}`}>
      <a href="#" className="pnav-logo">.seekehr</a>
      <div className="pnav-links">
        <a href="/projects" className="pnav-link">projects</a>
        <a href="#about" className="pnav-link">about</a>
        <a href="#contact" className="pnav-link">contact</a>
        <a
          href="/resume.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="pnav-link pnav-accent"
        >
          resume&nbsp;↗
        </a>
      </div>
    </nav>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

function Hero() {
  const [on, setOn] = useState(false);
  useEffect(() => { setTimeout(() => setOn(true), 80); }, []);

  return (
    <section className="phero">
      <div className="phero-grid" aria-hidden />

      <div className={`phero-meta${on ? " phero-meta--on" : ""}`}>
        <span className="phero-greeting">Hey, I&apos;m Seeker</span>
        <span className="phero-status">
          <span className="pdot" />
          Available for work
        </span>
      </div>

      <div className={`phero-hwrap${on ? " phero-hwrap--on" : ""}`}>
        <h1 className="phero-h">
          Building systems<br />
          &amp; AI automation<br />
          at scale.
        </h1>
      </div>

      <p className={`phero-sub${on ? " phero-sub--on" : ""}`}>
        AI automation &amp; backend systems engineer
      </p>

      <span className="phero-ghost" aria-hidden>backend engineer</span>

      <a href="#projects" className={`phero-scroll${on ? " phero-scroll--on" : ""}`}>
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
          <path
            d="M9 3.5v11M4 9.5l5 5 5-5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </a>
    </section>
  );
}

// ─── Shared ───────────────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="plabel">
      <span>{children}</span>
      <div className="pline" />
    </div>
  );
}

// ─── Projects ─────────────────────────────────────────────────────────────────

function GridCard({ p, delay }: { p: FeaturedProject; delay: number }) {
  const { ref, inView } = useInView<HTMLAnchorElement>();
  return (
    <a
      ref={ref}
      href={p.url ?? "#"}
      target="_blank"
      rel="noopener noreferrer"
      className={`pgcard${inView ? " pgcard--in" : ""}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="pgcard-img-wrap">
        {p.image && (
          <img src={p.image} alt="" aria-hidden className="pgcard-img" />
        )}
        <span className="pgcard-num" aria-hidden>{p.num}</span>
      </div>
      <div className="pgcard-body">
        <h3 className="pgcard-title">{p.title}</h3>
        <p className="pgcard-desc">{p.desc}</p>
        <div className="pgcard-foot">
          <div className="pcard-tags">
            {p.tags.slice(0, 3).map((t) => (
              <span key={t} className="pcard-tag">{t}</span>
            ))}
          </div>
        </div>
      </div>
    </a>
  );
}

function Projects() {
  const { ref, inView } = useInView();
  const [featured, setFeatured] = useState<FeaturedProject[]>([]);

  useEffect(() => {
    fetch("/projects.json")
      .then((r) => r.json())
      .then((data: RawProject[]) => {
        setFeatured(
          data.slice(0, 6).map((p, i) => ({
            num: String(i + 1).padStart(2, "0"),
            title: p.title,
            desc: p.description,
            tags: p.technologies.slice(0, 3),
            url: p.projectUrl || p.externalUrl || "#",
            image: p.image || "",
          }))
        );
      });
  }, []);

  return (
    <section id="projects" className="psec">
      <div ref={ref} className={`psec-hdr${inView ? " psec-hdr--in" : ""}`}>
        <SectionLabel>Selected Work</SectionLabel>
        <p className="psec-sub">30+ projects across AI, systems, and web</p>
      </div>
      <div className="pgrid-six">
        {featured.map((p, i) => (
          <GridCard key={p.num} p={p} delay={i * 55} />
        ))}
      </div>
      <div className="pall">
        <a href="/projects" className="pall-link">
          all projects &rarr;
        </a>
      </div>
    </section>
  );
}

// ─── About ────────────────────────────────────────────────────────────────────

function About() {
  const txt = useInView();
  const sk = useInView();
  return (
    <section id="about" className="psec psec--border">
      <div className={`plabel-wrap${txt.inView ? " plabel-wrap--in" : ""}`}>
        <SectionLabel>About</SectionLabel>
      </div>
      <div className="pabout">
        <div
          ref={txt.ref}
          className={`pabout-txt${txt.inView ? " pabout-txt--in" : ""}`}
        >
          <p>
            I&apos;m a backend systems engineer who specialises in AI automation
            and real-time infrastructure. I build things that have to work at scale:
            trading engines, AI pipelines, high-throughput APIs, and tools that
            automate the tedious.
          </p>
          <p>
            From CLOB trading bots to LLM-powered scrapers, I focus on writing
            systems that are fast, reliable, and maintainable at scale.
          </p>
          <div className="pstats">
            <div className="pstat">
              <span className="pstat-n">30+</span>
              <span className="pstat-l">Projects</span>
            </div>
            <div className="pstat">
              <span className="pstat-n">40+</span>
              <span className="pstat-l">Clients</span>
            </div>
            <div className="pstat">
              <span className="pstat-n">5+</span>
              <span className="pstat-l">Core technologies</span>
            </div>
          </div>
        </div>

        <div
          ref={sk.ref}
          className={`pskills${sk.inView ? " pskills--in" : ""}`}
        >
          <p className="pskills-lbl">Core stack</p>
          {SKILLS.map((s, i) => (
            <div key={s.name} className="pskill">
              <div className="pskill-meta">
                <span className="pskill-name">{s.name}</span>
                <span className="pskill-pct">{s.pct}%</span>
              </div>
              <div className="pskill-track">
                <div
                  className="pskill-bar"
                  style={{
                    width: sk.inView ? `${s.pct}%` : "0%",
                    transitionDelay: `${i * 100}ms`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Contact ──────────────────────────────────────────────────────────────────

function Contact() {
  const { ref, inView } = useInView();
  return (
    <section id="contact" className="pcont">
      <div
        ref={ref}
        className={`pcont-inner${inView ? " pcont-inner--in" : ""}`}
      >
        <SectionLabel>Contact</SectionLabel>
        <h2 className="pcont-h">Let&apos;s build something.</h2>
        <p className="pcont-sub">
          Open to freelance work, contracts, and interesting problems.
        </p>
        <div className="pcont-links">
          <a href="mailto:grouchyseeker@gmail.com" className="pcont-link">
            grouchyseeker@gmail.com
          </a>
          <a
            href="https://discord.gg/bHEjbQdEcx"
            target="_blank"
            rel="noopener noreferrer"
            className="pcont-link"
          >
            discord.gg/bHEjbQdEcx
          </a>
        </div>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="pfooter">
      <span className="pfooter-copy">.seekehr &copy; {new Date().getFullYear()}</span>
      <div className="pfooter-links">
        <a href="https://github.com/seekehr" target="_blank" rel="noopener noreferrer">
          GitHub
        </a>
        <a href="https://discord.gg/bHEjbQdEcx" target="_blank" rel="noopener noreferrer">
          Discord
        </a>
        <a href="mailto:grouchyseeker@gmail.com">Email</a>
        <a href="/resume.pdf" target="_blank" rel="noopener noreferrer">
          Resume
        </a>
      </div>
    </footer>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export default function Portfolio() {
  return (
    <div className="proot">
      <Nav />
      <Hero />
      <Projects />
      <About />
      <Contact />
      <Footer />
    </div>
  );
}
