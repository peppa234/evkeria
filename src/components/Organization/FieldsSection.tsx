"use client";

import { useState } from "react";
import { XIcon, ZapIcon } from "lucide-react";
import { Button } from "@components/ui/button";

interface FieldsSectionProps {
  initialFields?: string[];
}

export function FieldsSection({ initialFields = [] }: FieldsSectionProps) {
  const [fields, setFields] = useState<string[]>(
    initialFields.length > 0
      ? initialFields
      : ["Digital Marketing", "Digital Marketing", "Digital Marketing"]
  );
  const [isAdding, setIsAdding] = useState(false);
  const [newField, setNewField] = useState("");

  const handleAddField = () => {
    if (newField.trim()) {
      setFields([...fields, newField.trim()]);
      setNewField("");
      setIsAdding(false);
    }
  };

  const handleRemoveField = (index: number) => {
    setFields(fields.filter((_, i) => i !== index));
  };

  return (
    <div className="bg-white rounded-[22px] mb-6 shadow-[0px_8px_32px_rgba(0,0,0,0.08)]">
      
      <div className="bg-[#F0F7FF] rounded-t-[15px] px-6 py-4">
        <div className="flex items-center gap-2">
          <ZapIcon className="w-5 h-5 text-gray-800" />
          <h2 className="font-outfit font-semibold text-gray-800 text-lg">
            Fields
          </h2>
        </div>
      </div>

      
      <div className="px-6 py-6">
        <div className="flex flex-wrap gap-2 mb-4">
          {fields.map((field, index) => (
            <div
              key={index}
              className="relative inline-flex items-center gap-2 bg-[#E8F2FF] border border-[#E1E9F4] rounded-full px-4 py-0.5 shadow-[0px_1px_2px_rgba(0,0,0,0.05)]"
            >
              <span className="font-inter font-semibold text-[11px] leading-[21px] text-[#1E4E79]">
                {field}
              </span>
              <button
                onClick={() => handleRemoveField(index)}
                className="relative flex items-center justify-center w-[13px] h-[13px] bg-[#9CA3AF] rounded-full hover:bg-[#6B7280] transition-colors"
                aria-label={`Remove ${field}`}
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
              value={newField}
              onChange={(e) => setNewField(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleAddField()}
              placeholder="Enter field name"
              className="flex-1 px-4 py-2 rounded-lg border border-gray-200 font-inter text-sm focus:outline-none focus:ring-2 focus:ring-[#4fa3e3]"
              autoFocus
            />
            <Button
              onClick={handleAddField}
              className="bg-[#4fa3e3] hover:bg-[#3d8ac4] text-white"
              size="sm"
            >
              Add
            </Button>
            <Button
              onClick={() => {
                setIsAdding(false);
                setNewField("");
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
            + Add Field
          </button>
        )}
      </div>
    </div>
  );
}
