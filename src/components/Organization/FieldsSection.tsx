"use client";

import { useState, useEffect } from "react";
import { ZapIcon, Loader2 } from "lucide-react";
import { Button } from "@components/ui/button";
import { useOrganizationAuth } from "@context/OrganizationAuthContext";

interface FieldsSectionProps {
  initialFields?: string[];
}

export function FieldsSection({ initialFields = [] }: FieldsSectionProps) {
  const { organization, refreshOrganization } = useOrganizationAuth();
  const [fields, setFields] = useState<string[]>(
    initialFields.length > 0 ? initialFields : []
  );
  const [isAdding, setIsAdding] = useState(false);
  const [newField, setNewField] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    setFields(initialFields);
  }, [initialFields]);

  const saveFields = async (newFields: string[]) => {
    if (!organization?.id) return;

    setIsSaving(true);
    setError(null);

    try {
      const res = await fetch(`/api/organizations/${organization.id}/fields`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ fields: newFields }),
      });

      const data = await res.json();

      // Standardized format: { success: true, data: { fields: [...] } }
      if (res.ok && data.success && data.data?.fields) {
        setFields(data.data.fields);
        await refreshOrganization(); // Refresh organization context
      } else {
        const errorMsg = data.error?.message || "Failed to save fields";
        setError(errorMsg);
        throw new Error(errorMsg);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save fields");
      // Revert to previous state on error
      setFields(initialFields);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddField = async () => {
    if (newField.trim()) {
      const updatedFields = [...fields, newField.trim()];
      setFields(updatedFields); // Optimistic update
      setNewField("");
      setIsAdding(false);
      await saveFields(updatedFields);
    }
  };

  const handleRemoveField = async (index: number) => {
    const updatedFields = fields.filter((_, i) => i !== index);
    setFields(updatedFields); // Optimistic update
    await saveFields(updatedFields);
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
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}
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
                disabled={isSaving}
                className="relative flex items-center justify-center w-[13px] h-[13px] bg-[#9CA3AF] rounded-full hover:bg-[#6B7280] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
              onKeyPress={(e) => e.key === "Enter" && !isSaving && handleAddField()}
              placeholder="Enter field name"
              disabled={isSaving}
              className="flex-1 px-4 py-2 rounded-lg border border-gray-200 font-inter text-sm focus:outline-none focus:ring-2 focus:ring-[#4fa3e3] disabled:opacity-50"
              autoFocus
            />
            <Button
              onClick={handleAddField}
              disabled={isSaving}
              className="bg-[#4fa3e3] hover:bg-[#3d8ac4] text-white"
              size="sm"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Add"}
            </Button>
            <Button
              onClick={() => {
                setIsAdding(false);
                setNewField("");
              }}
              disabled={isSaving}
              variant="ghost"
              size="sm"
            >
              Cancel
            </Button>
          </div>
        ) : (
          <button
            onClick={() => setIsAdding(true)}
            disabled={isSaving}
            className="font-inter font-semibold text-[12px] leading-6 text-center text-[#1E4E79] hover:text-[#4fa3e3] transition-colors disabled:opacity-50"
          >
            {isSaving ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving...
              </span>
            ) : (
              "+ Add Field"
            )}
          </button>
        )}
      </div>
    </div>
  );
}
