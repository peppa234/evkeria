
"use client";

type Props = {
  skills: string[];
  onAddSkill: (skill: string) => void;
  onRemoveSkill: (skill: string) => void;
};

export function SkillsSection({ skills, onAddSkill, onRemoveSkill }: Props) {
  const handleAdd = () => {
    const value = prompt("Enter a new skill");
    if (!value) return;
    onAddSkill(value.trim());
  };

  return (
    <section className="max-w-5xl mx-auto mt-8">
      <div className="rounded-3xl bg-white shadow-lg overflow-hidden">
        <div className="flex items-center gap-2 bg-[#E4F1FF] px-8 py-4">
          <img src="/skills.png" alt="Skills icon" className="w-5 h-5" />
          <h2 className="font-outfit font-semibold text-lg text-[#0B2443]">
            Skills
          </h2>
        </div>

        <div className="px-8 py-6">
          <div className="flex flex-wrap gap-3 mb-4">
            {skills.map((skill) => (
              <button
                key={skill}
                onClick={() => onRemoveSkill(skill)}
                className="flex items-center gap-2 rounded-full bg-[#E3ECF8] px-4 py-1 text-sm font-outfit text-[#1A2B4C]"
              >
                <span>{skill}</span>
                <span className="text-xs">✕</span>
              </button>
            ))}
          </div>

          <button
            onClick={handleAdd}
            className="font-outfit text-sm text-[#4A7FD9] hover:underline"
          >
            + Add Skill
          </button>
        </div>
      </div>
    </section>
  );
}
