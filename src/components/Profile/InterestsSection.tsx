"use client";

import { useState } from "react";
import { Button } from "@components/ui/button";

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
  const [isAdding, setIsAdding] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const handleAdd = () => {
    const trimmedValue = inputValue.trim();
    if (trimmedValue && !interests.includes(trimmedValue)) {
      onAddInterest(trimmedValue);
      setInputValue("");
      setIsAdding(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAdd();
    }
  };

  return (
    <section className="w-full">
      <div className="rounded-2xl sm:rounded-3xl bg-white shadow-lg overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-2 bg-[#F4E9FF] px-4 sm:px-6 md:px-8 py-3 sm:py-4">
          <img src="/interest.png" alt="Interests icon" className="w-4 h-4 sm:w-5 sm:h-5" />
          <h2 className="font-outfit font-semibold text-base sm:text-lg text-[#0B2443]">
            Interests
          </h2>
        </div>

        {/* Content */}
        <div className="px-4 sm:px-6 md:px-8 py-4 sm:py-6">
          {/* Interests Tags */}
          <div className="flex flex-wrap gap-2 sm:gap-3 mb-4">
            {interests.map((interest) => (
              <div
                key={interest}
                className="relative inline-flex items-center gap-2 bg-[#EFE6FF] border border-[#E9D9FF] rounded-full px-4 py-1 shadow-[0px_1px_2px_rgba(0,0,0,0.05)]"
              >
                <span className="font-outfit font-medium text-xs sm:text-sm text-[#4A3580]">
                  {interest}
                </span>
                <button
                  onClick={() => onRemoveInterest(interest)}
                  className="flex items-center justify-center w-4 h-4 bg-[#9CA3AF] rounded-full hover:bg-[#6B7280] transition-colors"
                  aria-label={`Remove ${interest}`}
                >
                  <span className="text-white text-xs leading-none">×</span>
                </button>
              </div>
            ))}
          </div>

          {/* Add Interest */}
          {isAdding ? (
            <div className="flex flex-wrap gap-2 items-center">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter interest name"
                className="flex-1 min-w-[150px] px-4 py-2 rounded-lg border border-gray-200 font-outfit text-sm focus:outline-none focus:ring-2 focus:ring-[#9B7AD9]"
                autoFocus
              />
              <Button
                onClick={handleAdd}
                className="bg-[#9B7AD9] hover:bg-[#8a6ac9] text-white"
                size="sm"
              >
                Add
              </Button>
              <Button
                onClick={() => {
                  setIsAdding(false);
                  setInputValue("");
                }}
                variant="ghost"
                size="sm"
              >
                Cancel
              </Button>
            </div>
          ) : (
            <button
              onClick={() => setIsAdding(true)}
              className="font-outfit font-semibold text-sm text-[#4A3580] hover:text-[#9B7AD9] transition-colors"
            >
              + Add Interest
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
