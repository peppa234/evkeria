interface SkillsSectionProps {
  skills: string[];
}

export function SkillsSection({ skills }: SkillsSectionProps) {
  return (
    <div className="mb-8">
      <h2 className="font-outfit font-semibold text-2xl text-[#1e4e79] mb-4">
        Skills
      </h2>
      <div className="flex flex-wrap gap-2">
        {skills.map((skill, index) => (
          <span
            key={index}
            className="px-4 py-2 bg-[#4fa3e3] text-white rounded-full font-outfit text-sm"
          >
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
}

