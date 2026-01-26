"use client";

import { useState } from "react";
import { Button } from "@components/ui/button";

type Props = {
  skills: string[];
  onAddSkill: (skill: string) => void;
  onRemoveSkill: (skill: string) => void;
};

export function SkillsSection({ skills, onAddSkill, onRemoveSkill }: Props) {
  const [isAdding, setIsAdding] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const handleAdd = () => {
    const trimmedValue = inputValue.trim();
    if (trimmedValue && !skills.includes(trimmedValue)) {
      onAddSkill(trimmedValue);
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
        <div className="flex items-center gap-2 bg-[#E4F1FF] px-4 sm:px-6 md:px-8 py-3 sm:py-4">
          <img src="/skills.png" alt="Skills icon" className="w-4 h-4 sm:w-5 sm:h-5" />
          <h2 className="font-outfit font-semibold text-base sm:text-lg text-[#0B2443]">
            Skills
          </h2>
        </div>

        {/* Content */}
        <div className="px-4 sm:px-6 md:px-8 py-4 sm:py-6">
          {/* Skills Tags */}
          <div className="flex flex-wrap gap-2 sm:gap-3 mb-4">
            {skills.map((skill) => (
              <div
                key={skill}
                className="relative inline-flex items-center gap-2 bg-[#E8F2FF] border border-[#E1E9F4] rounded-full px-4 py-1 shadow-[0px_1px_2px_rgba(0,0,0,0.05)]"
              >
                <span className="font-outfit font-medium text-xs sm:text-sm text-[#1E4E79]">
                  {skill}
                </span>
                <button
                  onClick={() => onRemoveSkill(skill)}
                  className="flex items-center justify-center w-4 h-4 bg-[#9CA3AF] rounded-full hover:bg-[#6B7280] transition-colors"
                  aria-label={`Remove ${skill}`}
                >
                  <span className="text-white text-xs leading-none">×</span>
                </button>
              </div>
            ))}
          </div>

          {/* Add Skill */}
          {isAdding ? (
            <div className="flex flex-wrap gap-2 items-center">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter skill name"
                className="flex-1 min-w-[150px] px-4 py-2 rounded-lg border border-gray-200 font-outfit text-sm focus:outline-none focus:ring-2 focus:ring-[#4fa3e3]"
                autoFocus
              />
              <Button
                onClick={handleAdd}
                className="bg-[#4fa3e3] hover:bg-[#3d8ac4] text-white"
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
              className="font-outfit font-semibold text-sm text-[#1E4E79] hover:text-[#4fa3e3] transition-colors"
            >
              + Add Skill
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
