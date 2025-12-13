"use client";

import { Sidebar, SIDEBAR_WIDTH } from "@components/Organization/Sidebar";

export default function CreateEventPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      <div className="flex-1 p-4 sm:p-6 md:p-8 md:ml-[280px] pt-16 md:pt-8">
        <h1 className="font-outfit font-semibold text-[#1e4e79] text-4xl mb-8">
          Create Event
        </h1>
        <p className="font-outfit text-[#1e4e79] text-lg">
          To be implemented
        </p>
      </div>
    </div>
  );
}