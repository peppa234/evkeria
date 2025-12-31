"use client";

import { useState, useEffect } from "react";
import { StarIcon, Loader2 } from "lucide-react";
import { Button } from "@components/ui/button";
import { useOrganizationAuth } from "@context/OrganizationAuthContext";

interface OpportunitiesSectionProps {
  initialOpportunities?: string[];
}

export function OpportunitiesSection({
  initialOpportunities = [],
}: OpportunitiesSectionProps) {
  const { organization, refreshOrganization } = useOrganizationAuth();
  const [opportunities, setOpportunities] = useState<string[]>(
    initialOpportunities.length > 0 ? initialOpportunities : []
  );
  const [isAdding, setIsAdding] = useState(false);
  const [newOpportunity, setNewOpportunity] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Update opportunities when initialOpportunities change (e.g., after refresh)
  useEffect(() => {
    setOpportunities(initialOpportunities);
  }, [initialOpportunities]);

  const saveOpportunities = async (newOpportunities: string[]) => {
    if (!organization?.id) return;

    setIsSaving(true);
    setError(null);

    try {
      const res = await fetch(`/api/organizations/${organization.id}/opportunities`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ opportunities: newOpportunities }),
      });

      const data = await res.json();

      // Standardized format: { success: true, data: { opportunities: [...] } }
      if (res.ok && data.success && data.data?.opportunities) {
        setOpportunities(data.data.opportunities);
        await refreshOrganization(); // Refresh organization context
      } else {
        const errorMsg = data.error?.message || "Failed to save opportunities";
        setError(errorMsg);
        throw new Error(errorMsg);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save opportunities");
      // Revert to previous state on error
      setOpportunities(initialOpportunities);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddOpportunity = async () => {
    if (newOpportunity.trim()) {
      const updatedOpportunities = [...opportunities, newOpportunity.trim()];
      setOpportunities(updatedOpportunities); // Optimistic update
      setNewOpportunity("");
      setIsAdding(false);
      await saveOpportunities(updatedOpportunities);
    }
  };

  const handleRemoveOpportunity = async (index: number) => {
    const updatedOpportunities = opportunities.filter((_, i) => i !== index);
    setOpportunities(updatedOpportunities); // Optimistic update
    await saveOpportunities(updatedOpportunities);
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
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}
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
                disabled={isSaving}
                className="relative flex items-center justify-center w-[13px] h-[13px] bg-[#9CA3AF] rounded-full hover:bg-[#6B7280] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
              onKeyPress={(e) => e.key === "Enter" && !isSaving && handleAddOpportunity()}
              placeholder="Enter opportunity type"
              disabled={isSaving}
              className="flex-1 px-4 py-2 rounded-lg border border-gray-200 font-inter text-sm focus:outline-none focus:ring-2 focus:ring-[#4fa3e3] disabled:opacity-50"
              autoFocus
            />
            <Button
              onClick={handleAddOpportunity}
              disabled={isSaving}
              className="bg-[#4fa3e3] hover:bg-[#3d8ac4] text-white"
              size="sm"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Add"}
            </Button>
            <Button
              onClick={() => {
                setIsAdding(false);
                setNewOpportunity("");
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
              "+ Add Opportunity"
            )}
          </button>
        )}
      </div>
    </div>
  );
}
