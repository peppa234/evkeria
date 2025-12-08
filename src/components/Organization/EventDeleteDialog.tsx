"use client";

import { useEffect } from "react";
import Image from "next/image";
import { XIcon } from "lucide-react";

interface DeleteEventDialogProps {
  open: boolean;
  onClose: () => void;
}

export function DeleteEventDialog({ open, onClose }: DeleteEventDialogProps) {
  
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      aria-modal="true"
      role="dialog"
    >
      <div className="relative w-[420px] max-w-[90vw] bg-white rounded-2xl py-8 px-8 shadow-2xl text-center">
        
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 text-gray-400 hover:text-gray-600"
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
        <p className="font-outfit text-sm text-gray-500 mb-8">
          Are you sure you want to delete this event? This action cannot be
          undone.
        </p>

        <div className="flex justify-center gap-4">
          <button
            type="button"
            onClick={onClose}
            className="h-[44px] min-w-[120px] rounded-full border border-gray-300 bg-white font-outfit font-medium text-sm text-[#0e1f35] hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="button"
            className="h-[44px] min-w-[120px] rounded-full bg-[#f04438] text-white font-outfit font-medium text-sm hover:bg-[#d6362b]"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
