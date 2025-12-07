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
    <section className="max-w-full sm:max-w-2xl md:max-w-4xl lg:max-w-5xl mx-auto mt-6 sm:mt-8 mb-12 sm:mb-16 md:mb-24 px-4 sm:px-6">
      <div className="rounded-2xl sm:rounded-3xl bg-white shadow-lg overflow-hidden">
        <div className="flex items-center gap-2 bg-[#F4E9FF] px-4 sm:px-6 md:px-8 py-3 sm:py-4">
          <img src="/interest.png" alt="Interests icon" className="w-4 h-4 sm:w-5 sm:h-5" />
          <h2 className="font-outfit font-semibold text-base sm:text-lg text-[#0B2443]">
            Interests
          </h2>
        </div>

        <div className="px-4 sm:px-6 md:px-8 py-4 sm:py-6">
          <div className="flex flex-wrap gap-2 sm:gap-3 mb-3 sm:mb-4">
            {interests.map((interest) => (
              <button
                key={interest}
                onClick={() => onRemoveInterest(interest)}
                className="flex items-center gap-1 sm:gap-2 rounded-full bg-[#EFE6FF] px-3 sm:px-4 py-1 text-xs sm:text-sm font-outfit text-[#4A3580]"
              >
                <span>{interest}</span>
                <span className="text-xs">✕</span>
              </button>
            ))}
          </div>

          <button
            onClick={handleAdd}
            className="font-outfit text-xs sm:text-sm text-[#7A4BD9] hover:underline"
          >
            + Add Interest
          </button>
        </div>
      </div>
    </section>
  );
}
