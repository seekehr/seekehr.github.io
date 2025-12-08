export function HomeScreen() {
  return (
    <div className="fade-in space-y-4">
      {/* Profile card */}
      <div className="widget p-4 text-center">
        <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
          <span className="text-2xl font-semibold text-white">S</span>
        </div>
        <h1 className="text-lg font-semibold text-white drop-shadow-sm">Seeker</h1>
        <p className="text-sm text-white/80">Full-Stack Developer</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 gap-3">
        <div className="widget p-3 text-center">
          <div className="text-2xl font-bold text-white drop-shadow-sm">19+</div>
          <div className="text-xs text-white/70">Projects</div>
        </div>
        <div className="widget p-3 text-center">
          <div className="text-2xl font-bold text-white drop-shadow-sm">5+</div>
          <div className="text-xs text-white/70">Technologies</div>
        </div>
      </div>

      {/* About card */}
      <div className="widget p-4">
        <h3 className="text-sm font-semibold text-white mb-2">About</h3>
        <p className="text-xs text-white/80 leading-relaxed">
          Full-stack developer specializing in Golang, React, and Next.js. Building everything from web apps to
          systems-level tools.
        </p>
      </div>

      {/* Tech tags */}
      <div className="flex flex-wrap gap-2">
        {["Golang", "React", "Next.js", "TypeScript", "C++"].map((tech) => (
          <span
            key={tech}
            className="px-3 py-1.5 text-xs font-medium text-white bg-white/20 rounded-full backdrop-blur-sm"
          >
            {tech}
          </span>
        ))}
      </div>
    </div>
  )
}
