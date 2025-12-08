export function HomeScreen() {
  return (
    <div className="fade-in space-y-4">
      {/* Profile card */}
      <div className="p-4 text-center rounded-2xl backdrop-filter backdrop-blur-xl bg-black/50 border border-zinc-800/50 shadow-xl">
        <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
          <span className="text-2xl font-semibold text-white">S</span>
        </div>
        <h1 className="text-lg font-semibold text-white">Seeker</h1>
        <p className="text-sm text-white font-medium">Full-Stack Developer</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 text-center rounded-2xl backdrop-filter backdrop-blur-xl bg-black/50 border border-zinc-800/50 shadow-xl">
          <div className="text-2xl font-bold text-white">19+</div>
          <div className="text-xs text-white font-medium">Projects</div>
        </div>
        <div className="p-3 text-center rounded-2xl backdrop-filter backdrop-blur-xl bg-black/50 border border-zinc-800/50 shadow-xl">
          <div className="text-2xl font-bold text-white">5+</div>
          <div className="text-xs text-white font-medium">Technologies</div>
        </div>
      </div>

      {/* About card */}
      <div className="p-4 rounded-2xl backdrop-filter backdrop-blur-xl bg-black/50 border border-zinc-800/50 shadow-xl">
        <h3 className="text-sm font-semibold text-white mb-2">About</h3>
        <p className="text-sm text-white font-medium leading-relaxed">
          Full-stack developer specializing in Golang, React, and Next.js. Building everything from web apps to
          systems-level tools.
        </p>
      </div>

      {/* Tech tags */}
      <div className="flex flex-wrap gap-2">
        {["Golang", "React", "Next.js", "TypeScript", "C++"].map((tech) => (
          <span
            key={tech}
            className="px-3 py-1.5 text-xs font-semibold text-white bg-zinc-800/60 border border-zinc-700/50 rounded-full backdrop-blur-sm"
          >
            {tech}
          </span>
        ))}
      </div>
    </div>
  )
}
