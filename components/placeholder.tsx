import type { ReactNode } from "react";
import { categoryOf, hash, type Project } from "@/lib/projects";

// ─── Generated cover art for projects without a screenshot ───────────────────
//
// Resolution order for which cover a project gets:
//   1. `cover` in projects.json            ("terminal" | "code" | "graph" | "pixel" | "phone" | "dots")
//   2. CATEGORY_COVER[category]
//   3. "dots"
// Everything a cover shows is derived from the project itself (title, description,
// technologies) plus an optional `command` in projects.json.

// ─── Languages ────────────────────────────────────────────────────────────────
// First entry whose `match` appears in `technologies` wins. To support a new
// language, add one entry: file name, run command and a snippet template.
// Snippet tokens: {slug} {ident} {Ident} {title} {stack}

type Lang = {
  match: string[];
  file: string;
  run: string;
  keywords: string[];
  snippet: string;
};

const LANGS: Lang[] = [
  {
    match: ["go"],
    file: "main.go",
    run: "go run .",
    keywords: ["package", "import", "func", "return", "var"],
    snippet: `package main

import "github.com/seekehr/{slug}"

func main() {
	app := {ident}.New([]string{{stack}})
	app.Run()
}`,
  },
  {
    match: ["python"],
    file: "main.py",
    run: "python main.py",
    keywords: ["from", "import", "if", "def", "return"],
    snippet: `from {ident} import App

app = App(stack=[{stack}])

if __name__ == "__main__":
    app.run()`,
  },
  {
    match: ["c++"],
    file: "src/main.cpp",
    run: "cmake --build build && ./build/{slug}",
    keywords: ["#include", "int", "return", "auto"],
    snippet: `#include "{slug}.h"

int main() {
  auto app = {ident}::App({ {stack} });
  return app.run();
}`,
  },
  {
    match: ["kotlin"],
    file: "src/main/kotlin/{Ident}.kt",
    run: "./gradlew build",
    keywords: ["fun", "val", "object"],
    snippet: `object {Ident} {
  val stack = listOf({stack})
}

fun main() = println({Ident}.stack)`,
  },
  {
    match: ["java"],
    file: "src/main/java/{Ident}.java",
    run: "./gradlew build",
    keywords: ["public", "class", "static", "void", "new"],
    snippet: `public class {Ident} {
  public static void main(String[] args) {
    System.out.println("{title}");
  }
}`,
  },
  {
    match: ["shell", "bash"],
    file: "build.sh",
    run: "./build.sh",
    keywords: ["set", "echo", "for", "do", "done"],
    snippet: `#!/usr/bin/env bash
set -euo pipefail

echo "building {slug}"
for dep in {stack}; do echo "$dep"; done`,
  },
  {
    match: ["typescript", "javascript", "next.js", "expo"],
    file: "src/index.ts",
    run: "npm run dev",
    keywords: ["import", "from", "const", "export", "default"],
    snippet: `import { create } from "@seekehr/{slug}";

const {ident} = create({
  stack: [{stack}],
  status: "shipped",
});

export default {ident};`,
  },
];

const FALLBACK_LANG = LANGS[LANGS.length - 1];

// ─── Context shared by every cover ───────────────────────────────────────────

type Ctx = {
  p: Project;
  slug: string;
  lang: Lang;
  fill: (template: string) => string;
};

