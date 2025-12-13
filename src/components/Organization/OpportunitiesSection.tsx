"use client";

import { useState } from "react";
import { XIcon, StarIcon } from "lucide-react";
import { Button } from "@components/ui/button";

interface OpportunitiesSectionProps {
  initialOpportunities?: string[];
}

export function OpportunitiesSection({
  initialOpportunities = [],
}: OpportunitiesSectionProps) {
  const [opportunities, setOpportunities] = useState<string[]>(
    initialOpportunities.length > 0
      ? initialOpportunities
      : ["Internships", "Internships", "Internships"]
  );
  const [isAdding, setIsAdding] = useState(false);
  const [newOpportunity, setNewOpportunity] = useState("");

  const handleAddOpportunity = () => {
    if (newOpportunity.trim()) {
      setOpportunities([...opportunities, newOpportunity.trim()]);
      setNewOpportunity("");
      setIsAdding(false);
    }
  };

  const handleRemoveOpportunity = (index: number) => {
    setOpportunities(opportunities.filter((_, i) => i !== index));
  };

  return (
    <div className="bg-white rounded-[22px] mb-6 shadow-[0px_8px_32px_rgba(0,0,0,0.08)]">
      
      <div className="bg-[#F0F7FF] rounded-t-[15px] px-6 py-4">
        <div className="flex items-center gap-2">
          <StarIcon className="w-5 h-5 text-gray-800" />
          <h2 className="font-outfit font-semibold text-gray-800 text-lg">
            Opportunities
          </h2>
        </div>
      </div>

      
      <div className="px-6 py-6">
        <div className="flex flex-wrap gap-2 mb-4">
          {opportunities.map((opportunity, index) => (
            <div
              key={index}
              className="relative inline-flex items-center gap-2 bg-[#E8F2FF] border border-[#E1E9F4] rounded-full px-4 py-0.5 shadow-[0px_1px_2px_rgba(0,0,0,0.05)]"
            >
              <span className="font-inter font-semibold text-[11px] leading-[21px] text-[#1E4E79]">
                {opportunity}
              </span>
              <button
                onClick={() => handleRemoveOpportunity(index)}
                className="relative flex items-center justify-center w-[13px] h-[13px] bg-[#9CA3AF] rounded-full hover:bg-[#6B7280] transition-colors"
                aria-label={`Remove ${opportunity}`}
              >
                <span className="text-white text-[10px] leading-[15px] font-inter">
                  ×
                </span>
              </button>
            </div>
          ))}
        </div>

        {isAdding ? (
          <div className="flex gap-2 items-center">
            <input
              type="text"
              value={newOpportunity}
              onChange={(e) => setNewOpportunity(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleAddOpportunity()}
              placeholder="Enter opportunity type"
              className="flex-1 px-4 py-2 rounded-lg border border-gray-200 font-inter text-sm focus:outline-none focus:ring-2 focus:ring-[#4fa3e3]"
              autoFocus
            />
            <Button
              onClick={handleAddOpportunity}
              className="bg-[#4fa3e3] hover:bg-[#3d8ac4] text-white"
              size="sm"
            >
              Add
            </Button>
            <Button
              onClick={() => {
                setIsAdding(false);
                setNewOpportunity("");
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
            className="font-inter font-semibold text-[12px] leading-6 text-center text-[#1E4E79] hover:text-[#4fa3e3] transition-colors"
          >
            + Add Opportunity
          </button>
        )}
      </div>
    </div>
  );
}
