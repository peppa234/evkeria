"use client";

import { useEffect } from "react";
import Image from "next/image";
import { XIcon, PencilIcon } from "lucide-react";

interface EventEditDialogProps {
  open: boolean;
  mode: "create" | "edit"; 
  onClose: () => void;
}

export function EventEditDialog({ open, mode, onClose }: EventEditDialogProps) {
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

  const title = mode === "edit" ? "Edit Event" : "Create Event";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      aria-modal="true"
      role="dialog"
    >
      <div className="relative w-[900px] max-w-[95vw] bg-white rounded-2xl shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-6 top-6 text-gray-400 hover:text-gray-600"
          aria-label="Close dialog"
        >
          <XIcon className="w-5 h-5" />
        </button>

        <div className="px-10 pt-8 pb-6">
          <h2 className="font-outfit font-semibold text-2xl text-[#0e1f35] mb-6">
            {title}
          </h2>

          
          <form className="space-y-6">
            
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block font-outfit text-sm text-gray-600">
                  Event Name
                </label>
                <input
                  className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm font-outfit focus:outline-none focus:ring-2 focus:ring-[#4fa3e3]"
                  placeholder="Enter event name"
                />
              </div>

              <div className="space-y-2">
                <label className="block font-outfit text-sm text-gray-600">
                  Description
                </label>
                <textarea
                  rows={3}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm font-outfit focus:outline-none focus:ring-2 focus:ring-[#4fa3e3]"
                  placeholder="Write your description here ..."
                />
              </div>
            </div>

            
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block font-outfit text-sm text-gray-600">
                  Event Date
                </label>
                <input
                  type="date"
                  className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm font-outfit focus:outline-none focus:ring-2 focus:ring-[#4fa3e3]"
                />
              </div>

              <div className="space-y-2">
                <label className="block font-outfit text-sm text-gray-600">
                  Registration Deadline
                </label>
                <input
                  type="date"
                  className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm font-outfit focus:outline-none focus:ring-2 focus:ring-[#4fa3e3]"
                />
              </div>
            </div>

           
            <div className="grid grid-cols-2 gap-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block font-outfit text-sm text-gray-600">
                    Start Time
                  </label>
                  <input
                    type="time"
                    className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm font-outfit focus:outline-none focus:ring-2 focus:ring-[#4fa3e3]"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block font-outfit text-sm text-gray-600">
                    End Time
                  </label>
                  <input
                    type="time"
                    className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm font-outfit focus:outline-none focus:ring-2 focus:ring-[#4fa3e3]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block font-outfit text-sm text-gray-600">
                    Location
                  </label>
                  <input
                    className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm font-outfit focus:outline-none focus:ring-2 focus:ring-[#4fa3e3]"
                    placeholder="Event location"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block font-outfit text-sm text-gray-600">
                    Category
                  </label>
                  <select className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm font-outfit bg-white focus:outline-none focus:ring-2 focus:ring-[#4fa3e3]">
                    <option>Technology</option>
                    <option>Business</option>
                    <option>Marketing</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block font-outfit text-sm text-gray-600">
                    Status
                  </label>
                  <select className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm font-outfit bg-white focus:outline-none focus:ring-2 focus:ring-[#4fa3e3]">
                    <option>Upcoming</option>
                    <option>Active</option>
                    <option>Past</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="block font-outfit text-sm text-gray-600">
                    Max Attendees
                  </label>
                  <input
                    type="number"
                    className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm font-outfit focus:outline-none focus:ring-2 focus:ring-[#4fa3e3]"
                    placeholder="Maximum number of attendees"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block font-outfit text-sm text-gray-600">
                  Price ($)
                </label>
                <input
                  type="number"
                  className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm font-outfit focus:outline-none focus:ring-2 focus:ring-[#4fa3e3]"
                  placeholder="Price per individual"
                />
              </div>
            </div>

            
            <div className="mt-4 relative overflow-hidden rounded-xl h-[140px]">
              <Image
                src="/event.png" 
                alt="Event banner"
                width={1200}
                height={200}
                className="w-full h-full object-cover"
              />
              
              {/* Edit image icon over banner */}
              {/* Hidden file input */}
              <input
                id="event-image-input"
                type="file"
                accept="image/*"
                className="hidden"
              />

              <button
                type="button"
                onClick={() =>
                  document.getElementById("event-image-input")?.click()
                }
                className="absolute top-4 right-4 w-11 h-11 rounded-full bg-white shadow-md flex items-center justify-center hover:shadow-lg transition-shadow z-10 hover:bg-gray-50"
                aria-label="Change event image"
              >
                <PencilIcon className="w-5 h-5 text-[#4fa3e3]" />
              </button>
            </div>


            <div className="mt-6 flex justify-end gap-4">
              <button
                type="button"
                onClick={onClose}
                className="h-[48px] px-8 rounded-full border border-gray-300 font-outfit font-medium text-sm text-[#0e1f35] bg-white hover:bg-gray-50"
              >
                Discard
              </button>
              <button
                type="submit"
                className="h-[48px] px-10 rounded-full bg-[#4fa3e3] text-white font-outfit font-semibold text-sm hover:bg-[#4fa3e3]/90"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