function contextOf(p: Project): Ctx {
  const slug = p.title.toLowerCase().replace(/\s*\(.*?\)\s*/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const ident = slug.replace(/-(\w)/g, (_, c: string) => c.toUpperCase()).replace(/^\d+/, "");
  const techs = p.technologies.map((t) => t.toLowerCase());
  const lang = LANGS.find((l) => l.match.some((m) => techs.includes(m))) ?? FALLBACK_LANG;
  const vars: Record<string, string> = {
    slug,
    ident,
    Ident: ident.charAt(0).toUpperCase() + ident.slice(1),
    title: p.title,
    stack: p.technologies.slice(0, 3).map((t) => `"${t}"`).join(", "),
  };
  return { p, slug, lang, fill: (t) => t.replace(/\{(\w+)\}/g, (m, k: string) => vars[k] ?? m) };
}

// Tiny highlighter: strings and the language's keywords, nothing else.
function highlight(code: string, keywords: string[]) {
  const kw = keywords.map((k) => k.replace(/[#+]/g, "\\$&")).join("|");
  const re = new RegExp(`("[^"]*"|(?<![\\w#])(?:${kw})\\b)`, "g");
  return code.split("\n").map((line, i) => (
    <span key={i} className="ph-line">
      <span className="ln">{i + 1}</span>
      {line.split(re).map((part, j) =>
        j % 2 === 0 ? part : <span key={j} className={part.startsWith('"') ? "str" : "kw"}>{part}</span>
      )}
      {"\n"}
    </span>
  ));
}

function Chrome({ label }: { label: string }) {
  return (
    <div className="ph-chrome">
      <i /><i /><i />
      <span>{label}</span>
    </div>
  );
}

// ─── Covers ──────────────────────────────────────────────────────────────────

function Terminal({ p, slug, lang, fill }: Ctx) {
  return (
    <div className="ph ph-term">
      <Chrome label={`${slug} — zsh`} />
      <div className="ph-term-body">
        <p><span className="ph-dim">~ $</span> git clone github.com/seekehr/{slug}</p>
        <p><span className="ph-dim">~ $</span> cd {slug} &amp;&amp; {p.command ?? fill(lang.run)}</p>
        <p className="ph-ok">✓ built in {((hash(slug) % 900) / 1000 + 0.2).toFixed(2)}s</p>
        <p className="ph-dim ph-clamp">› {p.description}</p>
        <p><span className="ph-dim">~/{slug} $</span> <span className="ph-cursor" /></p>
      </div>
    </div>
  );
}

function Code({ slug, lang, fill }: Ctx) {
  return (
    <div className="ph ph-code">
      <Chrome label={`${slug}/${fill(lang.file)}`} />
      <pre className="ph-code-body">
        {highlight(fill(lang.snippet), lang.keywords)}
        <span className="ph-cursor" />
      </pre>
    </div>
  );
}

function Graph({ p }: Ctx) {
  const h = hash(p.title);
  const tags = p.technologies.slice(0, 5);
  // Ring of nodes around a central model node.
  const nodes = tags.map((t, i) => {
    const a = (i / tags.length) * Math.PI * 2 + (h % 360) * (Math.PI / 180);
    return { t, x: 200 + Math.cos(a) * 130, y: 120 + Math.sin(a) * 78 };
  });
  return (
    <div className="ph ph-graph">
      <svg viewBox="0 0 400 240" aria-hidden>
        {nodes.map((n, i) => (
          <line key={`l${i}`} x1="200" y1="120" x2={n.x} y2={n.y} className="ph-edge" style={{ animationDelay: `${i * 0.4}s` }} />
        ))}
        {nodes.map((n, i) => (
          <line key={`r${i}`} x1={n.x} y1={n.y} x2={nodes[(i + 1) % nodes.length].x} y2={nodes[(i + 1) % nodes.length].y} className="ph-edge ph-edge--faint" />
        ))}
        <circle cx="200" cy="120" r="22" className="ph-core" />
        <text x="200" y="124" textAnchor="middle" className="ph-core-t">LLM</text>
        {nodes.map((n) => (
          <g key={n.t}>
            <circle cx={n.x} cy={n.y} r="4" className="ph-node" />
            <text x={n.x} y={n.y - 10} textAnchor="middle" className="ph-node-t">{n.t}</text>
          </g>
        ))}
      </svg>
    </div>
  );
}

const BLOCKS = ["#5d8c3a", "#6fa043", "#7a5634", "#8b6440", "#6b6b6b", "#7c7c7c", "#4a7530"];

function Pixel({ p }: Ctx) {
  let h = hash(p.title);
  const cols = 16;
  const rows = 9;
  const cells = Array.from({ length: cols * rows }, (_, i) => {
    h = Math.imul(h ^ (h >>> 13), 0x5bd1e995) >>> 0;
    const row = Math.floor(i / cols);
    // grass on top, dirt in the middle, stone at the bottom
    const band = row < 2 ? [0, 1, 6] : row < 6 ? [2, 3] : [4, 5, 3];
    return BLOCKS[band[h % band.length]];
  });
  return (
    <div className="ph ph-pixel">
      <div className="ph-pixel-grid" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
        {cells.map((c, i) => <span key={i} style={{ background: c }} />)}
      </div>
      <span className="ph-pixel-label">{p.command ?? p.title}</span>
    </div>
  );
}

function Phone({ p }: Ctx) {
  const done = (hash(p.title) % 3) + 2;
  return (
    <div className="ph ph-phone">
      <div className="ph-phone-frame">
        <span className="ph-phone-notch" />
        <p className="ph-phone-title">{p.title}</p>
        <p className="ph-phone-streak">🔥 {7 + (hash(p.title) % 20)} day streak</p>
        {p.technologies.concat("Ship it").slice(0, 4).map((t, i) => (
          <p key={t} className={`ph-phone-task${i < done ? " done" : ""}`}>{t}</p>
        ))}
        <div className="ph-phone-xp"><span style={{ width: `${done * 25}%` }} /></div>
      </div>
    </div>
  );
}

function Dots({ p, lang, slug }: Ctx) {
  const initials = p.title.replace(/[^A-Za-z0-9]/g, "").slice(0, 2).toUpperCase();
  return (
    <div className="ph ph-dots">
      <span className="ph-dots-mark">{initials}</span>
      <span className="ph-dots-meta">{lang.file.split(".").pop()} · {p.projectUrl ? slug : "private"}</span>
    </div>
  );
}

// ─── Registry ────────────────────────────────────────────────────────────────
// Add a cover: write a component taking Ctx and register it here.

const COVERS: Record<string, (c: Ctx) => ReactNode> = {
  terminal: Terminal,
  code: Code,
  graph: Graph,
  pixel: Pixel,
  phone: Phone,
  dots: Dots,
};

const CATEGORY_COVER: Record<string, string> = {
  ai: "graph",
  mod: "pixel",
  systems: "terminal",
  scraping: "terminal",
  cli: "terminal",
  web: "code",
};

export default function Placeholder({ p }: { p: Project }) {
  const cover = COVERS[p.cover ?? ""] ?? COVERS[CATEGORY_COVER[categoryOf(p)]] ?? Dots;
  return cover(contextOf(p));
}
