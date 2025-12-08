"use client"

export function SkillsWidget() {
  const skills = [
    { name: "Golang", level: 100, color: "from-cyan-400 to-cyan-600" },
    { name: "React", level: 100, color: "from-blue-400 to-blue-600" },
    { name: "Next.js", level: 100, color: "from-zinc-600 to-zinc-800" },
  ]

  return (
    <div className="p-4 rounded-2xl backdrop-filter backdrop-blur-xl bg-black/50 border border-zinc-800/50 shadow-xl">
      <div className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
        <span className="w-2 h-2 bg-green-400 rounded-full shadow-sm shadow-green-400/50" />
        Skills
      </div>
      <div className="space-y-3">
        {skills.map((skill) => (
          <div key={skill.name} className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-white font-semibold">{skill.name}</span>
              <span className="text-white/80 font-medium">MAX</span>
            </div>
            <div className="h-2 bg-zinc-800/60 rounded-full overflow-hidden">
              <div
                className={`h-full bg-gradient-to-r ${skill.color} rounded-full shadow-sm`}
                style={{ width: `${skill.level}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
