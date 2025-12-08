"use client"

export function SkillsWidget() {
  const skills = [
    { name: "Golang", level: 100, color: "from-cyan-400 to-cyan-600" },
    { name: "React", level: 100, color: "from-blue-400 to-blue-600" },
    { name: "Next.js", level: 100, color: "from-zinc-600 to-zinc-800" },
  ]

  return (
    <div className="widget p-4">
      <div className="text-sm font-semibold text-white mb-3 flex items-center gap-2 drop-shadow-md">
        <span className="w-2 h-2 bg-green-400 rounded-full" />
        Skills
      </div>
      <div className="space-y-3">
        {skills.map((skill) => (
          <div key={skill.name} className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-white font-semibold drop-shadow-md">{skill.name}</span>
              <span className="text-white font-medium drop-shadow-md">MAX</span>
            </div>
            <div className="h-2 bg-black/20 rounded-full overflow-hidden">
              <div
                className={`h-full bg-gradient-to-r ${skill.color} rounded-full`}
                style={{ width: `${skill.level}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
