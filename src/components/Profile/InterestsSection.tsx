"use client";

type Props = {
  interests: string[];
  onAddInterest: (interest: string) => void;
  onRemoveInterest: (interest: string) => void;
};

export function InterestsSection({
  interests,
  onAddInterest,
  onRemoveInterest,
}: Props) {
  const handleAdd = () => {
    const value = prompt("Enter a new interest");
    if (!value) return;
    onAddInterest(value.trim());
  };

  return (
    <section className="max-w-5xl mx-auto mt-8 mb-24">
      <div className="rounded-3xl bg-white shadow-lg overflow-hidden">
        <div className="flex items-center gap-2 bg-[#F4E9FF] px-8 py-4">
          <img src="/interest.png" alt="Interests icon" className="w-5 h-5" />
          <h2 className="font-outfit font-semibold text-lg text-[#0B2443]">
            Interests
          </h2>
        </div>

        <div className="px-8 py-6">
          <div className="flex flex-wrap gap-3 mb-4">
            {interests.map((interest) => (
              <button
                key={interest}
                onClick={() => onRemoveInterest(interest)}
                className="flex items-center gap-2 rounded-full bg-[#EFE6FF] px-4 py-1 text-sm font-outfit text-[#4A3580]"
              >
                <span>{interest}</span>
                <span className="text-xs">✕</span>
              </button>
            ))}
          </div>

          <button
            onClick={handleAdd}
            className="font-outfit text-sm text-[#7A4BD9] hover:underline"
          >
            + Add Interest
          </button>
        </div>
      </div>
    </section>
  );
}
