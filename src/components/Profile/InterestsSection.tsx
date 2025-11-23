interface InterestsSectionProps {
  interests: string[];
}

export function InterestsSection({ interests }: InterestsSectionProps) {
  return (
    <div className="mb-8">
      <h2 className="font-outfit font-semibold text-2xl text-[#1e4e79] mb-4">
        Interests
      </h2>
      <div className="flex flex-wrap gap-2">
        {interests.map((interest, index) => (
          <span
            key={index}
            className="px-4 py-2 bg-[#6eb2e6] text-white rounded-full font-outfit text-sm"
          >
            {interest}
          </span>
        ))}
      </div>
    </div>
  );
}

