"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { XIcon, Loader2 } from "lucide-react";

interface DeleteEventDialogProps {
  open: boolean;
  eventId: string | null;
  eventTitle?: string;
  onClose: () => void;
  onSuccess: () => void;
}

export function DeleteEventDialog({
  open,
  eventId,
  eventTitle,
  onClose,
  onSuccess,
}: DeleteEventDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      setError(null);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const handleDelete = async () => {
    if (!eventId) return;

    setIsDeleting(true);
    setError(null);

    try {
      const res = await fetch(`/api/events/${eventId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) {
        const data = await res.json();
        const errorMsg = data.error || "Failed to delete event";
        
        // Check if it's an auth issue
        if (res.status === 401 && errorMsg.includes("user")) {
          throw new Error(
            "You appear to be logged in as a user instead of an organization. " +
            "Please log out and log in as an organization, or use a different browser/incognito window."
          );
        }
        
        throw new Error(errorMsg);
      }

      onSuccess();
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to delete event");
    } finally {
      setIsDeleting(false);
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      aria-modal="true"
      role="dialog"
    >
      <div className="relative w-[420px] max-w-full bg-white rounded-2xl py-8 px-8 shadow-2xl text-center">
        <button
          type="button"
          onClick={onClose}
          disabled={isDeleting}
          className="absolute right-5 top-5 text-gray-400 hover:text-gray-600 disabled:opacity-50"
          aria-label="Close dialog"
        >
          <XIcon className="w-5 h-5" />
        </button>

        <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-[#ffecec] flex items-center justify-center">
          <Image
            src="/delete.png"
            alt="Delete warning"
            width={40}
            height={40}
            className="w-10 h-10"
          />
        </div>

        <h2 className="font-outfit font-semibold text-xl text-[#0e1f35] mb-2">
          Delete Event
        </h2>
        <p className="font-outfit text-sm text-gray-500 mb-2">
          Are you sure you want to delete{" "}
          {eventTitle ? (
            <span className="font-medium text-[#0e1f35]">&quot;{eventTitle}&quot;</span>
          ) : (
            "this event"
          )}
          ?
        </p>
        <p className="font-outfit text-xs text-gray-400 mb-6">
          This action cannot be undone.
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
            {error}
          </div>
        )}

        <div className="flex justify-center gap-4">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="h-[44px] min-w-[120px] rounded-full border border-gray-300 bg-white font-outfit font-medium text-sm text-[#0e1f35] hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className="h-[44px] min-w-[120px] rounded-full bg-[#f04438] text-white font-outfit font-medium text-sm hover:bg-[#d6362b] disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isDeleting && <Loader2 className="w-4 h-4 animate-spin" />}
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
